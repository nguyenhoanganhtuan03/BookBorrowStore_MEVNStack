<template>
  <div class="card mb-3">
    <div class="card-body">
      <div class="d-flex justify-content-between align-items-center">
        <h5 class="card-title">{{ borrow.bookname }}</h5>
        <div>
          <p class="card-text mb-1">Ngày mượn: {{ formatDate(borrow.borrowDate) }} | Ngày trả: {{ formatDate(borrow.returnDate) }}</p>
          <p class="card-text">
            Trạng thái: 
            <span :class="borrow.note === 'Đang mượn' ? 'text-success' : 'text-danger'">
              {{ borrow.note }}
            </span>
          </p>
        </div>
      </div>
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
