import { approveServiceProvider, getApprovedProviders, getPendingProviders, getRejectedProviders, rejectServiceProvider } from "../controllers/admin.controller.js";
import express from "express"
import { isAdmin } from "../middlewares/isAdmin.middleware.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { createCategory, deleteCategory, getCategories, updateCategory } from "../controllers/category.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
const router=express.Router()

router.route("/getPendingProvider").get(verifyJwt,isAdmin, getPendingProviders);
router.route("/approvePendingProvider/:providerId").patch(verifyJwt,isAdmin, approveServiceProvider);
router.route("/rejectPendingProvider/:providerId").patch(verifyJwt,isAdmin, rejectServiceProvider);
router.route("/getAllApprovedProvider").get(verifyJwt,isAdmin, getApprovedProviders);
router.route("/getAllrejectedProvider").get(verifyJwt,isAdmin, getRejectedProviders);

router.route("/getCategories").get(getCategories) 


router.route("/createCategory").post(verifyJwt, isAdmin, upload.single("image"), createCategory)
router.route("/updateCategory/:categoryId").patch(verifyJwt, isAdmin, upload.single("image"), updateCategory)
router.route("/deleteCategory/:categoryId").delete(verifyJwt, isAdmin, deleteCategory)

export default router;