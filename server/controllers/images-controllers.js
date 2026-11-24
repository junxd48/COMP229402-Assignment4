
import mongoose from "mongoose";
import Image from "../models/image-model.js";

// GET /api/images/:id
// Retrieve image data from MongoDB and send it to the browser.
async function getImageById(req, res) {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId format.
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid image ID.",
      });
    }

    const image = await Image.findById(id);

    if (!image) {
      return res.status(404).json({
        message: "Image not found.",
      });
    }

    // Tell the browser which image format is being returned.
    res.setHeader("Content-Type", image.contentType);
    res.setHeader("Content-Length", image.data.length);
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.setHeader("X-Content-Type-Options", "nosniff");

    // Send the actual image bytes, not JSON.
    return res.status(200).send(image.data);

  } catch (error) {
    console.error("Image retrieval failed:", error);

    return res.status(500).json({
      message: "Unable to retrieve image.",
    });
  }
}

export { getImageById };
