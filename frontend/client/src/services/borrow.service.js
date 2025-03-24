import createApiClient from "./api.service.js";

class BorrowService {
    constructor(baseUrl = "/api/borrows") {
        this.api = createApiClient(baseUrl); // Khởi tạo api client với baseUrl
    }

    // Tạo mới borrow
    async createBorrow(userData) {
        try {
            const response = await this.api.post("/borrow", userData); // Gửi POST request
            const data = response.data; // Lấy dữ liệu từ response
            return {
                status: "success",
                message: data.message || "Created Borrow successfully", // Thông báo thành công
                data: data.data || null, // Dữ liệu trả về
            };
        } catch (err) {
            // Nếu có lỗi, trả về thông báo lỗi
            return {
                status: "error",
                message: err.response?.data?.message || "Created failed", // Thông báo lỗi từ API hoặc thông báo mặc định
            };
        }
    }

    // Lấy borrow theo id
    async getBorrowById(id) {
        try {
            const response = await this.api.get(`/${id}`); // Gửi GET request với id
            return {
                status: "success",
                data: response.data?.data || null,
                message: response.data?.message || "Fetched Borrow by ID successfully", // Thông báo thành công
            };
        } catch (err) {
            // Nếu có lỗi, trả về thông báo lỗi
            return {
                status: "error",
                message: err.response?.data?.message || "Failed to fetch borrow by ID",
            };
        }
    }

    // Cập nhật borrow
    async updateBorrow(id, userData) {
        try {
            const response = await this.api.put(`/${id}`, userData); // Gửi PUT request với id
            return {
                status: "success",
                message: response.data?.message || "Updated Borrow successfully", // Thông báo thành công
                data: response.data?.data || null, // Dữ liệu trả về
            };
        } catch (err) {
            // Nếu có lỗi, trả về thông báo lỗi
            return {
                status: "error",
                message: err.response?.data?.message || "Failed to update borrow",
            };
        }
    }

    // Lấy tất cả borrows
    async getAllBorrows() {
        try {
            const response = await this.api.get("/"); // Gửi GET request không có id
            return {
                status: "success",
                data: response.data?.data || [],
                message: response.data?.message || "Fetched all borrows successfully", // Thông báo thành công
            };
        } catch (err) {
            // Nếu có lỗi, trả về thông báo lỗi
            return {
                status: "error",
                message: err.response?.data?.message || "Failed to fetch all borrows",
            };
        }
    }

    // Lấy borrows của người dùng theo userId
    async getBorrowsByUserId(userId) {
        try {
            const response = await this.api.get(`/search/${userId}`); 
            console.log("Dữ liệu Backend", response.data)
            return {
                status: "success",
                data: response.data?.data || [], 
                message: response.data?.message || "Fetched borrows by user ID successfully",
            };
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Failed to fetch borrows by user ID";
            return {
                status: "error",
                message: errorMessage,
            };
        }
    }
}

export default new BorrowService();
