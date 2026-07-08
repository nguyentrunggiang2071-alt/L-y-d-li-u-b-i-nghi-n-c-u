import { Link } from "react-router-dom";

const NotFoundPage = () => (
  <div className="flex min-h-[60vh] flex-col items-center justify-center rounded-3xl border border-slate-800 bg-slate-900/70 px-6 py-16 text-center shadow-xl shadow-slate-950/30">
    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">
      404
    </p>
    <h1 className="mt-3 text-3xl font-semibold text-white">Page not found</h1>
    <p className="mt-3 max-w-xl text-slate-400">
      The page you are looking for does not exist or may have moved.
    </p>
    <Link
      to="/"
      className="mt-6 rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400"
    >
      Back to home
    </Link>
  </div>
);

export default NotFoundPage;
