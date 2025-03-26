<template>
    <div>
        <!-- Header -->
        <AppHeader />

        <div class="container mt-4">
            <h2 class="text-center mb-4">Quản lý người dùng</h2>

            <!-- Nút thêm người dùng và quay lại -->
            <div class="d-flex justify-content-between mb-3">
                <button class="btn btn-secondary" @click="goBack">
                    🔙 Quay lại
                </button>
                <button class="btn btn-primary" @click="showAddUserModal = true">
                    ➕ Thêm Người Dùng
                </button>
            </div>

            <!-- Danh sách người dùng -->
            <div v-if="userList.length > 0" class="list-group">
                <UserCard v-for="user in userList" 
                          :key="user.userId" 
                          :user="user" 
                          @deleted="removeUserFromList"/>
            </div>

            <!-- Hiển thị nếu không có người dùng -->
            <div v-else class="text-center">
                <p class="text-muted">Không có người dùng nào.</p>
            </div>
        </div>

        <!-- Footer -->
        <AppFooter />

        <!-- Modal thêm người dùng -->
        <div v-if="showAddUserModal" class="modal-overlay">
            <div class="modal-content">
                <h5>Thêm Người Dùng</h5>

                <input type="text" v-model="newUser.username" placeholder="Tên đăng nhập" class="form-control mb-2" required />
                <input type="password" v-model="newUser.password" placeholder="Mật khẩu" class="form-control mb-2" required />
                <input type="text" v-model="newUser.fullname" placeholder="Họ và Tên" class="form-control mb-2" required />
                <select v-model="newUser.role" class="form-control mb-2">
                    <option value="">Chọn vai trò</option>
                    <option value="Quản trị viên">Quản trị viên</option>
                    <option value="Người dùng">Người dùng</option>
                    <option value="Khác">Khác</option>
                </select>
                <input type="text" v-model="newUser.phone" placeholder="Số điện thoại" class="form-control mb-2" required />
                <input type="text" v-model="newUser.address" placeholder="Địa chỉ" class="form-control mb-2" required />

                <div class="d-flex justify-content-end mt-3">
                    <button class="btn btn-secondary me-2" @click="cancelAndCloseModal">Hủy</button>
                    <button class="btn btn-success" @click="addUser">Thêm</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import UserService from "@/services/user.service";
import adminService from "@/services/admin.service";
import AppHeader from "@/components/common/AppHeader.vue";
import AppFooter from "@/components/common/AppFooter.vue";
import UserCard from "@/components/users/userCard.vue";

export default {
    components: {
        AppHeader,
        AppFooter,
        UserCard,
    },
    setup() {
        const router = useRouter();
        const userList = ref([]);
        const showAddUserModal = ref(false);
        const newUser = ref({
            username: "",
            password: "",
            fullname: "",
            role: "",
            phone: "",
            address: "",
        });

        const goBack = () => {
            router.push("/admin");
        };

        const fetchUserList = async () => {
            try {
                const response = await UserService.getAllUsers();
                userList.value = response.data || [];
            } catch (error) {
                console.error("🔴 Lỗi khi tải danh sách người dùng:", error);
            }
        };

        const addUser = async () => {
            try {
                if (!newUser.value.username || !newUser.value.password || !newUser.value.fullname || 
                    !newUser.value.role || !newUser.value.phone) {
                    alert("❌ Vui lòng điền đầy đủ thông tin!");
                    return;
                }

                await adminService.addUser(newUser.value);

                // Reset form
                newUser.value = { username: "", password: "", fullname: "", role: "", phone: "", address: "" };

                // Tải lại danh sách người dùng từ server
                await fetchUserList();

                // Đóng modal
                showAddUserModal.value = false;

                alert("✅ Người dùng đã được thêm!");
            } catch (error) {
                console.error("🔴 Lỗi khi thêm người dùng:", error);
                alert("❌ Không thể thêm người dùng!");
            }
        };

        const removeUserFromList = (userId) => {
            userList.value = userList.value.filter(user => user.userId !== userId);
        };

        const cancelAndCloseModal = () => {
            showAddUserModal.value = false; 
        };

        onMounted(fetchUserList);

        return { userList, showAddUserModal, newUser, addUser, removeUserFromList, cancelAndCloseModal, goBack };
    },
};
</script>

<style scoped>
.list-group {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal-content {
    background: white;
    padding: 20px;
    border-radius: 8px;
    width: 400px;
}
</style>