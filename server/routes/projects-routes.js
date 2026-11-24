
import express from "express";

import { authenticateToken } from "../middleware/auth-middleware.js";
import { authorizeAdmin } from "../middleware/authorize-admin.js";

import {
  createProject,
  deleteProject,
  getAllProjects,
  getProjectById,
  updateProject,
} from "../controllers/projects-controllers.js";

import {
  handleUpload,
  saveProjectImage,
} from "../middleware/upload-middleware.js";

// Create an Express router for project-related endpoints.
const router = express.Router();

// READ: Public access.
router.get("/", getAllProjects);

// UPLOAD: Administrators can upload project images.
// saveProjectImage will be updated to store images in MongoDB.
router.post(
  "/upload",
  authenticateToken,
  authorizeAdmin,
  handleUpload,
  saveProjectImage
);

// CREATE: Administrators can create projects.
router.post(
  "/",
  authenticateToken,
  authorizeAdmin,
  createProject
);

// READ BY ID: Public access.
router.get("/:id", getProjectById);

// UPDATE: Administrators can modify projects.
router.put(
  "/:id",
  authenticateToken,
  authorizeAdmin,
  updateProject
);

// DELETE: Administrators can delete projects.
router.delete(
  "/:id",
  authenticateToken,
  authorizeAdmin,
  deleteProject
);

export default router;
