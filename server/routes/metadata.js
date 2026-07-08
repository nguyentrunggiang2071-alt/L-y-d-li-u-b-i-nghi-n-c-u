import express from "express";
import { batchMetadata } from "../controllers/metadataController.js";

const router = express.Router();

router.post("/metadata/batch", batchMetadata);
router.get("/metadata/batch", batchMetadata);

export default router;
