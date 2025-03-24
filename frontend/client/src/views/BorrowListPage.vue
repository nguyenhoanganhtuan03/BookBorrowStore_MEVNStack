<template>
  <div>
    <!-- App Header -->
    <AppHeader />

    <!-- Main content -->
    <div class="container mt-4">
      <h2>Danh sách các đơn mượn</h2>

      <!-- Hiển thị danh sách các BorrowCard -->
      <div class="row">
        <div class="col-12 col-md-4" v-for="borrow in borrows" :key="borrow._id">
          <BorrowCard :borrow="borrow" />
        </div>
      </div>
    </div>

    <!-- App Footer -->
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
      this.borrows = response.data; // Lưu kết quả vào borrows
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
</style>
