<template>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css" rel="stylesheet">
    <div :class="['card', 'borrow-card', 'shadow-sm', borrow.note === 'Đã trả' ? 'returned' : '']">
        <div class="row g-0">
            <!-- Cột Thông tin mượn sách -->
            <div class="col-md-9 p-3">
                <p class="card-text"><strong>Người mượn:</strong> {{ borrow.username }}</p>
                <p class="card-text"><strong>Tên sách:</strong> {{ borrow.bookname }}</p>
                <p class="card-text"><strong>Ngày mượn:</strong> {{ borrow.borrowDate }}</p>
                <p class="card-text"><strong>Ngày trả:</strong> {{ borrow.returnDate }}</p>
                <p class="card-text"><strong>Trạng thái:</strong> {{ borrow.note }}</p>
            </div>

            <!-- Cột nút Cập nhật & Xóa -->
            <div class="col-md-3 d-flex align-items-center justify-content-center">
                <div class="btn-group">
                    <button class="btn btn-warning btn-sm" @click="openUpdateForm">
                        ✏️
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Form cập nhật thông tin mượn sách -->
    <div v-if="showUpdateForm" class="update-form-overlay">
        <div class="update-form">
            <h5>Cập nhật thông tin mượn sách</h5>
            <input v-model="updatedBorrow.bookname" placeholder="Tên sách" class="form-control mb-2" />
            <input v-model="updatedBorrow.borrowDate" type="date" class="form-control mb-2" />
            <input v-model="updatedBorrow.returnDate" type="date" class="form-control mb-2" />
            <select v-model="updatedBorrow.note" class="form-control mb-2">
                <option value="Đang mượn">Đang mượn</option>
                <option value="Đã trả">Đã trả</option>
            </select>
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
import borrowService from "@/services/borrow.service";

export default {
    props: {
        borrow: {
            type: Object,
            required: true
        }
    },
    setup(props, { emit }) {
        const router = useRouter();
        const showUpdateForm = ref(false);
        const updatedBorrow = ref({ ...props.borrow });

        const openUpdateForm = () => {
            updatedBorrow.value = { ...props.borrow };
            showUpdateForm.value = true;
        };

        const saveChanges = async () => {
            console.log("Dữ liệu gửi lên API:", updatedBorrow.value._id);
            try {
                await borrowService.updateBorrow(updatedBorrow.value._id, updatedBorrow.value);
                alert(`✅ Cập nhật thành công!`);
                emit("update-borrow", updatedBorrow.value);
                showUpdateForm.value = false;
                router.push("/").then(() => {
                    router.push("/admin/borrow-manage");
                });
            } catch (error) {
                console.error("🔴 Lỗi khi cập nhật thông tin mượn sách:", error);
                alert("❌ Cập nhật thất bại!");
            }
        };

        return { 
            showUpdateForm, 
            updatedBorrow, 
            openUpdateForm, 
            saveChanges, 
        };
    },
};
</script>

<style scoped>
.borrow-card {
    border-radius: 10px;
    overflow: hidden;
    transition: transform 0.3s ease, filter 0.3s ease;
    cursor: pointer;
    margin-bottom: 15px;
}

.borrow-card:hover {
    transform: scale(1.03);
    filter: brightness(1.05);
}

.returned {
    background-color: #d4edda;
    border: 1px solid #155724;
    color: #155724;
}

.btn-group {
    display: flex;
    gap: 5px;
}
</style>