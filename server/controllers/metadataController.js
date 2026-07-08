import { getBatchMetadata } from "../services/metadata/metadataService.js";

export const batchMetadata = async (req, res, next) => {
  try {
    const raw = req.body?.dois || req.query?.dois || [];
    const dois = Array.isArray(raw)
      ? raw
      : String(raw)
          .split(/\n|,/)
          .map((item) => item.trim())
          .filter(Boolean);

    const result = await getBatchMetadata(dois);
    return res.json(result);
  } catch (error) {
    next(error);
  }
};
