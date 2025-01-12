import CategoryModel from "../models/categoryModel.js";
import { ObjectId } from "mongodb";
export async function listCategory(req, res){
    try {
    const categories = await CategoryModel.find({deleteAt: null});
    res.render("pages/categories/list", {
        title: "categories",
        categories: categories,
    });
    }catch(e){
    res.send("Lỗi lấy danh sách category");
    }
}
export async function renderpageCreateCategory(req, res){
    res.render("pages/categories/form", {
        title: "Create categories",
        mode: "Create",
        category: {}
    });
}
export async function createCategory(req, res){
    const {code,name,image} = req.body;
    try {
    await CategoryModel.create({
       code, name, image, createAt: new Date()
    });
    res.redirect("/categories")
    }catch(e){
    res.send("Tạo sản phẩm không thành công");
    }
}

export async function renderpageUpdateCategory(req, res){
    try {
        const {id} = req.params;
    const category = await CategoryModel.findOne({_id: new ObjectId(id), deleteAt: null});
    if(category) {
        res.render("pages/categories/form", {
        title: "update categories",
        mode: "Update",
        category: category
    });
    }else {
        res.send("Không thấy sản phẩm nào phù hợp");
    }
    }catch(e){
        res.send("Trang web không tồn tại!");
    }
}
export async function updateCategory(req, res){
    const {code,name,image, id} = req.body;
    try {
    await CategoryModel.updateOne(
        {_id: new ObjectId(id)},
        {
       code,
        name, 
        image, 
        updateAt: new Date()
    });
    res.redirect("/categories")
    }catch(e){
    res.send("Cập nhật sản phẩm không thành công");
    }
}

export async function renderpageDeleteCategory(req, res){
   try {
    const {id} = req.params;
    const category = await CategoryModel.findOne({_id: new ObjectId(id), deleteAt: null});
    if(category) {
        res.render("pages/categories/form", {
        title: "Delete categories",
        mode: "Delete",
        category: category
    });
    }else {
        res.send("Không thấy sản phẩm nào phù hợp");
    }
   }catch(e){
    res.send("Trang web không tồn tại!");
   }
}
export async function deleteCategory(req, res){
    const {id} = req.body;
    try {
    await CategoryModel.deleteOne(
        {_id: new ObjectId(id)},
        {
            updateAt: new Date()
    });
    res.redirect("/categories")
    }catch(e){
    res.send("Cập nhật sản phẩm không thành công");
    }
}