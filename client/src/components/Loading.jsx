import { useTranslation } from "react-i18next";

const Loading = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/80 px-8 py-12 text-center shadow-lg shadow-slate-950/20">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent" />
      <p className="mt-4 text-sm text-slate-400">{t("loading.search")}</p>
    </div>
  );
};

export default Loading;
