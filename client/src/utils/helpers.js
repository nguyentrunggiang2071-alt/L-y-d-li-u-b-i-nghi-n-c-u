export const formatAuthors = (authors = []) => authors.join(', ') || 'Unknown authors';

export const formatAPA = (paper) => {
  const authors = paper.authors?.length ? paper.authors.join(', ') : 'Anonymous';
  const year = paper.year || 'n.d.';
  return `${authors}. (${year}). ${paper.title}.`;
};
