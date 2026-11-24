
import sharp from "sharp";
import path from "node:path";

// Locate the public images folder relative to the client directory.
const imagesDir = path.resolve("public/images");

// Optimize the navbar logo to 160 x 160 pixels.
// This provides 2x resolution for its 80 x 80 CSS display size.
await sharp(path.join(imagesDir, "logo.png"))
  .resize(160, 160, { fit: "contain" })
  .webp({ quality: 80, effort: 6 })
  .toFile(path.join(imagesDir, "logo.webp"));

// Optimize the Home page hero image.
// Resize only if the image is wider than 1120 pixels.
await sharp(path.join(imagesDir, "innovation.png"))
  .resize({ width: 1120, withoutEnlargement: true })
  .webp({ quality: 80, effort: 6 })
  .toFile(path.join(imagesDir, "innovation.webp"));

console.log("Image optimization completed.");
