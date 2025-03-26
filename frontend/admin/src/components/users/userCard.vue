<template>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css" rel="stylesheet">
    <div class="card user-card shadow-sm">
        <div class="row g-0">
            <!-- Cột Thông tin cá nhân -->
            <div class="col-md-9 p-3">
                <p class="card-text"><strong>Tên đăng nhập:</strong> {{ user.username }}</p>
                <p class="card-text"><strong>Họ tên:</strong> {{ user.fullname }}</p>
                <p class="card-text"><strong>Email:</strong> {{ user.email }}</p>
                <p class="card-text"><strong>Số điện thoại:</strong> {{ user.phone }}</p>
                <p class="card-text"><strong>Địa chỉ:</strong> {{ user.address }}</p>
                <p class="card-text"><strong>Giới tính:</strong> {{ user.gender }}</p>
                <p class="card-text"><strong>Ngày sinh:</strong> {{ user.dob }}</p>
            </div>

            <!-- Cột nút Cập nhật & Xóa -->
            <div class="col-md-3 d-flex align-items-center justify-content-center">
                <div class="btn-group">
                    <button class="btn btn-warning btn-sm" @click="openUpdateForm">
                        ✏️
                    </button>
                    <button class="btn btn-danger btn-sm" @click="deleteUser">
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
            <input v-model="updatedUser.fullname" placeholder="Họ tên" class="form-control mb-2" />
            <input v-model="updatedUser.phone" placeholder="Số điện thoại" class="form-control mb-2" />
            <input v-model="updatedUser.email" placeholder="Email" class="form-control mb-2" />
            <input v-model="updatedUser.address" placeholder="Địa chỉ" class="form-control mb-2" />
            <select v-model="updatedUser.gender" class="form-control mb-2">
                <option value="">Chọn giới tính</option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
            </select>
            <input v-model="updatedUser.dob" type="date" class="form-control mb-2" />
            <div class="mb-3">
                <div class="input-group">
                    <input 
                        :type="showPassword ? 'text' : 'password'" 
                        class="form-control" 
                        v-model="updatedUser.password" 
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
import userService from "@/services/user.service";

export default {
    props: {
        user: {
            type: Object,
            required: true
        }
    },
    setup(props, { emit }) {
        const router = useRouter();
        const showUpdateForm = ref(false);
        const updatedUser = ref({ ...props.user });
        const showPassword = ref(false);

        const openUpdateForm = () => {
            updatedUser.value = { ...props.user };
            showUpdateForm.value = true;
        };

        const saveChanges = async () => {
            try {
                await userService.updateUser(updatedUser.value._id, updatedUser.value);
                alert(`✅ Cập nhật thành công!`);
                emit("update-user", updatedUser.value);
                showUpdateForm.value = false;
                router.push("/").then(() => {
                    router.push("/admin/user-manage");
                });
            } catch (error) {
                console.error("🔴 Lỗi khi cập nhật người dùng:", error);
                alert("❌ Cập nhật thất bại!");
            }
        };

        const deleteUser = async () => {
            if (!confirm(`Bạn có chắc muốn xóa ${props.user.fullname}?`)) return;
            try {
                await userService.deleteUser(props.user._id);
                alert(`✅ Đã xóa ${props.user.fullname}`);
                router.push("/").then(() => {
                    router.push("/admin/user-manage");
                });
            } catch (error) {
                console.error("🔴 Lỗi khi xóa người dùng:", error);
                alert("❌ Xóa người dùng thất bại!");
            }
        };

        const togglePasswordVisibility = () => {
            showPassword.value = !showPassword.value;
        };

        return { 
            showUpdateForm, 
            updatedUser, 
            openUpdateForm, 
            saveChanges, 
            deleteUser, 
            showPassword, 
            togglePasswordVisibility 
        };
    },
};
</script>

<style scoped>
.user-card {
    border-radius: 10px;
    overflow: hidden;
    transition: transform 0.3s ease, filter 0.3s ease;
    cursor: pointer;
    margin-bottom: 15px;
}

.user-card:hover {
    transform: scale(1.03);
    filter: brightness(1.05);
}

.btn-group {
    display: flex;
    gap: 5px;
}
</style>
