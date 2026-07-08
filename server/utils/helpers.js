export const isDOI = (value) => /^10\./.test(value.trim());

export const formatAuthors = (authors = []) => authors.join(", ");

export const formatAPA = (paper) => {
  const authors = paper.authors?.length
    ? paper.authors.join(", ")
    : "Anonymous";
  const year = paper.year || "n.d.";
  return `${authors}. (${year}). ${paper.title}.`;
};
