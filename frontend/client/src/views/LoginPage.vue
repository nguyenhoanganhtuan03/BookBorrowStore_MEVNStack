<template>
    <div>
        <!-- Header -->
        <AppHeader />

        <!-- Nội dung trang đăng nhập -->
        <div class="d-flex justify-content-center align-items-center min-vh-75 py-4">
            <div class="login-card p-5 shadow-lg rounded">
                <h2 class="text-center text-primary mb-4">Đăng nhập</h2>

                <!-- Hiển thị thông báo -->
                <div v-if="errorMessage" class="alert alert-danger text-center">
                    {{ errorMessage }}
                </div>
                <div v-if="isLoggedIn" class="alert alert-success text-center">
                    Đăng nhập thành công!
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
import { useRouter } from "vue-router"; // ✅ Import router đúng cách
import userService from "@/services/user.service"; // ✅ Kiểm tra export
import { useAuthStore } from "@/store/auth"; // ✅ Kiểm tra Pinia store
import AppHeader from "@/components/common/AppHeader.vue";
import AppFooter from "@/components/common/AppFooter.vue";

export default {
    components: {
        AppHeader,
        AppFooter,
    },
    setup() {
        const authStore = useAuthStore(); // ✅ Pinia store
        const router = useRouter(); // ✅ Khai báo router
        const username = ref(""); // Dữ liệu username từ input
        const password = ref(""); // Dữ liệu password từ input
        const errorMessage = ref(""); // Lỗi đăng nhập nếu có
        const loading = ref(false); // Biến trạng thái loading khi đang đăng nhập

        const handleLogin = async () => {
            errorMessage.value = ""; // Reset lỗi trước khi gửi yêu cầu
            loading.value = true; // Bật trạng thái loading khi gửi yêu cầu đăng nhập

            console.log("🔹 Sending login request:", { username: username.value, password: password.value });

            try {
                const response = await userService.login({ 
                    username: username.value, 
                    password: password.value 
                });

                console.log("🔹 API Response:", response);

                if (response.status === "success") {
                    authStore.login(response.user); 
                    alert("🎉 Đăng nhập thành công!");
                    router.push("/"); 
                } else {
                    errorMessage.value = response.message; 
                }
            } catch (error) {
                // Nếu có lỗi trong quá trình đăng nhập
                console.error("🔴 Login error:", error);
                errorMessage.value = "Lỗi đăng nhập, vui lòng thử lại!"; // Hiển thị thông báo lỗi
            }

            loading.value = false; // Tắt trạng thái loading sau khi hoàn tất
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
    width: 450px;
    background: white;
}
</style>
