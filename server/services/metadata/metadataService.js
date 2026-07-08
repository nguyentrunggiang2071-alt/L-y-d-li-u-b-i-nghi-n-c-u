import axios from "axios";

const OPENALEX_BASE_URL = "https://api.openalex.org";
const CROSSREF_BASE_URL = "https://api.crossref.org/works";
const UNPAYWALL_BASE_URL = "https://api.unpaywall.org/works";

const normalizeDoiInput = (value) => {
  const raw = String(value || "").trim();
  if (!raw) {
    return "";
  }

  const cleaned = raw.replace(/^#+\s*/, "").trim();
  const doiMatch = cleaned.match(/10\.\d{4,9}\/[-._;()/:A-Z0-9]+/i);

  if (doiMatch) {
    return doiMatch[0];
  }

  return cleaned
    .replace(/^doi:\s*/i, "")
    .replace(/^https?:\/\/(?:dx\.)?doi\.org\//i, "")
    .trim();
};

const isValidDoi = (value) => /^10\./.test(normalizeDoiInput(value));

const normalizeOpenAlexPaper = (item) => {
  const authors =
    item.authorships
      ?.map((entry) => entry.author?.display_name)
      .filter(Boolean) || [];
  const pdfUrl =
    item.primary_location?.pdf_url || item.best_oa_location?.pdf_url || null;
  const landingPage =
    item.primary_location?.landing_page_url || item.doi || null;

  return {
    title: item.title || "Untitled",
    doi: item.doi || null,
    authors,
    journal: item.primary_location?.source?.display_name || "Unknown Journal",
    year: item.publication_year || null,
    publisher:
      item.primary_location?.source?.host_organization_name ||
      "Unknown Publisher",
    abstract: item.abstract || null,
    citationCount: item.cited_by_count || 0,
    isOpenAccess: Boolean(item.open_access?.is_oa),
    pdfUrl,
    landingPage,
    language: item.language || "Unknown",
    type: item.type || "article",
    license: item.license || null,
    openAlexId: item.id || null,
    source: "openalex",
  };
};

const normalizeCrossrefPaper = (item) => ({
  title: item.title?.[0] || "Untitled",
  doi: item.DOI || null,
  authors:
    item.author
      ?.map((entry) => `${entry.given || ""} ${entry.family || ""}`.trim())
      .filter(Boolean) || [],
  journal: item["container-title"]?.[0] || "Unknown Journal",
  year:
    item["published-print"]?.["date-parts"]?.[0]?.[0] ||
    item["published-online"]?.["date-parts"]?.[0]?.[0] ||
    null,
  publisher: item.publisher || "Unknown Publisher",
  abstract: null,
  citationCount: 0,
  isOpenAccess: false,
  pdfUrl: null,
  landingPage: item.URL || null,
  language: item.language || "Unknown",
  type: item.type || "article",
  license: null,
  openAlexId: null,
  source: "crossref",
});

const normalizeUnpaywallPaper = (item) => ({
  title: item.title || "Untitled",
  doi: item.DOI || null,
  authors:
    item.authors
      ?.map((entry) => entry.family || entry.given || entry.name || "")
      .filter(Boolean) || [],
  journal: item.journal_name || "Unknown Journal",
  year: item.year || null,
  publisher: item.publisher || "Unknown Publisher",
  abstract: item.abstract || null,
  citationCount: 0,
  isOpenAccess: Boolean(item.is_oa),
  pdfUrl: item.best_oa_location?.url || item.oa_locations?.[0]?.url || null,
  landingPage: item.doi_url || item.best_oa_location?.landing_page_url || null,
  language: "Unknown",
  type: "article",
  license: item.license || null,
  openAlexId: null,
  source: "unpaywall",
});

const mergePaper = (openalexPaper, crossrefPaper, unpaywallPaper) => {
  const merged = {
    title:
      openalexPaper?.title ||
      crossrefPaper?.title ||
      unpaywallPaper?.title ||
      "Untitled",
    doi:
      openalexPaper?.doi || crossrefPaper?.doi || unpaywallPaper?.doi || null,
    authors: openalexPaper?.authors?.length
      ? openalexPaper.authors
      : crossrefPaper?.authors || unpaywallPaper?.authors || [],
    journal:
      openalexPaper?.journal ||
      crossrefPaper?.journal ||
      unpaywallPaper?.journal ||
      "Unknown Journal",
    year:
      openalexPaper?.year ||
      crossrefPaper?.year ||
      unpaywallPaper?.year ||
      null,
    publisher:
      openalexPaper?.publisher ||
      crossrefPaper?.publisher ||
      unpaywallPaper?.publisher ||
      "Unknown Publisher",
    abstract:
      openalexPaper?.abstract ||
      crossrefPaper?.abstract ||
      unpaywallPaper?.abstract ||
      null,
    citationCount: openalexPaper?.citationCount || 0,
    isOpenAccess:
      openalexPaper?.isOpenAccess || unpaywallPaper?.isOpenAccess || false,
    pdfUrl: openalexPaper?.pdfUrl || unpaywallPaper?.pdfUrl || null,
    landingPage:
      openalexPaper?.landingPage ||
      crossrefPaper?.landingPage ||
      unpaywallPaper?.landingPage ||
      null,
    language: openalexPaper?.language || crossrefPaper?.language || "Unknown",
    type: openalexPaper?.type || crossrefPaper?.type || "article",
    license: openalexPaper?.license || unpaywallPaper?.license || null,
    openAlexId: openalexPaper?.openAlexId || null,
    source: "merged",
  };

  return merged;
};

export const getMetadataForDoi = async (doi) => {
  const cleaned = normalizeDoiInput(doi);
  if (!isValidDoi(cleaned)) {
    return { doi: cleaned, status: "invalid", error: "Invalid DOI" };
  }

  try {
    const [openalexResponse, crossrefResponse, unpaywallResponse] =
      await Promise.allSettled([
        axios.get(
          `${OPENALEX_BASE_URL}/works/doi:${encodeURIComponent(cleaned)}`,
          { timeout: 10000 },
        ),
        axios.get(`${CROSSREF_BASE_URL}/${encodeURIComponent(cleaned)}`, {
          timeout: 10000,
        }),
        axios.get(
          `${UNPAYWALL_BASE_URL}/${encodeURIComponent(cleaned)}?email=research@example.com`,
          { timeout: 10000 },
        ),
      ]);

    const openalexPaper =
      openalexResponse.status === "fulfilled"
        ? normalizeOpenAlexPaper(openalexResponse.value.data)
        : null;
    const crossrefPaper =
      crossrefResponse.status === "fulfilled"
        ? normalizeCrossrefPaper(crossrefResponse.value.data.message)
        : null;
    const unpaywallPaper =
      unpaywallResponse.status === "fulfilled"
        ? normalizeUnpaywallPaper(unpaywallResponse.value.data)
        : null;

    const merged = mergePaper(openalexPaper, crossrefPaper, unpaywallPaper);

    return {
      doi: cleaned,
      status: "success",
      paper: merged,
    };
  } catch (error) {
    return {
      doi: cleaned,
      status: "error",
      error: error.message || "Metadata request failed",
    };
  }
};

export const getBatchMetadata = async (dois) => {
  const seen = new Set();
  const uniqueDois = [];
  const invalidDois = [];
  const duplicateDois = [];

  for (const item of dois || []) {
    const normalized = normalizeDoiInput(item);

    if (!normalized) {
      continue;
    }

    if (!isValidDoi(normalized)) {
      invalidDois.push(normalized);
      continue;
    }

    if (seen.has(normalized)) {
      duplicateDois.push(normalized);
      continue;
    }

    seen.add(normalized);
    uniqueDois.push(normalized);
  }

  const results = [];
  for (const doi of uniqueDois) {
    const result = await getMetadataForDoi(doi);
    results.push(result);
  }

  return {
    requestedCount: (dois || []).length,
    validCount: uniqueDois.length,
    invalidCount: invalidDois.length,
    duplicateCount: duplicateDois.length,
    total: uniqueDois.length,
    completed: results.length,
    completedCount: results.length,
    results,
  };
};
