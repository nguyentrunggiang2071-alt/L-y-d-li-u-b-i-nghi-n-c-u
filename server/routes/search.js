import express from "express";
import { searchPaper } from "../controllers/searchController.js";

const router = express.Router();

router.get("/search", searchPaper);

export default router;
