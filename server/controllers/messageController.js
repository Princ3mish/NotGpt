import axios from "axios";
import Chat from "../models/Chat.js";
import User from "../models/User.js";
import openai from "../configs/openai.js";
import imagekit from "../configs/imageKit.js";

// Helper: retry with exponential backoff for rate limits
const withRetry = async (fn, retries = 3, delayMs = 1500) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      const status = err?.status ?? err?.response?.status;
      if (status === 429 && attempt < retries) {
        const wait = delayMs * attempt;
        console.log(`Rate limited (429). Retrying in ${wait}ms... (attempt ${attempt}/${retries})`);
        await new Promise((r) => setTimeout(r, wait));
      } else {
        throw err;
      }
    }
  }
};

// Text-based AI Chat Message Controller
export const textMessageController = async (req, res) => {
  try {
    const userId = req.user._id;

    // Check credits
    if (req.user.credits < 1) {
      return res.json({
        success: false,
        message: "You don't have enough credits. Please purchase more.",
      });
    }

    const { chatId, prompt } = req.body;

    if (!prompt || !chatId) {
      return res.json({ success: false, message: "Prompt and chatId are required" });
    }

    const chat = await Chat.findOne({ userId, _id: chatId });
    if (!chat) {
      return res.json({ success: false, message: "Chat not found" });
    }

    chat.messages.push({
      role: "user",
      content: prompt,
      timestamp: Date.now(),
      isImage: false,
    });

    let choices;
    try {
      const result = await withRetry(() =>
        openai.chat.completions.create({
          model: "gemini-2.0-flash",
          messages: [{ role: "user", content: prompt }],
        })
      );
      choices = result.choices;
    } catch (err) {
      const status = err?.status ?? err?.response?.status;
      if (status === 429) {
        return res.json({
          success: false,
          message: "The AI service is currently busy. Please wait a moment and try again.",
        });
      }
      throw err;
    }

    const reply = {
      ...choices[0].message,
      timestamp: Date.now(),
      isImage: false,
    };

    res.json({ success: true, reply });

    // Save after responding (non-blocking)
    chat.messages.push(reply);
    await chat.save();
    await User.updateOne({ _id: userId }, { $inc: { credits: -1 } });
  } catch (error) {
    console.error("textMessageController error:", error.message);
    res.json({ success: false, message: error.message });
  }
};

// Image Generation Message Controller
export const imageMessageController = async (req, res) => {
  try {
    const userId = req.user._id;

    // Check credits
    if (req.user.credits < 2) {
      return res.json({
        success: false,
        message: "You need at least 2 credits to generate an image.",
      });
    }

    const { prompt, chatId, isPublished } = req.body;

    if (!prompt || !chatId) {
      return res.json({ success: false, message: "Prompt and chatId are required" });
    }

    const chat = await Chat.findOne({ userId, _id: chatId });
    if (!chat) {
      return res.json({ success: false, message: "Chat not found" });
    }

    chat.messages.push({
      role: "user",
      content: prompt,
      timestamp: Date.now(),
      isImage: false,
    });

    // Construct ImageKit AI generation URL
    const encodedPrompt = encodeURIComponent(prompt);
    const generatedImageUrl = `${process.env.IMAGEKIT_URL_ENDPOINT}/ik-genimg-prompt-${encodedPrompt}/notgpt/${Date.now()}.png?tr=w-800,h-800`;

    let aiImageResponse;
    try {
      aiImageResponse = await withRetry(() =>
        axios.get(generatedImageUrl, { responseType: "arraybuffer" })
      );
    } catch (err) {
      const status = err?.response?.status ?? err?.status;
      if (status === 429) {
        return res.json({
          success: false,
          message: "The image generation service is busy. Please try again in a moment.",
        });
      }
      return res.json({
        success: false,
        message: `Image generation failed: ${err.message}`,
      });
    }

    // Convert to Base64 and upload
    const base64Image = `data:image/png;base64,${Buffer.from(
      aiImageResponse.data,
      "binary"
    ).toString("base64")}`;

    const uploadResponse = await imagekit.upload({
      file: base64Image,
      fileName: `notgpt/${Date.now()}.png`,
      folder: "notgpt",
    });

    const reply = {
      role: "assistant",
      content: uploadResponse.url,
      timestamp: Date.now(),
      isImage: true,
      isPublished: !!isPublished,
    };

    res.json({ success: true, reply });

    // Save after responding (non-blocking)
    chat.messages.push(reply);
    await chat.save();
    await User.updateOne({ _id: userId }, { $inc: { credits: -2 } });
  } catch (error) {
    console.error("imageMessageController error:", error.message);
    res.json({ success: false, message: error.message });
  }
};
