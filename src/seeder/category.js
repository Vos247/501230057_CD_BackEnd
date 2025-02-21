import CategoryModel from "../models/categoryModel.js";
const data = [
    {
        code: "A_001",
        name: "Áo",
        image: "cat-1.jpg",
        searchString: "Ao nam",
        createdAt: new Date(),
    },
    {
        code: "A_002",
        name: "Áo nữ",
        image: "cat-2.jpg",
        searchString: "ao nu",
        createdAt: new Date(),
    },
    {
        code: "G_001",
        name: "Giày",
        image: "cat-6.jpg",
        searchString: "giay nam",
        createdAt: new Date(),
    },
    {
        code: "MA_001",
        name: "Máy ảnh",
        image: "cat-4.jpg",
        searchString: "may anh",
        createdAt: new Date(),
    },
]
export default async function categorySeeder(){
    await CategoryModel.deleteMany()
    await CategoryModel.insertMany(data)
}