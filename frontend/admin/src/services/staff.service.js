import createApiClient from "./api.service.js";

class StaffService {
    constructor(baseUrl = "/api/staffs") {
        this.api = createApiClient(baseUrl);
    }

    // Đăng nhập nhân viên
    async staffLogin(credentials) {
        try {
            const response = await this.api.post("/login", credentials);
            console.log("✅ API Response:", response.data);

            return {
                status: "success",
                message: response.data.message || "Login successful",
                user: response.data.user,  // Trả về thông tin user từ response
            };
        } catch (err) {
            console.error("🔴 API Login Error:", err.response?.data || err.message);

            return {
                status: "error",
                message: err.response?.data?.message || "Login failed",
            };
        }
    }

    // Cập nhật thông tin nhân viên
    async updateStaff(id, staffData) {
        try {
            const response = await this.api.put(`/${id}`, staffData);
            console.log("✅ API Response:", response.data);

            return {
                status: "success",
                message: response.data.message || "Staff updated successfully",
            };
        } catch (err) {
            console.error("🔴 API Update Error:", err.response?.data || err.message);

            return {
                status: "error",
                message: err.response?.data?.message || "Failed to update staff",
            };
        }
    }

    // Lấy thông tin nhân viên theo ID
    async getStaffById(id) {
        try {
            const response = await this.api.get(`/${id}`);
            console.log("✅ API Response:", response.data);

            return {
                status: "success",
                user: response.data.user,  // Trả về thông tin nhân viên từ response
            };
        } catch (err) {
            console.error("🔴 API Get Staff by ID Error:", err.response?.data || err.message);

            return {
                status: "error",
                message: err.response?.data?.message || "Failed to get staff by ID",
            };
        }
    }

    // Tìm kiếm nhân viên theo tên
    async searchStaffByUsername(username) {
        try {
            const response = await this.api.get(`/search/${username}`);
            console.log("✅ API Response:", response.data);

            return {
                status: "success",
                users: response.data.users,  // Trả về danh sách nhân viên từ response
            };
        } catch (err) {
            console.error("🔴 API Search Staff by Username Error:", err.response?.data || err.message);

            return {
                status: "error",
                message: err.response?.data?.message || "Failed to search staff by username",
            };
        }
    }

    // Lấy tất cả nhân viên
    async getAllStaffs() {
        try {
            const response = await this.api.get("/");
            console.log("✅ API Response:", response.data);

            return {
                status: "success",
                users: response.data,  // Trả về danh sách tất cả nhân viên từ response
            };
        } catch (err) {
            console.error("🔴 API Get All Staff Error:", err.response?.data || err.message);

            return {
                status: "error",
                message: err.response?.data?.message || "Failed to get all staff",
            };
        }
    }
}

export default new StaffService();
