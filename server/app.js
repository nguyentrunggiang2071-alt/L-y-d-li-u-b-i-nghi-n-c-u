import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import searchRoutes from "./routes/search.js";
import metadataRoutes from "./routes/metadata.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/api", searchRoutes);
app.use("/api", metadataRoutes);

app.get("/", (_req, res) => {
  res.json({ message: "OpenAccess Paper Finder API is running" });
});

app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
