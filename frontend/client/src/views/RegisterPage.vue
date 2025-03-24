<template>
    <div>
        <!-- Header -->
        <AppHeader />

        <!-- Nội dung trang đăng ký -->
        <div class="d-flex justify-content-center align-items-center min-vh-75 py-4">
            <div class="register-card p-5 shadow-lg rounded">
                <h2 class="text-center text-primary mb-4">Đăng ký</h2>

                <!-- Hiển thị thông báo lỗi nếu có -->
                <div v-if="errorMessage" class="alert alert-danger text-center">
                    {{ errorMessage }}
                </div>

                <form @submit.prevent="handleRegister">
                    <!-- Username -->
                    <div class="mb-3">
                        <label for="username" class="form-label">Tên người dùng</label>
                        <input v-model="user.username" type="text" id="username" class="form-control"
                            placeholder="Nhập username" required>
                    </div>

                    <!-- Email -->
                    <div class="mb-3">
                        <label for="email" class="form-label">Email</label>
                        <input v-model="user.email" type="email" id="email" class="form-control"
                            placeholder="Nhập email" required>
                    </div>

                    <!-- Password -->
                    <div class="mb-3">
                        <label for="password" class="form-label">Mật khẩu</label>
                        <input v-model="user.password" type="password" id="password" class="form-control"
                            placeholder="Nhập mật khẩu" required>
                    </div>

                    <!-- Re-enter Password -->
                    <div class="mb-3">
                        <label for="repassword" class="form-label">Nhập lại mật khẩu</label>
                        <input v-model="user.repassword" type="password" id="repassword" class="form-control"
                            placeholder="Nhập lại mật khẩu" required>
                        <div v-if="passwordError" class="alert alert-danger mt-2">Mật khẩu không khớp!</div>
                    </div>

                    <!-- Nút đăng ký -->
                    <button type="submit" class="btn btn-primary w-100" :disabled="loading || passwordError">
                        <span v-if="loading">Đang đăng ký...</span>
                        <span v-else>Đăng ký</span>
                    </button>
                </form>
            </div>
        </div>

        <!-- Footer -->
        <AppFooter />
    </div>
</template>

<script>
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import UserService from "@/services/user.service.js";
import AppHeader from "@/components/common/AppHeader.vue";
import AppFooter from "@/components/common/AppFooter.vue";

export default {
    components: {
        AppHeader,
        AppFooter,
    },
    setup() {
        const user = ref({
            username: "",
            email: "",
            password: "",
            repassword: "",
        });
        const errorMessage = ref("");
        const passwordError = ref(false);
        const loading = ref(false);
        const router = useRouter();

        watch(() => user.value.repassword, () => {
            passwordError.value = user.value.password !== user.value.repassword;
        });

        const handleRegister = async () => {
            if (passwordError.value) return;
            
            errorMessage.value = "";
            loading.value = true;

            const response = await UserService.register({
                username: user.value.username,
                email: user.value.email,
                password: user.value.password,
            });

            if (response.status === "success") {
                alert("Đăng ký thành công!");
                router.push("/login"); // Chuyển hướng đến trang đăng nhập
            } else {
                errorMessage.value = response.message;
            }

            loading.value = false;
        };

        return { user, errorMessage, passwordError, loading, handleRegister };
    },
};
</script>

<style scoped>
.min-vh-75 {
    min-height: 75vh;
}

.register-card {
    width: 450px;
    background: white;
}
</style>