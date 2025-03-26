import createApiClient from "./api.service.js";

class PublisherService {
    constructor(baseUrl = "/api/publishers") {
        this.api = createApiClient(baseUrl);
    }

    // Thêm publisher
    async addPublisher(publisherData) {
        try {
            const response = await this.api.post("/add", publisherData);
            return {
                status: "success",
                message: response.data?.message || "Publisher added successfully",
                data: response.data?.data || null,
            };
        } catch (err) {
            return {
                status: "error",
                message: err.response?.data?.message || "Failed to add publisher",
            };
        }
    }

    // Cập nhật publisher
    async updatePublisher(id, updateData) {
        try {
            const response = await this.api.put(`/${id}`, updateData);
            return {
                status: "success",
                message: response.data?.message || "Publisher updated successfully",
                data: response.data?.data || null,
            };
        } catch (err) {
            return {
                status: "error",
                message: err.response?.data?.message || "Failed to update publisher",
            };
        }
    }

    // Xóa publisher
    async deletePublisher(id) {
        try {
            const response = await this.api.delete(`/${id}`);
            return {
                status: "success",
                message: response.data?.message || "Publisher deleted successfully",
            };
        } catch (err) {
            return {
                status: "error",
                message: err.response?.data?.message || "Failed to delete publisher",
            };
        }
    }

    // Lấy publisher theo ID
    async getPublisherById(id) {
        try {
            const response = await this.api.get(`/${id}`);
            return {
                status: "success",
                data: response.data?.data || null,
                message: response.data?.message || "Fetched publisher successfully",
            };
        } catch (err) {
            return {
                status: "error",
                message: err.response?.data?.message || "Failed to fetch publisher",
            };
        }
    }

    // Tìm publisher theo tên
    async getPublisherByName(name) {
        try {
            const response = await this.api.get(`/search/${name}`);
            return {
                status: "success",
                data: response.data?.data || [],
                message: response.data?.message || "Fetched publishers by name successfully",
            };
        } catch (err) {
            return {
                status: "error",
                message: err.response?.data?.message || "Failed to fetch publisher by name",
            };
        }
    }

    // Lấy tất cả publishers
    async getAllPublishers() {
        try {
            const response = await this.api.get("/");
            console.log("Nhận từ Backend", response.data)
            return {
                status: "success",
                data: response.data || [],
                message: response.data?.message || "Fetched all publishers successfully",
            };
        } catch (err) {
            return {
                status: "error",
                message: err.response?.data?.message || "Failed to fetch all publishers",
            };
        }
    }
}

export default new PublisherService();
