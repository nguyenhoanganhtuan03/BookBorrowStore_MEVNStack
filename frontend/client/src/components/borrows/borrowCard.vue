<template>
  <div class="card mb-3">
    <div class="card-body">
      <h5 class="card-title">{{ borrow.bookname }}</h5>
      <p class="card-text">Ngày mượn: {{ formatDate(borrow.borrowDate) }}</p>
      <p class="card-text">Ngày trả: {{ formatDate(borrow.returnDate) }}</p>
      <p class="card-text">
        Trạng thái: 
        <span :class="borrow.note === 'Đang mượn' ? 'text-success' : 'text-danger'">
          {{ borrow.note }}
        </span>
      </p>
      <button class="btn btn-primary" @click="viewDetails(borrow._id)">Xem chi tiết</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    borrow: Object, // Nhận đối tượng borrow từ trang danh sách
  },
  methods: {
    // Hàm định dạng ngày
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString(); // Định dạng ngày tháng theo kiểu địa phương
    },

    // Hàm để xem chi tiết đơn mượn
    viewDetails(borrowId) {
      this.$router.push({ name: 'borrowDetails', params: { borrowId } });
    },
  },
};
</script>

<style scoped>
.card {
  border: 1px solid #ddd;
}
.card-body {
  background-color: #f9f9f9;
}
</style>
