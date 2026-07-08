const AboutPage = () => (
  <div className="mx-auto max-w-4xl rounded-3xl border border-slate-800 bg-slate-900/70 p-8 shadow-xl shadow-slate-950/30">
    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">
      About
    </p>
    <h1 className="mt-3 text-3xl font-semibold text-white">
      What this app does
    </h1>
    <p className="mt-4 text-lg leading-8 text-slate-400">
      OpenAccess Paper Finder helps researchers quickly discover scholarly works
      from OpenAlex. Enter a DOI or paper title to retrieve article metadata,
      check whether the work is open access, and access helpful links for PDF or
      publisher pages.
    </p>
    <div className="mt-8 grid gap-4 md:grid-cols-3">
      <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
        <h2 className="font-semibold text-white">Fast lookup</h2>
        <p className="mt-2 text-sm text-slate-400">
          Use DOI or title-based search with a polished, modern interface.
        </p>
      </div>
      <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
        <h2 className="font-semibold text-white">Open access insight</h2>
        <p className="mt-2 text-sm text-slate-400">
          Get instant visibility into whether a paper is open access and where
          to find it.
        </p>
      </div>
      <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
        <h2 className="font-semibold text-white">Research ready</h2>
        <p className="mt-2 text-sm text-slate-400">
          See citation counts, journals, authors, and abstract snippets at a
          glance.
        </p>
      </div>
    </div>
  </div>
);

export default AboutPage;
