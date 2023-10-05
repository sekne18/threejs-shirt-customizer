import cors from "cors";
import express from "express";
import * as dotenv from "dotenv";
import dalleRoutes from "./routes/dalle.routes.js";
import axios from "axios";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));

app.use("/api/v1/dalle", dalleRoutes);
app.get("/api", async (req, res) => {
  const response = await axios.get(
    "https://cdn-icons-png.flaticon.com/512/123/123281.png",
    {
      responseType: "text",
      responseEncoding: "base64",
    }
  );

  const base64 = Buffer.from(response.data, "base64");
  res.status(200).json({ photo: base64 });
});
app.listen(8080, () => console.log("Server has started on port 8080"));
