import axios from "axios";

const OPENALEX_BASE_URL = "https://api.openalex.org";

const isDOI = (value) => /^10\./.test(value.trim());

const dedupeUrls = (values) => [
  ...new Set(values.filter(Boolean).map((value) => value.trim())),
];

const getPdfCandidates = (item) => {
  const candidates = [];

  if (item.primary_location?.pdf_url) {
    candidates.push(item.primary_location.pdf_url);
  }
  if (item.best_oa_location?.pdf_url) {
    candidates.push(item.best_oa_location.pdf_url);
  }

  const locations = Array.isArray(item.locations) ? item.locations : [];
  locations.forEach((location) => {
    if (location?.pdf_url) {
      candidates.push(location.pdf_url);
    }
  });

  return dedupeUrls(candidates);
};

const getLandingPage = (item) => {
  const landingPage =
    item.primary_location?.landing_page_url ||
    item.best_oa_location?.landing_page_url ||
    item.locations?.find((location) => location?.landing_page_url)
      ?.landing_page_url ||
    null;

  if (landingPage) {
    return landingPage;
  }

  if (item.doi) {
    return `https://doi.org/${item.doi}`;
  }

  return null;
};

const probePdfUrl = async (pdfUrl) => {
  if (!pdfUrl) {
    return null;
  }

  try {
    const response = await axios.head(pdfUrl, {
      timeout: 5000,
      maxRedirects: 3,
      validateStatus: () => true,
    });

    if (response.status >= 200 && response.status < 400) {
      return pdfUrl;
    }
  } catch (_error) {
    // Fall back to GET if HEAD fails or is unsupported.
  }

  try {
    const response = await axios.get(pdfUrl, {
      timeout: 5000,
      maxRedirects: 3,
      validateStatus: () => true,
    });

    if (response.status >= 200 && response.status < 400) {
      return pdfUrl;
    }
  } catch (_error) {
    return null;
  }

  return null;
};

const normalizePaper = async (item) => {
  const authors =
    item.authorships
      ?.map((entry) => entry.author?.display_name)
      .filter(Boolean) || [];
  const topics =
    item.primary_concepts
      ?.map((concept) => concept.display_name)
      .filter(Boolean) || [];
  const pdfCandidates = getPdfCandidates(item);
  const landingPage = getLandingPage(item);
  const abstract = item.abstract_inverted_index
    ? item.abstract || "Abstract available in OpenAlex metadata."
    : null;

  let pdfUrl = null;

  for (const candidate of pdfCandidates) {
    const accessiblePdfUrl = await probePdfUrl(candidate);
    if (accessiblePdfUrl) {
      pdfUrl = accessiblePdfUrl;
      break;
    }
  }

  return {
    title: item.title || "Untitled",
    authors,
    journal: item.primary_location?.source?.display_name || "Unknown Journal",
    year: item.publication_year || null,
    doi: item.doi || null,
    abstract,
    citationCount: item.cited_by_count || 0,
    isOpenAccess: Boolean(item.open_access?.is_oa),
    pdfUrl,
    landingPage,
    publisher:
      item.primary_location?.source?.host_organization_name ||
      "Unknown Publisher",
    language: item.language || "Unknown",
    type: item.type || "article",
    topics,
    keywords: item.keywords?.map((k) => k.display_name).filter(Boolean) || [],
    license: item.license || null,
    openAlexId: item.ids?.doi || item.id || null,
  };
};

export const searchPaperService = async (query) => {
  const cleanedQuery = query.trim();
  const url = isDOI(cleanedQuery)
    ? `${OPENALEX_BASE_URL}/works/doi:${encodeURIComponent(cleanedQuery)}`
    : `${OPENALEX_BASE_URL}/works?search=${encodeURIComponent(cleanedQuery)}`;

  try {
    const response = await axios.get(url, { timeout: 10000 });
    const data = response.data;

    const results = Array.isArray(data.results) ? data.results : [data];
    const papers = (
      await Promise.all(results.filter(Boolean).slice(0, 5).map(normalizePaper))
    ).filter(Boolean);

    return {
      query: cleanedQuery,
      count: papers.length,
      papers,
      error: papers.length ? null : "No results were found.",
    };
  } catch (error) {
    const status = error?.response?.status;

    if (status === 404) {
      return {
        query: cleanedQuery,
        count: 0,
        papers: [],
        error: "No results were found.",
      };
    }

    if (error?.code === "ECONNABORTED" || error?.message?.includes("timeout")) {
      return {
        query: cleanedQuery,
        count: 0,
        papers: [],
        error: "The request timed out. Please try again.",
      };
    }

    return {
      query: cleanedQuery,
      count: 0,
      papers: [],
      error: "Unable to fetch results right now.",
    };
  }
};
