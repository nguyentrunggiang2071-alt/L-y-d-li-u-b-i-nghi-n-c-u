import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SearchBar from "../components/SearchBar";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import EmptyState from "../components/EmptyState";
import PaperList from "../components/PaperList";
import BatchSearchPanel from "../components/BatchSearchPanel";
import { searchPapers } from "../services/api";

const SearchResultsPage = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get("q") || "";

  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getFriendlyError = (err) => {
    if (!err) return t("errors.generic");
    if (err.code === "ECONNABORTED" || err.message?.includes("timeout"))
      return t("errors.timeout");
    if (err.response?.status === 404) return t("errors.notFound");
    if (err.response?.data?.error) return err.response.data.error;
    return t("errors.generic");
  };

  useEffect(() => {
    const runSearch = async () => {
      if (!query.trim()) {
        setResults(null);
        setError(t("errors.empty"));
        return;
      }

      setLoading(true);
      setError("");

      try {
        const data = await searchPapers(query);
        setResults(data);
        if (data?.error && data.count === 0) {
          setError("");
        }
      } catch (err) {
        setError(getFriendlyError(err));
        setResults(null);
      } finally {
        setLoading(false);
      }
    };

    runSearch();
  }, [query, t]);

  const handleSearch = async (nextQuery) => {
    const trimmed = nextQuery.trim();
    if (!trimmed) {
      setError(t("errors.empty"));
      return;
    }

    window.history.replaceState(
      {},
      "",
      `/results?q=${encodeURIComponent(trimmed)}`,
    );
    setResults(null);
    setError("");
    setLoading(true);

    try {
      const data = await searchPapers(trimmed);
      setResults(data);
      if (data?.error && data.count === 0) {
        setError("");
      }
    } catch (err) {
      setError(getFriendlyError(err));
      setResults(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-4 shadow-xl shadow-slate-950/30">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">
              {t("results.title")}
            </p>
            <h1 className="mt-1 text-2xl font-semibold text-white">
              {t("results.subtitle")} “{query}”
            </h1>
          </div>
          <div className="w-full max-w-2xl">
            <SearchBar onSearch={handleSearch} isLoading={loading} />
          </div>
        </div>
      </div>

      {loading && <Loading />}
      {error && <ErrorMessage message={error} />}
      {!loading && !error && results && results.papers?.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">
              {t("results.found", { count: results.count })}
            </p>
            <Link to="/" className="text-sm text-cyan-400 hover:text-cyan-300">
              {t("results.newSearch")}
            </Link>
          </div>
          <BatchSearchPanel />
          <PaperList papers={results.papers} />
        </div>
      )}
      {!loading && !error && results && results.papers?.length === 0 && (
        <EmptyState query={query} />
      )}
      {!loading && !error && !results && query && <EmptyState query={query} />}
    </div>
  );
};

export default SearchResultsPage;
