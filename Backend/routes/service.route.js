import express from "express"
import {  getServiceById, searchServices } from "../controllers/service.controller.js"

const router = express.Router()


router.route("/search").get(searchServices)
router.route("/:serviceId").get(getServiceById) 

export default router