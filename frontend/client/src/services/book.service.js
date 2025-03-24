import createApiClient from "./api.service.js";

class BookService {
    constructor(baseUrl = "/api/books") {
        this.api = createApiClient(baseUrl);
    }

    async addBook(bookData) {
        try {
            const data = (await this.api.post("/add", bookData)).data;
            return {
                status: "success",
                message: data.message || "Added Book successfully",
                data: data.data,
            };
        } catch (err) {
            return {
                status: "error",
                message: err.response?.data?.message || "Add failed",
            };
        }
    }

    async getBooks() {
        try {
            const response = await this.api.get("/");
            console.log("Dữ liệu nhận được từ API:", response.data);

            return {
                status: "success",
                message: response.data.message || "Books retrieved successfully",
                data: response.data || [],
            };
        } catch (err) {
            console.error("Lỗi khi gọi API:", err);
            return {
                status: "error",
                message: err.response?.data?.message || "Failed to fetch books",
                data: [],
            };
        }
    }

    async getBookById(id) {
        try {
            console.log("🔎 Đang tìm kiếm sách với ID:", id);
            const response = await this.api.get(`/${id}`);
            console.log("📚 Kết quả API:", response.data);

            // Kiểm tra nếu response.data hợp lệ
            if (response.data && response.data._id) {
                return {
                    status: "success",
                    message: response.data.message || "Book found successfully",
                    data: response.data, // ✅ Trả về trực tiếp dữ liệu sách
                };
            } else {
                return {
                    status: "error",
                    message: "Không tìm thấy sách với ID này",
                    data: [],
                };
            }
        } catch (err) {
            console.error("❌ Lỗi API:", err);
            return {
                status: "error",
                message: err.response?.data?.message || "Lỗi khi gọi API",
                data: [],
            };
        }
    }

    async getBookByName(bookname) {
        try {
            console.log("🔎 Đang tìm kiếm sách:", bookname);
            const response = await this.api.get(`/search/${bookname}`);
            console.log("📚 Kết quả API:", response.data);

            // Kiểm tra nếu response trả về mảng hợp lệ
            if (response.data && Array.isArray(response.data) && response.data.length > 0) {
                return {
                    status: "success",
                    message: "Tìm thấy sách",
                    data: response.data, // ✅ Dữ liệu hợp lệ
                };
            } else {
                return {
                    status: "error",
                    message: "Không tìm thấy sách nào",
                    data: [],
                };
            }
        } catch (err) {
            console.error("❌ Lỗi API:", err);
            return {
                status: "error",
                message: err.response?.data?.message || "Lỗi khi gọi API",
                data: [],
            };
        }
    }

    async updateBook(id, bookData) {
        try {
            const data = (await this.api.put(`/${id}`, bookData)).data;
            return {
                status: "success",
                message: data.message || "Book updated successfully",
                data: data.data,
            };
        } catch (err) {
            return {
                status: "error",
                message: err.response?.data?.message || "Failed to update book",
            };
        }
    }

    async deleteBook(id) {
        try {
            const data = (await this.api.delete(`/${id}`)).data;
            return {
                status: "success",
                message: data.message || "Book deleted successfully",
            };
        } catch (err) {
            return {
                status: "error",
                message: err.response?.data?.message || "Failed to delete book",
            };
        }
    }
}

export default new BookService();