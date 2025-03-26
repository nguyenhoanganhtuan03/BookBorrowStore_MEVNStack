<template>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css" rel="stylesheet">
    <div :class="['card', 'publisher-card', 'shadow-sm']">
        <div class="row g-0">
            <!-- Cột Thông tin Nhà Xuất Bản -->
            <div class="col-md-9 p-3">
                <p class="card-text"><strong>Tên NXB:</strong> {{ publisher.publisherName }}</p>
                <p class="card-text"><strong>Địa chỉ:</strong> {{ publisher.address }}</p>
            </div>

            <!-- Cột nút Cập nhật & Xóa -->
            <div class="col-md-3 d-flex align-items-center justify-content-center">
                <div class="btn-group">
                    <button class="btn btn-warning btn-sm" @click="openUpdateForm">
                        ✏️
                    </button>
                    <button class="btn btn-danger btn-sm" @click="deletePub">
                        🗑️
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Form cập nhật thông tin Nhà Xuất Bản -->
    <div v-if="showUpdateForm" class="update-form-overlay">
        <div class="update-form">
            <h5>Cập nhật thông tin Nhà Xuất Bản</h5>
            <input v-model="updatedPublisher.publisherName" placeholder="Tên NXB" class="form-control mb-2" />
            <input v-model="updatedPublisher.address" placeholder="Địa chỉ" class="form-control mb-2" />
            <div class="d-flex justify-content-end gap-2">
                <button class="btn btn-secondary" @click="showUpdateForm = false">Hủy</button>
                <button class="btn btn-primary" @click="saveChanges">Lưu thay đổi</button>
            </div>
        </div>
    </div>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import publisherService from "@/services/publisher.service";

export default {
    props: {
        publisher: {
            type: Object,
            required: true
        }
    },
    setup(props, { emit }) {
        const router = useRouter();
        const showUpdateForm = ref(false);
        const updatedPublisher = ref({ ...props.publisher });

        const openUpdateForm = () => {
            updatedPublisher.value = { ...props.publisher };
            showUpdateForm.value = true;
        };

        const saveChanges = async () => {
            console.log("Dữ liệu gửi lên API:", updatedPublisher.value._id);
            try {
                await publisherService.updatePublisher(updatedPublisher.value._id, updatedPublisher.value);
                alert(`✅ Cập nhật thành công!`);
                emit("update-publisher", updatedPublisher.value);
                showUpdateForm.value = false;
                router.push("/").then(() => {
                    router.push("/admin/publisher-manage");
                });
            } catch (error) {
                console.error("🔴 Lỗi khi cập nhật thông tin Nhà Xuất Bản:", error);
                alert("❌ Cập nhật thất bại!");
            }
        };

        const deletePub = async () => {
            if (!confirm(`Bạn có chắc muốn xóa ${props.publisher.publiserName}?`)) return;
            try {
                await publisherService.deletePublisher(props.publisher._id);
                alert(`✅ Đã xóa ${props.publisher.publiserName}`);
                router.push("/").then(() => {
                    router.push("/admin/publisher-manage");
                });
            } catch (error) {
                console.error("🔴 Lỗi khi xóa nxb:", error);
                alert("❌ Xóa nxb thất bại!");
            }
        };

        return { 
            showUpdateForm, 
            updatedPublisher, 
            openUpdateForm, 
            saveChanges, 
            deletePub
        };
    },
};
</script>

<style scoped>
.publisher-card {
    border-radius: 10px;
    overflow: hidden;
    transition: transform 0.3s ease, filter 0.3s ease;
    cursor: pointer;
    margin-bottom: 15px;
}

.publisher-card:hover {
    transform: scale(1.03);
    filter: brightness(1.05);
}

.btn-group {
    display: flex;
    gap: 5px;
}
</style>