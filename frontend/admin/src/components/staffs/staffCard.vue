<template>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css" rel="stylesheet">
    <div class="card staff-card shadow-sm">
        <div class="row g-0">
            <!-- Cột Chức vụ -->
            <div class="col-md-3 text-white d-flex align-items-center justify-content-center" :class="bgColor">
                <h5 class="text-center m-0">{{ staff.position }}</h5>
            </div>

            <!-- Cột Thông tin cá nhân -->
            <div class="col-md-7 p-3">
                <p class="card-text"><strong>Tên đăng nhập:</strong> {{ staff.username }}</p>
                <p class="card-text"><strong>Họ tên:</strong> {{ staff.fullname }}</p>
                <p class="card-text"><strong>ID:</strong> {{ staff._id }}</p>
                <p class="card-text"><strong>Số điện thoại:</strong> {{ staff.phone }}</p>
                <p class="card-text"><strong>Địa chỉ:</strong> {{ staff.address }}</p>
            </div>

            <!-- Cột nút Cập nhật & Xóa -->
            <div class="col-md-2 d-flex align-items-center justify-content-center">
                <div class="btn-group">
                    <button class="btn btn-warning btn-sm" @click="openUpdateForm">
                        ✏️
                    </button>
                    <button class="btn btn-danger btn-sm" @click="deleteStaff">
                        🗑️
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Form cập nhật thông tin -->
    <div v-if="showUpdateForm" class="update-form-overlay">
        <div class="update-form">
            <h5>Cập nhật thông tin</h5>
            <input v-model="updatedStaff.fullname" placeholder="Họ tên" class="form-control mb-2" />
            <input v-model="updatedStaff.phone" placeholder="Số điện thoại" class="form-control mb-2" />
            <input v-model="updatedStaff.address" placeholder="Địa chỉ" class="form-control mb-2" />
            <input v-model="updatedStaff.position" placeholder="Chức vụ" class="form-control mb-2" />
            <div class="mb-3">
                <div class="input-group">
                    <input 
                        :type="showPassword ? 'text' : 'password'" 
                        class="form-control" 
                        v-model="updatedStaff.password" 
                        placeholder="Nhập mật khẩu mới"
                    />
                    <button 
                        type="button" 
                        class="btn btn-outline-secondary" 
                        @click="togglePasswordVisibility"
                    >
                        <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                    </button>
                </div>
            </div>
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
import adminService from "@/services/admin.service";
import staffService from "@/services/staff.service";

export default {
    props: {
        staff: {
            type: Object,
            required: true
        }
    },
    setup(props, { emit }) {
        const router = useRouter();
        const showUpdateForm = ref(false);
        const updatedStaff = ref({ ...props.staff });
        const showPassword = ref(false); // Thêm dòng này

        const openUpdateForm = () => {
            updatedStaff.value = { ...props.staff };
            showUpdateForm.value = true;
        };

        const saveChanges = async () => {
            try {
                await staffService.updateStaff(updatedStaff.value._id, updatedStaff.value);
                alert(`✅ Cập nhật thành công!`);
                emit("update-staff", updatedStaff.value);
                showUpdateForm.value = false;
                router.push("/").then(() => {
                    router.push("/admin/staff-manage");
                });
            } catch (error) {
                console.error("🔴 Lỗi khi cập nhật nhân viên:", error);
                alert("❌ Cập nhật thất bại!");
            }
        };

        const deleteStaff = async () => {
            if (!confirm(`Bạn có chắc muốn xóa ${props.staff.fullname}?`)) return;
            try {
                await adminService.deleteStaff(props.staff._id);
                alert(`✅ Đã xóa ${props.staff.fullname}`);
                router.push("/").then(() => {
                    router.push("/admin/staff-manage");
                });
            } catch (error) {
                console.error("🔴 Lỗi khi xóa nhân viên:", error);
                alert("❌ Xóa nhân viên thất bại!");
            }
        };

        const togglePasswordVisibility = () => {
            showPassword.value = !showPassword.value;
        };

        return { 
            showUpdateForm, 
            updatedStaff, 
            openUpdateForm, 
            saveChanges, 
            deleteStaff, 
            showPassword, // Trả về biến này
            togglePasswordVisibility 
        };
    },
    computed: {
        bgColor() {
            switch (this.staff.position.toLowerCase()) {
                case "admin": return "bg-danger";
                case "quản lý": return "bg-warning";
                case "nhân viên": return "bg-success";
                default: return "bg-primary";
            }
        }
    }
};
</script>

<style scoped>
.staff-card {
    border-radius: 10px;
    overflow: hidden;
    transition: transform 0.3s ease, filter 0.3s ease;
    cursor: pointer;
    margin-bottom: 15px;
}

.staff-card:hover {
    transform: scale(1.03);
    filter: brightness(1.05);
}

.bg-danger, .bg-warning, .bg-success, .bg-primary {
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
}

.btn-group {
    display: flex;
    gap: 5px;
}
</style>
