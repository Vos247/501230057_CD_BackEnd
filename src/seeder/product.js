import CategoryModel from "../models/categoryModel.js";
import ProductModel from "../models/productModel.js";

const data = [
  {
    code: "A_001",
    name: "Áo dài tay nam",
    price: 100000,
    images: ["profile3.jpg"],
    searchString: "Ao dai tay nam, ao dai tay, dai tay nam",
    size: ["S", "M", "L","XL"],
    color: ["blue", "red", "green","yellow"],
    active: true,
    description: "mo ta cho ao nam",
    information: "thong tin cho ao nam",
    categoryCode: "A_001",
    createdAt: new Date(),
  },
  {
    code: "AD_002",
    name: "Áo dài tay nữ",
    price: 120000,
    images: ["profile1.jpg"],
    searchString: "ao dai tay nu, dai tay nu, dai tay nu",
    size: ["S", "M", "L","XL"],
    color: ["yellow", "red", "green","blue"],
    active: true,
    description: "mo ta cho ao thun nu",
    information: "thong tin cho ao thun nu",
    categoryCode: "A_002",
    createdAt: new Date(),
  },
];
export default async function categorySeeder(){
    await ProductModel.deleteMany();
    const categories = await CategoryModel.find({});
    let writeProduct = [];
    for (let product in data) {
      const { categoryCode, ...dataOther } = data[product];
      const category = categories.find((categoryItem) => {
        return categoryItem.code === categoryCode;
      });
      writeProduct.push({
        categoryId: !!category ? category._id : null,
        ...dataOther,
      });
    }
    await ProductModel.insertMany(writeProduct);
}