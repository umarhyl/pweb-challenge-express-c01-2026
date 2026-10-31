import { Router } from "express";

import {
  createComment,
  getAllCOmments,
  getCommentById,
  updateComment,
  deleteComment,
} from "../controllers/commentController";

const router = Router();

router.post("/", createComment);
router.get("/", getAllCOmments);
router.get("/:id", getCommentById);
router.patch("/:id", updateComment);
router.delete("/:id", deleteComment);

export default router;