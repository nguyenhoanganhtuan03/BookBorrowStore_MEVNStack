import createApiClient from "./api.service.js";

class AdminService {
    constructor(baseUrl = "/api/admin") {
        this.api = createApiClient(baseUrl);
    }

    // Đăng nhập Admin
    async login(credentials) {
        try {
            const data = (await this.api.post("/adminLogin", credentials)).data;
            return {
                status: "success",
                message: data.message || "Đăng nhập thành công",
                data: data.data,
            };
        } catch (err) {
            return {
                status: "error",
                message: err.response?.data?.message || "Đăng nhập thất bại",
            };
        }
    }

    // Thêm nhân viên mới
    async addStaff(staffData) {
        try {
            const data = (await this.api.post("/addStaff", staffData)).data;
            return {
                status: "success",
                message: data.message || "Thêm nhân viên thành công",
                data: data.data,
            };
        } catch (err) {
            return {
                status: "error",
                message: err.response?.data?.message || "Thêm nhân viên thất bại",
            };
        }
    }

    // Xóa nhân viên theo ID
    async deleteStaff(id) {
        try {
            const data = (await this.api.delete(`/${id}`)).data;
            return {
                status: "success",
                message: data.message || "Xóa nhân viên thành công",
            };
        } catch (err) {
            return {
                status: "error",
                message: err.response?.data?.message || "Xóa nhân viên thất bại",
            };
        }
    }
}

export default new AdminService();
