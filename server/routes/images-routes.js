import express from "express";
import { getImageById } from "../controllers/images-controllers.js";

const router = express.Router();

// Images are publicly accessible for display in the portfolio.
// Uploading remains protected by your existing admin middleware.
router.get("/:id", getImageById);

export default router;