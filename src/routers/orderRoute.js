import express from "express";
import {
  listOrder,
  createOrder,
  renderPageSimulateCreateOrder,
  simulatorCreateOrder,
  updateStatusDelivering,
  
} from "../controller/orderController.js";
const router = express.Router();

router.get("/", listOrder);

router.get("/create", renderPageSimulateCreateOrder);
router.post("/create", createOrder);
router.post("/simulatorCreate", simulatorCreateOrder);
router.post("/updateStatusDelivering", updateStatusDelivering);
export default router;
