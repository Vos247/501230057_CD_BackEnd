import express from "express";
import { listCategory, 
    createCategory ,
    renderpageCreateCategory,
    renderpageUpdateCategory,
    updateCategory} from "../controller/categoryController.js";
const router = express.Router();

router.get("/", listCategory)

router.get("/create", renderpageCreateCategory)// đọc ra form create
router.post("/create", createCategory)

router.get("/update/:id", renderpageUpdateCategory)
router.post("/update/", updateCategory)

export default router;