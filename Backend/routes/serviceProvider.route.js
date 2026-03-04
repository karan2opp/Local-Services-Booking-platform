import express from "express";
import { createService, deleteService, registerAsProvider, updateService } from "../controllers/serviceProvider.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { isApprovedProvider } from "../middlewares/isServiceProvider.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
const router = express.Router();

router.route("/registerAsProvider").post(verifyJwt,registerAsProvider)
router.route("/addService").post(
  verifyJwt,
  isApprovedProvider,
  upload.array("images", 5),
  createService
)
router.route("/updateService/:serviceId").patch(verifyJwt,isApprovedProvider,
  upload.array("images", 5),  
  updateService
)

router.route("/deleteService/:serviceId").delete(verifyJwt,isApprovedProvider,deleteService)
export default router;