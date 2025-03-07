import OrderModel from "../models/orderModel.js";
import ProductModel from "../models/productModel.js";
import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;

const sortObjects = [
  { code: "createdAt_DESC", name: "Ngày tạo giảm dần" },
  { code: "createdAt_ASC", name: "Ngày tạo tăng dần" },
  { code: "orderNo_DESC", name: "Mã đơn hàng giảm dần" },
  { code: "orderNo_ASC", name: "Mã đơn hàng tăng dần" },
  { code: "total_DESC", name: "Tổng tiền giảm dần" },
  { code: "total_ASC", name: "Tổng tiền tăng dần" }
];

const sizes = ["S", "M", "L", "XL"];
const colors = ["red", "blue", "green", "yellow"];
export async function listOrder(req, res) {
  const search = req.query?.search;
  const pageSize = !!req.query?.pageSize ? parseInt(req.query.pageSize) : 5;
  const page = !!req.query?.page ? parseInt(req.query.page) : 1;
  const skip = (page - 1) * pageSize;
  let sort = !!req.query?.sort ? req.query.sort : null;
  let filters = {
    deleteAt: null,
  };
  if (search && search.length > 0) {
    filters.orderNo = search;
  }
  if (!sort) {
    sort = { createdAt: -1 };
  } else {
    const sortArray = sort.split("_");
    sort = { [sortArray[0]]: sortArray[1] === "ASC" ? 1 : -1 };
  }
  try {
    const countOrders = await OrderModel.countDocuments(filters);
    const orders = await OrderModel.find(filters)
      .skip(skip)
      .populate("orderItems.product", "name code")
      .limit(pageSize)
      .sort(sort);
    // res.send(orders);
    res.render("pages/orders/list", {
      title: "Orders",
      orders: orders,
      countPagination: Math.ceil(countOrders / pageSize),
      pageSize,
      page,
      sort,
      sortObjects
    });
    // res.send({ countOrders });
  } catch (e) {
    res.send("Loi lay danh sach");
  }
}
export async function renderPageSimulateCreateOrder(req, res) {
  const products = await ProductModel.find({ deleteAt: null }, "code name price sizes colors");
  let err = {}; // Khai báo biến err
  res.render("pages/orders/form", {
    title: "Create orders",
    mode: "Create",
    order: {},
    products: products,
    err,
  });
}
export async function createOrder(req, res) {
  const { discount, orderItems, billingAdress } = req.body;
  let subTotal = 0,
    total = 0,
    numericalOrder = 0;
  const lastOrder = await OrderModel.findOne().sort({ createdAt: -1 });
  if (lastOrder && lastOrder.numericalOrder != null) {
    numericalOrder = parseInt(lastOrder.numericalOrder) + 1;
  } else {
    numericalOrder = 1;
  }
  const orderNo = "order-" + numericalOrder;
  total = (subTotal * (100 - discount)) / 100;
  try {
    const rs = await OrderModel.create({
      orderNo: orderNo,
      discount: discount,
      total: total,
      status: "created",
      orderItems: orderItems,
      createAt: new Date(),
      billingAdress: billingAdress,
    });
    res.send(rs);
  } catch (error) {
    console.log("error; ", error);
  }
}
export async function updateStatusDelivering(req, res) {
  const { orderId, status } = req.body; // Lấy trạng thái từ body
  try {
    const currentOrder = await OrderModel.findOne({ _id: new ObjectId(orderId) });
    if (currentOrder) {
      await OrderModel.updateOne(
        { _id: new ObjectId(orderId) },
        {
          status: status, // cập nhật trạng thái theo yêu cầu
          updatedAt: new Date(),
        }
      );
      // res.send({
      //   success: true,
      //   message: `Cập nhật trạng thái đơn hàng thành công: ${status}`,
      // });
      res.redirect("/orders");
    } else {
      res.send({
        success: false,
        message: "Không tìm thấy đơn hàng",
      });
    }
  } catch (error) {
    res.send({
      success: false,
      message: "Có lỗi xảy ra khi cập nhật trạng thái đơn hàng",
    });
  }
}
export async function simulatorCreateOrder(req, res) {
  let {
    discount, itemSelect, quantity, itemColor, itemSize, itemPrice,
    billingName, billingEmail, billingPhoneNumber, billingAdress, billingDistrict, billingCity
  } = req.body;

  let subTotal = 0,
    total = 0,
    numericalOrder = 1;

  const lastOrder = await OrderModel.findOne().sort({ createdAt: -1 });
  if (lastOrder) {
    numericalOrder = lastOrder.numericalOrder + 1;
  }
  const orderNo = "order-" + numericalOrder;

  const billingAddress = {
    name: billingName,
    email: billingEmail,
    phoneNumber: billingPhoneNumber,
    address: billingAdress,
    district: billingDistrict,
    city: billingCity,
  };

  if (!Array.isArray(itemSelect)) {
    itemSelect = [itemSelect];
    quantity = [quantity];
    itemColor = [itemColor];
    itemSize = [itemSize];
    itemPrice = [itemPrice];
  }

  const orderItems = itemSelect.map((productId, index) => ({
    productId: new ObjectId(productId),
    quantity: parseInt(quantity[index]),
    price: parseFloat(itemPrice[index]),
    color: itemColor[index],
    size: itemSize[index],
  }));

  if (orderItems.length > 0) {
    for (let orderItem of orderItems) {
      subTotal += orderItem.price * orderItem.quantity;
    }
  }

  total = (subTotal * (100 - discount)) / 100;

  try {
    const rs = await OrderModel.create({
      orderNo: orderNo,
      discount: parseFloat(discount),
      total: total,
      status: "created",
      orderItems: orderItems,
      numericalOrder: numericalOrder,
      createdAt: new Date(),
      billingAdress: billingAddress,
    });
    res.redirect("/orders");
  } catch (error) {
    console.log("error: ", error);
    res.status(500).send("Có lỗi xảy ra khi tạo đơn hàng");
  }
}

