import CategoryModel from "../models/categoryModel.js";
import { ObjectId } from "mongodb";
import { removeVietnameseAccents } from "../common/index.js"; // loại bỏ dấu tiếng việt để dễ tìm kiếm
const sortObjects = [
    { code: "name_ASC", name: "Tên tăng dần", sort: { name: 1 } },
    { code: "name_DESC", name: "Tên giảm dần", sort: { name: -1 } },
    { code: "code_ASC", name: "Mã tăng dần", sort: { code: 1 } },
    { code: "code_DESC", name: "Mã giảm dần", sort: { code: -1 } }
];
export async function listCategory(req, res) {
    const search = req.query?.search;
    const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 5;
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const skip = (page - 1) * pageSize;
    const sortQuery = req.query.sort || null;
    // Mặc định không sắp xếp
    let sortOption = {};
    // Kiểm tra xem sortQuery có hợp lệ không
    const sortObj = sortObjects.find(item => item.code === sortQuery);
    if (sortObj) {
        sortOption = sortObj.sort;
    }
    const filters = {
        deleteAt: null // Chưa bị xóa
    };
    if (search && search.length > 0) {
        filters.searchString = { $regex: removeVietnameseAccents(search), $options: "i" };
    }
    try {
        const countCategories = await CategoryModel.countDocuments(filters);
        const categories = await CategoryModel.find(filters)
            .sort(sortOption) // Thêm sắp xếp vào truy vấn
            .skip(skip)
            .limit(pageSize);
        res.render("pages/categories/list", {
            title: "categories",
            categories: categories,
            countPagination: Math.ceil(countCategories / pageSize),
            pageSize,
            page,
            sort: sortQuery,
            sortObjects
        });
    } catch (e) {
        res.send("Lỗi lấy danh sách category");
    }
}
export async function renderpageCreateCategory(req, res){
    res.render("pages/categories/form", {
        title: "Create categories",
        mode: "Create",
        category: {} // mặc định là rổng vì đang tạo mới
    });
}
export async function createCategory(req, res){
    const data = req.body; // lấy dữ liệu form đã nhập thông qua post
    try {
    await CategoryModel.create({
       ...data, createAt: new Date() // ...data sao chép toàn bộ dữ liệu người dùng đã nhập , new date để lấy thời gian hiện tại
    });
    res.redirect("/categories") // nếu tạo thành công sẽ chuyển đến trang danh sách 
    }catch(e){
    res.send("Tạo sản phẩm không thành công");
    }
}

export async function renderpageUpdateCategory(req, res){
    try {
        const {id} = req.params; // lấy danh mục cần sửa
    const category = await CategoryModel.findOne({_id: new ObjectId(id), deleteAt: null}); // lấy id cần tìm và đảm bảo chưa bị xóa
    if(category) {
        res.render("pages/categories/form", {
        title: "update categories",
        mode: "Update",
        category: category // chứa danh mục form
    });
    }else {
        res.send("Không thấy sản phẩm nào phù hợp");
    }
    }catch(e){
        res.send("Trang web không tồn tại!");
    }
}
export async function updateCategory(req, res){
    const {id, ...data} = req.body; // khai báo 2 biến dùng để chứa dữ liệu từ form và ID với data cần cập nhật
    try {
    await CategoryModel.updateOne( 
        {_id: new ObjectId(id)},
        {
            ...data,    // điều kiện xác nhận tài liệu cần cập nhật và cập nhật trong các trường hợp của data
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