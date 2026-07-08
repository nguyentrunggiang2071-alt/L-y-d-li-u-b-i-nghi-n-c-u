import { useEffect, useState } from "react";
import { FiStar } from "react-icons/fi";

const FavoriteButton = ({ paper, onChange }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const stored = JSON.parse(window.localStorage.getItem("favorites") || "[]");
    setIsFavorite(stored.some((item) => item.doi && item.doi === paper.doi));
  }, [paper.doi]);

  const toggleFavorite = () => {
    const stored = JSON.parse(window.localStorage.getItem("favorites") || "[]");
    const next = isFavorite
      ? stored.filter((item) => item.doi !== paper.doi)
      : [...stored, paper];
    window.localStorage.setItem("favorites", JSON.stringify(next));
    setIsFavorite(!isFavorite);
    onChange?.(next);
  };

  return (
    <button
      type="button"
      onClick={toggleFavorite}
      className={`rounded-xl border px-3 py-2 text-sm ${isFavorite ? "border-amber-500 bg-amber-500/10 text-amber-300" : "border-slate-700 bg-slate-950 text-slate-300"}`}
    >
      <FiStar className="mr-2 inline" /> {isFavorite ? "Saved" : "Save"}
    </button>
  );
};

export default FavoriteButton;
