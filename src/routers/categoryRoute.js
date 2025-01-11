import express from "express";
import { listCategory } from "../controller/categoryController.js";
const router = express.Router();

router.get("/", listCategory)
router.post("/create", function(req, res) {
    res.send("create categories");
})
export default router;