import { Link, NavLink } from "react-router-dom";
import { FiSearch, FiGlobe } from "react-icons/fi";
import { useTranslation } from "react-i18next";

const Navbar = () => {
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const nextLanguage = i18n.language === "en" ? "vi" : "en";
    i18n.changeLanguage(nextLanguage);
    window.localStorage.setItem("app-language", nextLanguage);
  };

  return (
    <header className="border-b border-slate-800/80 bg-slate-900/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="flex items-center gap-2 text-lg font-semibold text-white"
        >
          <FiSearch className="text-cyan-400" />
          OpenAccess Paper Finder
        </Link>
        <nav className="flex items-center gap-4 text-sm text-slate-300">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "text-cyan-400" : "hover:text-white"
            }
          >
            {t("nav.home")}
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive ? "text-cyan-400" : "hover:text-white"
            }
          >
            {t("nav.about")}
          </NavLink>
          <button
            type="button"
            onClick={toggleLanguage}
            className="flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800/80 px-3 py-2 text-sm transition hover:border-cyan-400 hover:text-white"
          >
            <FiGlobe />{" "}
            {i18n.language === "en" ? "🇺🇸 English" : "🇻🇳 Tiếng Việt"}
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
