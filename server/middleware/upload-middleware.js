
import multer from "multer";
import { randomUUID } from "node:crypto";
import Image from "../models/image-model.js";

// Maximum permitted image size: 5 MB.
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Supported image MIME types.
const allowedTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

// Store uploaded files temporarily in memory.
// MongoDB will provide permanent storage.
const storage = multer.memoryStorage();

const upload = multer({
  storage,

  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 1,
  },

  fileFilter(req, file, callback) {
    if (!allowedTypes.includes(file.mimetype)) {
      return callback(
        new Error("Only JPEG, PNG, and WebP images are allowed.")
      );
    }

    callback(null, true);
  },
});

// Validate an image using its actual file signature.
function detectImageType(buffer) {
  if (!Buffer.isBuffer(buffer)) {
    return null;
  }

  // JPEG signature.
  if (
    buffer.length >= 3 &&
    buffer[0] === 0xff &&
    buffer[1] === 0xd8 &&
    buffer[2] === 0xff
  ) {
    return "jpg";
  }

  // PNG signature.
  if (
    buffer.length >= 8 &&
    buffer.subarray(0, 8).equals(
      Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
    )
  ) {
    return "png";
  }

  // WebP signature.
  if (
    buffer.length >= 12 &&
    buffer.toString("ascii", 0, 4) === "RIFF" &&
    buffer.toString("ascii", 8, 12) === "WEBP"
  ) {
    return "webp";
  }

  return null;
}

// POST /api/projects/upload
// Save a validated image to MongoDB Atlas.
async function saveProjectImage(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Please select an image to upload.",
      });
    }

    // Check image contents, not just file extension.
    const extension = detectImageType(req.file.buffer);

    if (!extension) {
      return res.status(400).json({
        message: "Invalid image file.",
      });
    }

    const expectedMimeType = {
      jpg: "image/jpeg",
      png: "image/png",
      webp: "image/webp",
    }[extension];

    if (req.file.mimetype !== expectedMimeType) {
      return res.status(400).json({
        message: "Image content does not match its file type.",
      });
    }

    // Generate a unique server-side filename.
    const filename = `project-${randomUUID()}.${extension}`;

    // Save the actual image bytes in MongoDB.
    const savedImage = await Image.create({
      filename,
      contentType: expectedMimeType,
      size: req.file.size,
      data: req.file.buffer,
    });

    // Return a path that can be used by the React frontend.
    return res.status(201).json({
      message: "Image uploaded successfully.",
      image: `/api/images/${savedImage._id}`,
    });

  } catch (error) {
    console.error("Image upload failed:", error);

    return res.status(500).json({
      message: "Unable to save the uploaded image.",
    });
  }
}

// Convert Multer errors to appropriate HTTP responses.
function handleUpload(req, res, next) {
  upload.single("image")(req, res, function (error) {
    if (error) {
      if (error instanceof multer.MulterError) {
        return res.status(
          error.code === "LIMIT_FILE_SIZE" ? 413 : 400
        ).json({
          message: error.message,
        });
      }

      return res.status(400).json({
        message: error.message,
      });
    }

    next();
  });
}

export { handleUpload, saveProjectImage };
