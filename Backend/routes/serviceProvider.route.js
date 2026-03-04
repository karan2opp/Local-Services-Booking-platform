import express from "express";
import { registerAsProvider } from "../controllers/serviceProvider.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.route("/registerAsProvider").post(verifyJwt,registerAsProvider)
export default router;