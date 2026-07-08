import { useState } from "react";
import {
  FiBookOpen,
  FiChevronDown,
  FiChevronUp,
  FiExternalLink,
  FiFileText,
  FiLock,
} from "react-icons/fi";
import { useTranslation } from "react-i18next";
import ExportActions from "./ExportActions";
import FavoriteButton from "./FavoriteButton";
import { formatAuthors } from "../utils/helpers";

const PaperCard = ({ paper }) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  const detailItems = [
    { label: t("paper.authors"), value: formatAuthors(paper.authors) },
    { label: t("paper.journal"), value: paper.journal || t("common.unknown") },
    {
      label: t("paper.publisher"),
      value: paper.publisher || t("common.unknown"),
    },
    { label: t("paper.year"), value: paper.year || t("common.unknown") },
    {
      label: t("paper.language"),
      value: paper.language || t("common.unknown"),
    },
    { label: t("paper.type"), value: paper.type || t("common.unknown") },
    { label: t("paper.citationCount"), value: paper.citationCount ?? 0 },
    {
      label: t("paper.openAccessStatus"),
      value: paper.isOpenAccess
        ? t("paper.openAccess")
        : t("paper.subscriptionRequired"),
    },
    { label: t("paper.license"), value: paper.license || t("common.unknown") },
    { label: t("paper.pdfUrl"), value: paper.pdfUrl || t("common.unknown") },
    {
      label: t("paper.landingPage"),
      value: paper.landingPage || t("common.unknown"),
    },
    { label: t("paper.openAlexId"), value: paper.openAlexId || "—" },
  ];

  const accessBadge = paper.isOpenAccess
    ? "bg-emerald-500/15 text-emerald-300"
    : "bg-rose-500/15 text-rose-300";
  const accessLabel = paper.isOpenAccess
    ? t("paper.openAccess")
    : t("paper.subscriptionRequired");
  const primaryAction =
    paper.isOpenAccess && paper.pdfUrl
      ? {
          label: t("paper.downloadPdf"),
          href: paper.pdfUrl,
          className: "bg-emerald-500/15 text-emerald-300",
        }
      : paper.isOpenAccess && paper.landingPage
        ? {
            label: t("paper.viewArticle"),
            href: paper.landingPage,
            className: "bg-cyan-500/10 text-cyan-300",
          }
        : null;

  return (
    <article className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/80 shadow-lg shadow-slate-950/30 transition hover:-translate-y-1 hover:border-cyan-500/40">
      <div className="p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-semibold text-white">{paper.title}</h3>
            <p className="mt-2 text-sm text-slate-400">
              {paper.authors?.length
                ? formatAuthors(paper.authors)
                : t("common.unknown")}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span
              className={`flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium ${accessBadge}`}
            >
              {paper.isOpenAccess ? <FiBookOpen /> : <FiLock />} {accessLabel}
            </span>
            {primaryAction && (
              <a
                href={primaryAction.href}
                target="_blank"
                rel="noreferrer"
                className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium ${primaryAction.className}`}
              >
                <FiExternalLink /> {primaryAction.label}
              </a>
            )}
            {paper.doi && (
              <a
                href={`https://doi.org/${paper.doi}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-300"
              >
                <FiExternalLink /> DOI
              </a>
            )}
            <FavoriteButton paper={paper} />
            <button
              type="button"
              onClick={() => setIsExpanded((value) => !value)}
              className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-300"
            >
              {isExpanded ? <FiChevronUp /> : <FiChevronDown />}{" "}
              {t("paper.viewDetails")}
            </button>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-slate-800 bg-slate-950/70 p-5">
          <div className="grid gap-3 md:grid-cols-2">
            {detailItems.map(({ label, value }) => (
              <div
                key={label}
                className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3"
              >
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  {label}
                </p>
                <p className="mt-1 text-sm text-slate-200">{value}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
              <FiFileText /> {t("paper.abstract")}
            </div>
            <p className="mt-3 text-sm leading-7 text-slate-400">
              {paper.abstract || t("paper.noAbstract")}
            </p>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            {paper.landingPage && (
              <a
                href={paper.landingPage}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-xl bg-cyan-500/10 px-3 py-2 text-sm text-cyan-300"
              >
                <FiExternalLink /> {t("paper.viewPublisher")}
              </a>
            )}
            <ExportActions paper={paper} />
          </div>
        </div>
      )}
    </article>
  );
};

export default PaperCard;
