import express from "express";
import * as dotenv from "dotenv";
// import OpenAI from "openai";
import deepai from "deepai";
import imgUrlToBase64 from "imgurl-to-base64";

dotenv.config();
const router = express.Router();

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });
deepai.setApiKey("quickstart-QUdJIGlzIGNvbWluZy4uLi4K");

router.route("/").get((req, res) => {
  res.status(200).json({ message: "Hello from DALL.E ROUTES" });
});

router.route("/").post(async (req, res) => {
  try {
    const { prompt } = req.body;
    const response = await deepai.callStandardApi("text2img", {
      text: prompt,
    });
    // await imgUrlToBase64();
    res.status(200).json({ photo: response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

export default router;
