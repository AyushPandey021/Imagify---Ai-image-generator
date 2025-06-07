const userModel = require("../module/userModel");
const axios = require("axios");
const FormData = require("form-data");

const generateImage = async (req, res) => {
  try {
    const { userId, prompt } = req.body;

    // Validate user and prompt
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    if (!prompt) {
      return res.status(400).json({
        success: false,
        message: "Prompt is required!",
      });
    }

    // Check user's credit balance
    if (user.creditBalance <= 0) {
      return res.status(403).json({
        success: false,
        message: "Not enough credits!",
        creditBalance: user.creditBalance,
      });
    }

    // Ensure API key is available
    const apiKey = process.env.CLIPDROP_API;
    if (!apiKey) {
      return res.status(500).json({
        success: false,
        message: "Server is not configured properly. API key missing!",
      });
    }

    // Prepare form data
    const formData = new FormData();
    formData.append("prompt", prompt);

    // Call external API
    const apiResponse = await axios.post(
      `https://clipdrop-api.co/text-to-image/v1`,
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          "x-api-key": apiKey,
        },
        responseType: "arraybuffer",
      }
    );

    // Convert API response to Base64
    const base64Image = Buffer.from(apiResponse.data, "binary").toString("base64");
    const resultImage = `data:image/png;base64,${base64Image}`;

    // Deduct user's credits and save
    user.creditBalance -= 1;
    await user.save();

    return res.json({
      success: true,
      message: "Image generated successfully!",
      creditBalance: user.creditBalance,
      resultImage,
    });
  } catch (error) {
    console.error("Error generating image:", error.message);

    // Handle specific HTTP errors from the external API
    if (error.response) {
      const { status, data } = error.response;

      // Handle 402 error
      if (status === 402) {
        return res.status(402).json({
          success: false,
          message: "External API error: Payment required. Check API key balance.",
        });
      }

      // Handle other HTTP errors
      return res.status(status).json({
        success: false,
        message: `External API error: ${data.message || "Unknown error"}`,
      });
    }

    // Handle server-side errors
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = generateImage;
