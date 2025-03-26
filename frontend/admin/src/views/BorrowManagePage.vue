<template>
    <div>
        <!-- Header -->
        <AppHeader />

        <div class="container mt-4">
            <h2 class="text-center mb-4">Quản lý mượn sách</h2>

            <!-- Nút thêm mượn sách và quay lại -->
            <div class="d-flex justify-content-between mb-3">
                <button class="btn btn-secondary" @click="goBack">
                    🔙 Quay lại
                </button>
                <button class="btn btn-primary" @click="showAddBorrowModal = true">
                    ➕ Thêm Mượn Sách
                </button>
            </div>

            <!-- Danh sách mượn sách -->
            <div v-if="borrowList.length > 0" class="list-group">
                <BorrowCardManage v-for="borrow in borrowList" 
                            :key="borrow.bookId" 
                            :borrow="borrow" 
                            @deleted="removeBorrowFromList"/>
            </div>

            <!-- Hiển thị nếu không có dữ liệu -->
            <div v-else class="text-center">
                <p class="text-muted">Không có dữ liệu mượn sách.</p>
            </div>
        </div>

        <!-- Footer -->
        <AppFooter />

        <!-- Modal thêm mượn sách -->
        <div v-if="showAddBorrowModal" class="modal-overlay">
            <div class="modal-content">
                <h5>Thêm Mượn Sách</h5>

                <input type="text" v-model="newBorrow.username" placeholder="Tên người mượn" class="form-control mb-2" required />
                <input type="text" v-model="newBorrow.bookname" placeholder="Tên sách" class="form-control mb-2" required />
                <input type="date" v-model="newBorrow.borrowDate" class="form-control mb-2" required />
                <input type="date" v-model="newBorrow.returnDate" class="form-control mb-2" required />
                <select v-model="newBorrow.note" class="form-control mb-2">
                    <option value="Đang mượn">Đang mượn</option>
                    <option value="Đã trả">Đã trả</option>
                </select>

                <div class="d-flex justify-content-end mt-3">
                    <button class="btn btn-secondary me-2" @click="cancelAndCloseModal">Hủy</button>
                    <button class="btn btn-success" @click="addBorrow">Thêm</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import BorrowService from "@/services/borrow.service";
import AppHeader from "@/components/common/AppHeader.vue";
import AppFooter from "@/components/common/AppFooter.vue";
import BorrowCardManage from "@/components/borrows/borrowCardManage.vue";

export default {
    components: {
        AppHeader,
        AppFooter,
        BorrowCardManage,
    },
    setup() {
        const router = useRouter();
        const borrowList = ref([]);
        const showAddBorrowModal = ref(false);
        const newBorrow = ref({
            username: "",
            bookname: "",
            borrowDate: "",
            returnDate: "",
            note: "Đang mượn",
        });

        const goBack = () => {
            router.push("/admin");
        };

        const fetchBorrowList = async () => {
            try {
                const response = await BorrowService.getAllBorrows();
                borrowList.value = response.data.borrows || [];
                console.log(borrowList.value)
            } catch (error) {
                console.error("🔴 Lỗi khi tải danh sách mượn sách:", error);
            }
        };

        const addBorrow = async () => {
            try {
                if (!newBorrow.value.username || !newBorrow.value.bookname || 
                    !newBorrow.value.borrowDate || !newBorrow.value.returnDate) {
                    alert("❌ Vui lòng điền đầy đủ thông tin!");
                    return;
                }

                await BorrowService.createBorrow(newBorrow.value);

                // Reset form
                newBorrow.value = { username: "", bookname: "", borrowDate: "", returnDate: "", note: "Đang mượn" };

                // Tải lại danh sách
                await fetchBorrowList();

                // Đóng modal
                showAddBorrowModal.value = false;

                alert("✅ Thêm mượn sách thành công!");
            } catch (error) {
                console.error("🔴 Lỗi khi thêm mượn sách:", error);
                alert("❌ Không thể thêm mượn sách!");
            }
        };

        const removeBorrowFromList = (bookId) => {
            borrowList.value = borrowList.value.filter(borrow => borrow.bookId !== bookId);
        };

        const cancelAndCloseModal = () => {
            showAddBorrowModal.value = false;
        };

        onMounted(fetchBorrowList);

        return { borrowList, showAddBorrowModal, newBorrow, addBorrow, removeBorrowFromList, cancelAndCloseModal, goBack };
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
