<template>
    <div>
        <!-- Header -->
        <AppHeader />

        <!-- Nội dung trang đăng nhập -->
        <div class="d-flex justify-content-center align-items-center min-vh-75 py-4">
            <div class="login-card p-5 shadow-lg rounded">
                <h2 class="text-center text-primary mb-4">Đăng nhập</h2>

                <!-- Hiển thị thông báo lỗi nếu có -->
                <div v-if="errorMessage" class="alert alert-danger text-center">
                    {{ errorMessage }}
                </div>

                <form @submit.prevent="handleLogin">
                    <!-- Username -->
                    <div class="mb-3">
                        <label for="username" class="form-label">Tên người dùng</label>
                        <input v-model="username" type="text" id="username" class="form-control"
                            placeholder="Nhập username" required>
                    </div>

                    <!-- Password -->
                    <div class="mb-3">
                        <label for="password" class="form-label">Mật khẩu</label>
                        <input v-model="password" type="password" id="password" class="form-control"
                            placeholder="Nhập password" required>
                    </div>

                    <!-- Nút đăng nhập -->
                    <button type="submit" class="btn btn-primary w-100" :disabled="loading">
                        <span v-if="loading">Đang đăng nhập...</span>
                        <span v-else>Đăng nhập</span>
                    </button>
                </form>
            </div>
        </div>

        <!-- Footer -->
        <AppFooter />
    </div>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import AdminService from "@/services/admin.service.js";
import AppHeader from "@/components/common/AppHeader.vue";
import AppFooter from "@/components/common/AppFooter.vue";

export default {
    components: {
        AppHeader,
        AppFooter,
    },
    setup() {
        const username = ref("");
        const password = ref("");
        const errorMessage = ref("");
        const loading = ref(false);
        const router = useRouter();

        const handleLogin = async () => {
            errorMessage.value = "";
            loading.value = true;

            const response = await AdminService.login({
                username: username.value,
                password: password.value,
            });

            if (response.status === "success") {
                localStorage.setItem("adminToken", response.data.token); // Lưu token vào localStorage
                router.push("/admin-dashboard"); // Chuyển hướng đến trang quản trị
            } else {
                errorMessage.value = response.message; // Hiển thị lỗi
            }

            loading.value = false;
        };

        return { username, password, errorMessage, loading, handleLogin };
    },
};
</script>

<style scoped>
/* Giảm khoảng cách giữa Header và Footer */
.min-vh-75 {
    min-height: 75vh;
}

/* Tăng kích thước form */
.login-card {
    width: 650px;
    background: white;
}
</style>
