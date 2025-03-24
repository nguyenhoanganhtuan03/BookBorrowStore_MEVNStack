<template>
  <div class="book-detail">
    <div class="book-detail-container">
      <!-- Phần hiển thị ảnh sách -->
      <div class="book-image">
        <img :src="book.image" alt="Book Image" v-if="book.image" />
        <p v-else>No image available</p>
      </div>

      <!-- Phần hiển thị thông tin chi tiết sách -->
      <div class="book-info">
        <h2>{{ book.bookname || "No name available" }}</h2>
        <p><strong>Author:</strong> {{ book.author || "Not available" }}</p>
        <p><strong>Price:</strong> {{ formatPrice(book.price) }}</p>
        <p><strong>Quantity:</strong> {{ book.quantity || "Not available" }}</p>
        <p><strong>Published Year:</strong> {{ book.publishYear || "Not available" }}</p>
        <p><strong>Publisher Code:</strong> {{ book.publisherCode || "Not available" }}</p>
        <p><strong>Category:</strong> {{ book.category || "Not available" }}</p>
      </div>
    </div>
    <div class="actions">
      <button @click="editBook">Edit Book</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    book: Object, // Nhận dữ liệu từ BookPage
  },
  methods: {
    formatPrice(price) {
      return price ? new Intl.NumberFormat().format(price) + " VND" : "Chưa có giá";
    },
    editBook() {
      // Logic để chỉnh sửa sách
      this.$router.push(`/edit-book/${this.book.id}`);
    }
  }
};
</script>

<style scoped>
.book-detail {
  display: flex;
  justify-content: space-between;
  padding: 20px;
}

.book-detail-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
}

.book-image {
  width: 40%;
  text-align: center;
}

.book-image img {
  max-width: 100%;
  height: auto;
}

.book-info {
  width: 55%;
  padding-left: 20px;
}

.book-info h2 {
  margin-bottom: 10px;
}

.book-info p {
  margin: 5px 0;
}

.actions {
  margin-top: 20px;
  text-align: center;
}

button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
</style>
