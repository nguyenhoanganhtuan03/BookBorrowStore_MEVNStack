import createApiClient from "./api.service.js";

class UserService {
    constructor(baseUrl = "/api/users") {
        this.api = createApiClient(baseUrl);
    }

    async register(userData) {
        try {
            const data = (await this.api.post("/register", userData)).data;
            return {
                status: "success",
                message: data.message || "User registered successfully",
                data: data.data,
            };
        } catch (err) {
            return {
                status: "error",
                message: err.response?.data?.message || "Registration failed",
            };
        }
    }

    async login(credentials) {
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

    async getAllUsers() {
        try {
            const data = (await this.api.get("/")).data;
            return {
                status: "success",
                message: data.message || "Users retrieved successfully",
                data: data.data,
            };
        } catch (err) {
            return {
                status: "error",
                message: err.response?.data?.message || "Failed to fetch users",
            };
        }
    }

    async findUserByUsername(username) {
        try {
            const data = (await this.api.get(`/search/${username}`)).data;
            return {
                status: "success",
                message: data.message || "User found successfully",
                data: data.data,
            };
        } catch (err) {
            return {
                status: "error",
                message: err.response?.data?.message || "User not found",
            };
        }
    }

    async updateUser(id, userData) {
        try {
            const response = await this.api.put(`/${id}`, userData); // Gửi yêu cầu PUT tới API
            const data = response.data || {}; // Đảm bảo dữ liệu trả về luôn là một đối tượng

            // Trả về thông báo và dữ liệu người dùng đã được cập nhật
            return {
                status: "success",
                message: data.message || "User updated successfully", // Kiểm tra thông báo từ API hoặc dùng thông báo mặc định
                data: data.data || null, // Kiểm tra nếu có dữ liệu trả về
            };
        } catch (err) {
            // Nếu có lỗi xảy ra trong quá trình gọi API
            console.error("Error updating user:", err);
            return {
                status: "error",
                message: err.response?.data?.message || "Failed to update user", // Kiểm tra thông báo lỗi từ API hoặc dùng thông báo mặc định
            };
        }
    }


    async deleteUser(id) {
        try {
            const data = (await this.api.delete(`/${id}`)).data;
            return {
                status: "success",
                message: data.message || "User deleted successfully",
            };
        } catch (err) {
            return {
                status: "error",
                message: err.response?.data?.message || "Failed to delete user",
            };
        }
    }

    async getUserById(id) {
        try {
            const data = (await this.api.get(`/${id}`)).data;  
            return {
                status: "success",
                message: data.message || "User retrieved successfully",
                data: data.data,
            };
        } catch (err) {
            return {
                status: "error",
                message: err.response?.data?.message || "Failed to fetch user",
            };
        }
    }
}

export default new UserService();
