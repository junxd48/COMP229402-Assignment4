
import mongoose from "mongoose";

// Collection used to store uploaded image files.
const imageSchema = new mongoose.Schema(
  {
    filename: {
      type: String,
      required: true,
    },
    contentType: {
      type: String,
      required: true,
      enum: ["image/jpeg", "image/png", "image/webp"],
    },
    size: {
      type: Number,
      required: true,
    },
    data: {
      type: Buffer,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "images",
  }
);

const Image = mongoose.model("Image", imageSchema);

export default Image;
