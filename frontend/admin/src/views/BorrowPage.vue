<template>
  <div>
    <!-- Header -->
    <AppHeader />

    <!-- Main Content -->
    <div class="container mt-5">
      <!-- Chèn borrowForm component vào đây -->
      <borrowForm />
    </div>

    <!-- Footer -->
    <AppFooter />
  </div>
</template>

<script>
import AppHeader from "@/components/common/AppHeader.vue";
import AppFooter from "@/components/common/AppFooter.vue";
import borrowForm from "@/components/borrows/borrowForm.vue"; // Import borrowForm component

export default {
  components: {
    AppHeader,
    AppFooter,
    borrowForm // Thêm borrowForm vào component
  },
  data() {
    return {
      userId: '',
      bookId: '',
      borrowDate: '',
      returnDate: '',
      note: '',
      message: ''
    };
  },
  methods: {
    async handleSubmit() {
      // Xử lý gửi form mượn sách (có thể gửi yêu cầu API ở đây)
      // Đây là ví dụ đơn giản, bạn có thể thêm logic API vào đây.
      
      if (this.userId && this.bookId && this.borrowDate && this.returnDate) {
        this.message = 'Borrow request submitted successfully';
      } else {
        this.message = 'Please fill in all required fields';
      }
    }
  }
};
</script>

<style scoped>
/* Nếu bạn muốn thêm style tùy chỉnh cho trang này */
</style>
