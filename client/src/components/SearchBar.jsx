import { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { useTranslation } from "react-i18next";

const SearchBar = ({ onSearch, isLoading }) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!query.trim()) return;
    onSearch(query);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full rounded-2xl border border-slate-800 bg-slate-900/80 p-3 shadow-2xl shadow-cyan-950/30"
    >
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <FiSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("home.placeholder")}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-11 pr-4 text-base text-white outline-none ring-0 placeholder:text-slate-500"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isLoading ? t("home.searching") : t("home.button")}
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
