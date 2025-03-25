import createApiClient from "./api.service.js";

class AdminService {
    constructor(baseUrl = "/api/admin") {
        this.api = createApiClient(baseUrl);
    }

    // Đăng nhập Admin
    async adminLogin(credentials) {
        try {
            const response = await this.api.post("/adminLogin", credentials);
            console.log("✅ API Response:", response.data);

            return {
                status: "success",
                message: response.data.message || "Admin login successful",
                user: response.data.user,
            };
        } catch (err) {
            console.error("🔴 API Login Error:", err.response?.data || err.message);

            return {
                status: "error",
                message: err.response?.data?.message || "Login failed",
            };
        }
    }

    // Thêm nhân viên mới
    async addStaff(staffData) {
        try {
            const response = await this.api.post("/addStaff", staffData);
            console.log("✅ Staff Added:", response.data);

            return {
                status: "success",
                message: response.data.message || "Staff added successfully",
                staff: response.data.staff,
            };
        } catch (err) {
            console.error("🔴 Add Staff Error:", err.response?.data || err.message);

            return {
                status: "error",
                message: err.response?.data?.message || "Failed to add staff",
            };
        }
    }

    // Xóa nhân viên theo ID
    async deleteStaff(staffId) {
        try {
            const response = await this.api.delete(`/${staffId}`);
            console.log("✅ Staff Deleted:", response.data);

            return {
                status: "success",
                message: response.data.message || "Staff deleted successfully",
            };
        } catch (err) {
            console.error("🔴 Delete Staff Error:", err.response?.data || err.message);

            return {
                status: "error",
                message: err.response?.data?.message || "Failed to delete staff",
            };
        }
    }
}

export default new AdminService();
