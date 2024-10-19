import express from "express";
import { LoginController, SignupController } from "../controllers/auth";

const router = express.Router();

router.post("/login", LoginController);

router.post("/signup", SignupController);

export default router;
