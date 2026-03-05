import express from "express"
import {  searchServices } from "../controllers/service.controller.js"

const router = express.Router()


router.route("/search").get(searchServices)

export default router