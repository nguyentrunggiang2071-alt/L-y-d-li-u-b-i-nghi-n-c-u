import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SearchBar from "../components/SearchBar";
import BatchSearchPanel from "../components/BatchSearchPanel";

const HomePage = () => {
  const { t, i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = window.localStorage.getItem("recent-searches");
    if (saved) {
      try {
        const recentSearchesList = JSON.parse(saved);
        setRecentSearches(recentSearchesList);
      } catch (error) {
        console.error("Error parsing recent searches:", error);
      }
    }
  }, []);

  const handleSearch = async (query) => {
    const trimmed = query.trim();
    if (!trimmed) return;

    setIsLoading(true);
    try {
      const updated = [
        trimmed,
        ...recentSearches.filter((item) => item !== trimmed),
      ].slice(0, 5);
      window.localStorage.setItem("recent-searches", JSON.stringify(updated));
      setRecentSearches(updated);
      navigate(`/results?q=${encodeURIComponent(trimmed)}`);
    } catch (error) {
      console.error("Error handling search:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearHistory = () => {
    window.localStorage.removeItem("recent-searches");
    setRecentSearches([]);
  };

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-2 py-10 text-center">
      <div className="w-full max-w-5xl">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.35em] text-cyan-400">
          {t("home.title", "OpenAccess Paper Finder")}
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
          {t("home.subtitle", "Tìm kiếm論文")}
        </h1>
        <p className="mt-4 text-lg text-slate-400">
          {t("home.description", "")}
        </p>
        <div className="mt-8 flex justify-center">
          <SearchBar onSearch={handleSearch} isLoading={isLoading} />
        </div>

        <div className="mt-8">
          <BatchSearchPanel />
        </div>

        {recentSearches.length > 0 && (
          <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/80 p-4 text-left">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-200">
                {t("results.recent", "Recent searches")}
              </p>
              <button
                type="button"
                onClick={clearHistory}
                className="text-sm text-cyan-400 hover:text-cyan-300"
              >
                {t("results.clear", "Clear")}
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((item, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() =>
                    navigate(`/results?q=${encodeURIComponent(item)}`)
                  }
                  className="rounded-full border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-300 transition hover:border-cyan-400 hover:text-white"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
