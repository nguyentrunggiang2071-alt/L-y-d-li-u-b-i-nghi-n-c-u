import { searchPaperService } from "../services/openalexService.js";

export const searchPaper = async (req, res, next) => {
  try {
    const query = req.query.q?.toString().trim() || "";

    if (!query) {
      return res
        .status(400)
        .json({ error: "Please provide a DOI or paper title." });
    }

    const result = await searchPaperService(query);
    return res.json(result);
  } catch (error) {
    next(error);
  }
};
