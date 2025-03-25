<template>
  <div>
    <AppHeader />
    <div class="container mt-5">
      <!-- Kiểm tra nếu borrows là một mảng và không có dữ liệu -->
      <div v-if="Array.isArray(borrows) && borrows.length === 0" class="text-center">
        <p>Không có đơn mượn nào.</p>
      </div>
      <div v-else>
        <h2 class="text-center">Danh sách các đơn mượn</h2>
        <div class="list-group">
          <div v-for="borrow in borrows" :key="borrow._id" class="list-group-item">
            <borrowCard :borrow="borrow" />
          </div>
        </div>
      </div>
    </div>
    <AppFooter />
  </div>
</template>

<script>
import AppHeader from "@/components/common/AppHeader.vue";
import AppFooter from "@/components/common/AppFooter.vue";
import BorrowCard from "@/components/borrows/borrowCard.vue";
import { useAuthStore } from "@/store/auth";
import BorrowService from "@/services/borrow.service";

export default {
  components: {
    AppHeader,
    AppFooter,
    BorrowCard
  },
  data() {
    return {
      borrows: [], // Danh sách các đơn mượn
    };
  },
  computed: {
    // Lấy userId từ authStore
    userId() {
      return useAuthStore().user._id;
    },
  },
  async created() {
    try {
      // Gọi API để lấy danh sách các đơn mượn của người dùng
      const response = await BorrowService.getBorrowsByUserId(this.userId);
      // Kiểm tra nếu phản hồi có dữ liệu trong borrows
      if (response.status === "success") {
        this.borrows = response.data.data.borrows; // Lưu kết quả vào borrows
        console.log("Frontend nhận: ", this.borrows);
      } else {
        console.log("Không có dữ liệu đơn mượn.");
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách đơn mượn: ", error);
      alert("Không thể lấy danh sách đơn mượn.");
    }
  },
};
</script>

<style scoped>
.container {
  margin-top: 20px;
}

.list-group-item {
  margin-bottom: 10px; /* Tạo khoảng cách giữa các phần tử trong list */
}
</style>
