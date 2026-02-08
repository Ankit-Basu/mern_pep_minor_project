import express from "express";
import {
  getComplaints,
  getComplaintById,
  createComplaint,
  updateComplaintStatus,
  deleteComplaint,
  exportComplaints,
} from "../controllers/complaint.controller.js";

const router = express.Router();

router.get("/complaints", getComplaints);
router.get("/complaints/export", exportComplaints); // Specific route before param route
router.get("/complaints/:id", getComplaintById);
router.post("/complaints", createComplaint);
router.put("/complaints/:id", updateComplaintStatus);
router.delete("/complaints/:id", deleteComplaint);

export default router;
