<template>
    <div>
        <!-- Header -->
        <AppHeader />

        <div class="container mt-4">
            <h2 class="text-center mb-4">Quản lý nhân viên</h2>

        <!-- Nút thêm nhân viên và quay lại -->
        <div class="d-flex justify-content-between mb-3">
            <button class="btn btn-secondary" @click="goBack">
                🔙 Quay lại
            </button>
            <button class="btn btn-primary" @click="showAddStaffModal = true">
                ➕ Thêm Nhân Viên
            </button>
        </div>

            <!-- Danh sách nhân viên -->
            <div v-if="staffList.length > 0" class="list-group">
                <StaffCard v-for="staff in staffList" 
                           :key="staff.staffId" 
                           :staff="staff" 
                           @deleted="removeStaffFromList"/>
            </div>

            <!-- Hiển thị nếu không có nhân viên -->
            <div v-else class="text-center">
                <p class="text-muted">Không có nhân viên nào.</p>
            </div>
        </div>

        <!-- Footer -->
        <AppFooter />

        <!-- Modal thêm nhân viên -->
        <div v-if="showAddStaffModal" class="modal-overlay">
            <div class="modal-content">
                <h5>Thêm Nhân Viên</h5>

                <input type="text" v-model="newStaff.username" placeholder="Tên đăng nhập" class="form-control mb-2" required />
                <input type="password" v-model="newStaff.password" placeholder="Mật khẩu" class="form-control mb-2" required />
                <input type="text" v-model="newStaff.fullname" placeholder="Họ và Tên" class="form-control mb-2" required />
                <select v-model="newStaff.position" class="form-control mb-2">
                    <option value="">Chọn chức vụ</option>
                    <option value="Quản lý">Quản lý</option>
                    <option value="Nhân viên">Nhân viên</option>
                    <option value="Khác">Khác</option>
                </select>
                <input type="text" v-model="newStaff.phone" placeholder="Số điện thoại" class="form-control mb-2" required />
                <input type="text" v-model="newStaff.address" placeholder="Địa chỉ" class="form-control mb-2" required />

                <div class="d-flex justify-content-end mt-3">
                    <button class="btn btn-secondary me-2" @click="cancelAndCloseModal">Hủy</button>
                    <button class="btn btn-success" @click="addStaff">Thêm</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router"; // Import Vue Router
import StaffService from "@/services/staff.service";
import adminService from "@/services/admin.service";
import AppHeader from "@/components/common/AppHeader.vue";
import AppFooter from "@/components/common/AppFooter.vue";
import StaffCard from "@/components/staffs/staffCard.vue";

export default {
    components: {
        AppHeader,
        AppFooter,
        StaffCard,
    },
    setup() {
        const router = useRouter();
        const staffList = ref([]);
        const showAddStaffModal = ref(false);
        const newStaff = ref({
            username: "",
            password: "",
            fullname: "",
            position: "",
            phone: "",
            address: "",
        });

        const goBack = () => {
            router.push("/admin");
        };

        const fetchStaffList = async () => {
            try {
                const response = await StaffService.getAllStaffs();
                staffList.value = response.users || [];
            } catch (error) {
                console.error("🔴 Lỗi khi tải danh sách nhân viên:", error);
            }
        };

        const addStaff = async () => {
            try {
                if (!newStaff.value.username || !newStaff.value.password || !newStaff.value.fullname || 
                    !newStaff.value.position || !newStaff.value.phone) {
                    alert("❌ Vui lòng điền đầy đủ thông tin!");
                    return;
                }

                await adminService.addStaff(newStaff.value);

                // Reset form
                newStaff.value = { username: "", password: "", fullname: "", position: "", phone: "", address: "" };

                // Tải lại danh sách nhân viên từ server
                await fetchStaffList();

                // Đóng modal
                showAddStaffModal.value = false;

                alert("✅ Nhân viên đã được thêm!");
            } catch (error) {
                console.error("🔴 Lỗi khi thêm nhân viên:", error);
                alert("❌ Không thể thêm nhân viên!");
            }
        };

        const removeStaffFromList = (staffId) => {
            staffList.value = staffList.value.filter(staff => staff.staffId !== staffId);
        };

        const cancelAndCloseModal = () => {
            showAddStaffModal.value = false; 
        };

        onMounted(fetchStaffList);

        return { staffList, showAddStaffModal, newStaff, addStaff, removeStaffFromList, cancelAndCloseModal, goBack };
    },
};
</script>

<style scoped>
/* Khoảng cách giữa các card */
.list-group {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

/* Modal Overlay */
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

/* Nội dung Modal */
.modal-content {
    background: white;
    padding: 20px;
    border-radius: 8px;
    width: 400px;
}
</style>
