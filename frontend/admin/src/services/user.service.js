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
            const data = (await this.api.post("/login", credentials)).data;
            return {
                status: "success",
                message: data.message || "Login successful",
                data: data.data,
            };
        } catch (err) {
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
            const data = (await this.api.put(`/update/${id}`, userData)).data;
            return {
                status: "success",
                message: data.message || "User updated successfully",
                data: data.data,
            };
        } catch (err) {
            return {
                status: "error",
                message: err.response?.data?.message || "Failed to update user",
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
}

export default new UserService();
