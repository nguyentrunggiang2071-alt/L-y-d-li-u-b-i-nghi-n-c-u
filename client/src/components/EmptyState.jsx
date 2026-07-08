import { useTranslation } from "react-i18next";

const EmptyState = ({ query }) => {
  const { t } = useTranslation();

  return (
    <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/60 px-8 py-12 text-center text-slate-400">
      <p className="text-lg font-medium text-slate-200">
        {t("results.empty")} “{query}”.
      </p>
      <p className="mt-2">{t("results.emptyHint")}</p>
    </div>
  );
};

export default EmptyState;
