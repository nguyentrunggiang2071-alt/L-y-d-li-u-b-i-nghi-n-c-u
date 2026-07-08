import PaperCard from "./PaperCard";

const PaperList = ({ papers }) => (
  <div className="space-y-4">
    {papers.map((paper, index) => (
      <PaperCard key={`${paper.doi || paper.title}-${index}`} paper={paper} />
    ))}
  </div>
);

export default PaperList;
