import express from "express";
import { createService, deleteService, getMyProfile, getMyProviderStatus, getMyServices, registerAsProvider, updateMyProfile, updateService, updateServicePortfolio } from "../controllers/serviceProvider.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { isApprovedProvider } from "../middlewares/isServiceProvider.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
const router = express.Router();

router.route("/registerAsProvider").post(verifyJwt,registerAsProvider)

router.route("/addService").post(
  verifyJwt,
  isApprovedProvider,
  upload.single("image"),  
  createService
)

router.route("/updateService/:serviceId").patch(
  verifyJwt,
  isApprovedProvider,
  upload.single("image"),  
  updateService
)
router.route("/updatePortfolio/:serviceId").patch(
  verifyJwt,
  isApprovedProvider,
  upload.any(),  // ✅ accepts before_0, before_1, after_0, after_1
  updateServicePortfolio
)

router.route("/myProfile").get(verifyJwt, isApprovedProvider, getMyProfile)
router.route("/updateMyProfile").patch(verifyJwt, isApprovedProvider, updateMyProfile)

router.route("/myServices").get(verifyJwt, isApprovedProvider, getMyServices)

router.route("/myStatus").get(verifyJwt, getMyProviderStatus)
router.route("/deleteService/:serviceId").delete(verifyJwt,isApprovedProvider,deleteService)
export default router;