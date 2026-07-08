import { useTranslation } from "react-i18next";

const ExportActions = ({ paper }) => {
  const { t } = useTranslation();

  const handleCopyApa = async () => {
    const text = `${paper.authors?.slice(0, 3).join(", ") || "Anonymous"}. (${paper.year || "n.d."}). ${paper.title}.`;
    await navigator.clipboard.writeText(text);
    alert("Copied to clipboard");
  };

  const handleDownload = (type) => {
    const content = JSON.stringify(
      {
        title: paper.title,
        doi: paper.doi,
        authors: paper.authors,
        year: paper.year,
      },
      null,
      2,
    );

    const blob = new Blob([content], {
      type: type === "json" ? "application/json" : "text/plain",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${paper.title || "paper"}.${type}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={handleCopyApa}
        className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-300"
      >
        APA
      </button>
      <button
        type="button"
        onClick={() => handleDownload("json")}
        className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-300"
      >
        JSON
      </button>
      <button
        type="button"
        onClick={() => handleDownload("bib")}
        className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-300"
      >
        BibTeX
      </button>
    </div>
  );
};

export default ExportActions;
