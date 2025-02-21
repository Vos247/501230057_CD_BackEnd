import CategoryModel from "../models/categoryModel.js";
import ProductModel from "../models/productModel.js";
const data = [
    {
        code: "A_001",
        name: "Áo dài tay nam",
        price: 100000,
        images: ["product-3.jpg"],
        searchString: "Ao dai tay nam, ao dai tay, dai tay nam",
        size: ["S", "M", "L", "XL"],
        colors: ["red", "blue", "green", "yellow"],
        active: 'on',
        description: "Áo dài tay nam đẹp",
        information: "Áo dài tay nam đẹp",
        categoryCode: "A_001",
        createdAt: new Date(),
    },
    {
        code: "AD_002",
        name: "Áo dài tay nữ",
        price: 120000,
        images: ["product-1.jpg"],
        searchString: "ao dai tay nu, dai tay nu, dai tay nu",
        size: ["S", "M", "L", "XL"],
        colors: ["red", "blue", "green", "yellow"],
        active: 'on',
        description: "Áo dài tay nữ đẹp",
        information: "Áo dài tay nữ đẹp",
        categoryCode: "A_002",
        createdAt: new Date(),
    },
    {
        code: "GN_001",
        name: "giày nam",
        price: 80000,
        images: ["product-10.jpg"],
        searchString: "giay nu, giay",
        size: ["39", "40", "41", "42"],
        colors: ["red", "blue", "green", "yellow"],
        active: 'on',
        description: "giày nam đẹp",
        information: "giày nam đẹp",
        categoryCode: "G_001",
        createdAt: new Date(),
    },
    {
        code: "MA_001",
        name: "máy ảnh cơ",
        price: 150000,
        images: ["product-9.jpg"],
        searchString: "may anh",
        // size: ["S", "M", "L", "XL"],
        colors: ["red", "blue", "green", "yellow"],
        active: 'on',
        description: "máy ảnh đẹp",
        information: "máy ảnh đẹp",
        categoryCode: "MA_001",
        createdAt: new Date(),
    },
]
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