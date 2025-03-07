import mongoose, { Mongoose } from "mongoose";
const { Schema } = mongoose;

const orderItemSchema = new Schema(
  {
    // productCode: String,
    productId: Schema.Types.ObjectId,
    quantity: Number,
    total: Number,
    price: Number,
    color: {
      type: String,
      enum: ["red", "blue", "green", "yellow"],
    },
    size: {
      type: String,
      enum: ["S", "M", "L", "XL"],
    },
  },{
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  });
  const billingAdressSchema = new Schema(
    {
      name: String,
      email: String,
      phoneNumber: Number,
      address: String,
      district: String,
      city: String,
    },{
      versionKey: false,
    });
const orderSchema = new Schema(
  {
    orderNo: String,
    status: {
      type: String,
      enum: ["cancelled", "created", "completed", "delivering"],
    },
    orderItems: {
      type: [orderItemSchema],
      required: [true, "Bắt buộc phải có sản phẩm trong đơn hàng"],
    },
    billingAdress: {
      type: billingAdressSchema,
    },
    total: Number,
    discount: {
      type: Number,
      max: 100, // Giới hạn tối đa là 100%
      default: 0,
    },    
    numericalOrder: {
      type: Number,
      default: 0, // Gán mặc định để tránh undefined
    },    
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date,
  },
  {
    versionKey: false,
    collection: "orders",
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
orderItemSchema.virtual("product", {
  ref: "Product",
  localField: "productId",
  foreignField: "_id",
  justOne: true,
});
orderItemSchema.virtual("priceFormatString").get(function () {
  return this.price.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
});
orderSchema.virtual("totalFormatString").get(function () {
  return this.total.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
})
const OrderModel = mongoose.model("Order", orderSchema);

export default OrderModel;
