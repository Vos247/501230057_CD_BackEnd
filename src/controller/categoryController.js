import CategoryModel from "../models/categoryModel.js";
import { ObjectId } from "mongodb";
import { removeVietnameseAccents } from "../common/index.js"; // loại bỏ dấu tiếng việt để dễ tìm kiếm
export async function listCategory(req, res) {
    const search = req.query?.search;
    const pageSize = !!req.query?.pageSize ? parseInt(req.query.pageSize) : 5;
    const page = !!req.query?.page ? parseInt(req.query.page) : 1;
    const skip = (page - 1) * pageSize;
    let sort = !!req.query?.sort ? req.query.sort : null;
    const sortObjects = [
    { code: '', name: "Sắp xếp"},
    { code: "name_DESC", name: "Ten giam dan" },
    { code: "name_ASC", name: "Ten tang dan" },
    { code: "code_DESC", name: "Ma giam dan" },
    { code: "code_ASC", name: "Ma tang dan" },
    ];
    const filters = {
      deleteAt: null,
    };
    if (search && search.length > 0) {
      filters.searchString = {
        $regex: removeVietnameseAccents(search),
        $options: "i",
      };
    }
    if (!sort) {
      sort = { createdAt: -1 };
    } else {
      const sortArray = sort.split("_");
      sort = { [sortArray[0]]: sortArray[1] === "ASC" ? 1 : -1 };
    }
    try {
      const countCategories = await CategoryModel.countDocuments(filters);
      const categories = await CategoryModel.find(filters)
        .skip(skip)
        .limit(pageSize)
        .sort(sort);
  
      res.render("pages/categories/list", {
        title: "categories",
        categories: categories,
        countPagination: Math.ceil(countCategories / pageSize),
        pageSize,
        page,
        sort,
        sortObjects,
      });
    } catch (e) {
      res.send("Loi lay danh sach");
    }
  }
export async function renderpageCreateCategory(req, res) {
    res.render("pages/categories/form", {
        title: "Create categories",
        mode: "Create",
        category: {},
        err: {} // mặc định là rổng vì đang tạo mới
    });
}
export async function createCategory(req, res) {
    const data = req.body; // lấy dữ liệu form đã nhập thông qua post
    try {
       const category = await CategoryModel.findOne({code: data.code, deletedAt: null});
       if(category){
           throw("code");
       }
        await CategoryModel.create({
            ...data, createAt: new Date() // ...data sao chép toàn bộ dữ liệu người dùng đã nhập , new date để lấy thời gian hiện tại
        });
        res.redirect("/categories") // nếu tạo thành công sẽ chuyển đến trang danh sách 
    } catch (error) {
        let err = {};
        if (error === "code") {
            err.code = "Ma san pham ton tai";
        }
        if (error.name === "ValidationError") {
            Object.keys(error.errors).forEach((key) => {
                err[key] = error.errors[key].message;
            });
            console.log("err", err);
        }
        res.render("pages/categories/form", {
            title: "Create categories",
            mode: "Create",
            category: { ...data },
            err
        });
    }
}

export async function renderpageUpdateCategory(req, res) {
    try {
        const { id } = req.params; // lấy danh mục cần sửa
        const category = await CategoryModel.findOne({ _id: new ObjectId(id), deleteAt: null }); // lấy id cần tìm và đảm bảo chưa bị xóa
        if (category) {
            res.render("pages/categories/form", {
                title: "update categories",
                mode: "Update",
                category: category, // chứa danh mục form
                err: {} 
            });
        } else {
            res.send("Không thấy sản phẩm nào phù hợp");
        }
    } catch (e) {
        res.send("Trang web không tồn tại!");
    }
}
export async function updateCategory(req, res) {
    const { ...data } = req.body;
    const { id } = req.params;
    try {
        const category = await CategoryModel.findOne({ 
            code: data.code, 
            deleteAt: null, 
            _id: { $ne: new ObjectId(id) } // Loại trừ chính danh mục hiện tại
        });
        if (category) {
            throw ("code");
        }
        
        await CategoryModel.updateOne(
            { _id: new ObjectId(id) },
            {
                ...data,    // điều kiện xác nhận tài liệu cần cập nhật và cập nhật trong các trường hợp của data
                updateAt: new Date()
            });
        res.redirect("/categories")
    } catch (error) {
        let err = {};
        if (error === "code") {
            err.code = "Mã sản phẩm đã tồn tại";
        }
        if (error.name === "ValidationError") {
            Object.keys(error.errors).forEach((key) => {
                err[key] = error.errors[key].message;
            });
            console.log("err", err);
        }
        res.render("pages/categories/form", {
            title: "Update categories",
            mode: "Update",
            category: { ...data, _id: id},
            err
        });
    }
}

export async function renderpageDeleteCategory(req, res) {
    try {
        const { id } = req.params;
        const category = await CategoryModel.findOne({ _id: new ObjectId(id), deleteAt: null });
        if (category) {
            res.render("pages/categories/form", {
                title: "Delete categories",
                mode: "Delete",
                category: category,
                err: {}
            });
        } else {
            res.send("Không thấy sản phẩm nào phù hợp");
        }
    } catch (e) {
        res.send("Trang web không tồn tại!");
    }
}
export async function deleteCategory(req, res) {
    const { id } = req.body;
    try {
        await CategoryModel.deleteOne(
            { _id: new ObjectId(id) },
            {
                updateAt: new Date()
            });
        res.redirect("/categories")
    } catch (e) {
        res.send("Cập nhật sản phẩm không thành công");
    }
}