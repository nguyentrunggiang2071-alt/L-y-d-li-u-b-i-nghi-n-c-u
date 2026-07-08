import { useState } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import {
  FiAlertCircle,
  FiBookOpen,
  FiCheckCircle,
  FiExternalLink,
  FiRefreshCw,
  FiTrash2,
} from "react-icons/fi";

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

const BatchSearchPanel = () => {
  const { t } = useTranslation();
  const [input, setInput] = useState("");
  const [status, setStatus] = useState("");
  const [results, setResults] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const dois = input
      .split(/\n|,/)
      .map((item) => normalizeDoiInput(item))
      .filter(Boolean);

    if (!dois.length) {
      setStatus(t("batch.empty"));
      setResults([]);
      setSummary(null);
      return;
    }

    setLoading(true);
    setStatus(t("batch.processing", { count: dois.length }));

    try {
      const response = await axios.post("/api/metadata/batch", { dois });
      const data = response.data || {};
      setResults(data.results || []);
      setSummary({
        requestedCount: data.requestedCount || dois.length,
        validCount: data.validCount || 0,
        invalidCount: data.invalidCount || 0,
        duplicateCount: data.duplicateCount || 0,
        completedCount: data.completedCount || (data.results || []).length,
      });
      setStatus(
        t("batch.completed", {
          completed: data.completedCount || (data.results || []).length,
          total: data.validCount || data.total || dois.length,
        }),
      );
    } catch (error) {
      setStatus(error.response?.data?.error || t("batch.failed"));
      setResults([]);
      setSummary(null);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setInput("");
    setResults([]);
    setSummary(null);
    setStatus("");
  };

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg shadow-slate-950/30">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">
            {t("batch.title")}
          </h3>
          <p className="mt-2 text-sm text-slate-400">
            {t("batch.description")}
          </p>
        </div>
        <button
          type="button"
          onClick={handleClear}
          className="flex items-center gap-2 self-start rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-300"
        >
          <FiTrash2 /> {t("batch.clear")}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-4 space-y-3">
        <textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          rows={7}
          className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-3 py-3 text-sm text-white outline-none"
          placeholder={t("batch.placeholder")}
        />
        <div className="flex flex-wrap gap-2">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? (
              <FiRefreshCw className="animate-spin" />
            ) : (
              <FiBookOpen />
            )}{" "}
            {loading ? t("batch.processingShort") : t("batch.submit")}
          </button>
          <button
            type="button"
            onClick={() =>
              setInput(
                "10.1038/s41592-019-0686-2\n10.1371/journal.pone.0272730\n10.1371/journal.pone.0230416\n10.1371/journal.pone.0272845",
              )
            }
            className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-slate-300"
          >
            {t("batch.example")}
          </button>
        </div>
      </form>

      {status && <p className="mt-3 text-sm text-cyan-300">{status}</p>}

      {summary && (
        <div className="mt-4 grid gap-3 sm:grid-cols-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              {t("batch.requested")}
            </p>
            <p className="mt-1 text-lg font-semibold text-white">
              {summary.requestedCount}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              {t("batch.valid")}
            </p>
            <p className="mt-1 text-lg font-semibold text-emerald-300">
              {summary.validCount}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              {t("batch.invalid")}
            </p>
            <p className="mt-1 text-lg font-semibold text-amber-300">
              {summary.invalidCount}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              {t("batch.duplicates")}
            </p>
            <p className="mt-1 text-lg font-semibold text-cyan-300">
              {summary.duplicateCount}
            </p>
          </div>
        </div>
      )}

      {results.length > 0 && (
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm text-slate-300">
            <thead>
              <tr className="border-b border-slate-800 text-xs uppercase tracking-wide text-slate-500">
                <th className="py-2 pr-3">{t("batch.doi")}</th>
                <th className="py-2 pr-3">{t("batch.title")}</th>
                <th className="py-2 pr-3">{t("batch.status")}</th>
                <th className="py-2 pr-3">{t("batch.access")}</th>
                <th className="py-2 text-right">{t("batch.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {results.map((item) => (
                <tr
                  key={item.doi}
                  className="border-b border-slate-800/80 align-top"
                >
                  <td className="py-2 pr-3">
                    <div className="font-mono text-xs text-slate-300">
                      {item.doi}
                    </div>
                    {item.error && (
                      <div className="mt-1 flex items-center gap-1 text-xs text-amber-300">
                        <FiAlertCircle /> {item.error}
                      </div>
                    )}
                  </td>
                  <td className="py-2 pr-3">
                    <div className="font-medium text-white">
                      {item.paper?.title || t("batch.noTitle")}
                    </div>
                    {item.paper?.journal && (
                      <div className="mt-1 text-xs text-slate-400">
                        {item.paper.journal}
                      </div>
                    )}
                  </td>
                  <td className="py-2 pr-3">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${item.status === "success" ? "bg-emerald-500/15 text-emerald-300" : "bg-amber-500/15 text-amber-300"}`}
                    >
                      {item.status === "success" ? (
                        <FiCheckCircle />
                      ) : (
                        <FiAlertCircle />
                      )}{" "}
                      {item.status === "success"
                        ? t("batch.success")
                        : t("batch.invalid")}
                    </span>
                  </td>
                  <td className="py-2 pr-3">
                    {item.paper?.isOpenAccess ? (
                      <span className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-medium text-emerald-300">
                        {t("paper.openAccess")}
                      </span>
                    ) : (
                      <span className="rounded-full bg-rose-500/15 px-2.5 py-1 text-xs font-medium text-rose-300">
                        {t("paper.subscriptionRequired")}
                      </span>
                    )}
                  </td>
                  <td className="py-2 text-right">
                    <div className="flex justify-end gap-2">
                      {item.paper?.pdfUrl && (
                        <a
                          href={item.paper.pdfUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm text-cyan-300 hover:text-cyan-200"
                        >
                          {t("paper.downloadPdf")}
                        </a>
                      )}
                      {item.paper?.landingPage && (
                        <a
                          href={item.paper.landingPage}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm text-slate-300 hover:text-white"
                        >
                          {t("paper.viewArticle")}
                        </a>
                      )}
                      {item.doi && (
                        <a
                          href={`https://doi.org/${item.doi}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm text-slate-300 hover:text-white"
                        >
                          <FiExternalLink />
                        </a>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BatchSearchPanel;
