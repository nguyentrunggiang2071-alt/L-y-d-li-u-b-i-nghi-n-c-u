import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-slate-800 bg-slate-900/70 px-4 py-6 text-center text-sm text-slate-400">
      Built with OpenAlex API • {t("nav.home")}
    </footer>
  );
};

export default Footer;
