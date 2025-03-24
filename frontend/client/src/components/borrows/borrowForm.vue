<template>
  <div class="borrow-form">
    <h2>Đăng ký mượn sách</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="bookName">Tên sách:</label>
        <input 
          type="text" 
          id="bookName" 
          v-model="formData.bookname"  
          required 
          disabled
        />
        
        <label for="bookId">Mã sách:</label>
        <input 
          type="text" 
          id="bookId" 
          v-model="formData.bookId"  
          required 
          disabled
        />
      </div>

      <div class="form-group">
        <label for="borrowerName">Tên người mượn:</label>
        <input 
          type="text" 
          id="borrowerName" 
          v-model="formData.username"  
          required 
          disabled
        />
        
        <label for="borrowerId">Mã người mượn:</label>
        <input 
          type="text" 
          id="borrowerId" 
          v-model="formData.userId"   
          required 
          disabled
        />
      </div>

      <div class="form-group">
        <label for="borrowDate">Ngày mượn:</label>
        <input 
          type="date" 
          id="borrowDate" 
          v-model="formData.borrowDate" 
          required 
        />
      </div>

      <div class="form-group">
        <label for="returnDate">Ngày trả:</label>
        <input 
          type="date" 
          id="returnDate" 
          v-model="formData.returnDate" 
          required 
        />
      </div>

      <div class="form-group">
        <label for="note">Ghi chú:</label>
        <select 
          id="note" 
          v-model="formData.note" 
          required
        >
          <option value="Đang mượn">Đang mượn</option>
          <option value="Đã trả">Đã trả</option>
        </select>
      </div>

      <button type="submit">Đăng ký mượn</button>
    </form>
  </div>
</template>

<script>
import { useAuthStore } from "@/store/auth";
import BorrowService from "@/services/borrow.service";
import BookService from "@/services/book.service";

export default {
  data() {
    return {
        formData: {
            userId: "",       // ID người mượn
            username: "",      // Tên người mượn
            bookId: "",        // ID sách
            bookname: "",      // Tên sách
            borrowDate: "",    // Ngày mượn
            returnDate: "",    // Ngày trả
            note: "Đang mượn", // Mặc định là "Đang mượn"
        },
    };
  },
  computed: {
    // Lấy bookId từ tham số URL
    bookId() {
      return this.$route.params.bookId;
    },
    // Lấy thông tin người dùng từ authStore
    user() {
      return useAuthStore().user;
    },
  },
  async created() {
    if (this.bookId) {
      try {
        // Gọi API để lấy thông tin sách (bookname) từ bookId
        const response = await BookService.getBookById(this.bookId);
        this.formData.bookname = response.data.bookname; // Điền tên sách vào form
        this.formData.bookId = this.bookId; // Điền bookId vào form
      } catch (error) {
        console.error("Lỗi khi lấy thông tin sách: ", error);
        alert("Không thể lấy thông tin sách.");
      }
    }

    if (this.user) {
      // Điền thông tin người mượn từ authStore
      this.formData.userId = this.user._id; // Lấy userId từ authStore
      this.formData.username = this.user.username; // Lấy username từ authStore
    }
  },
  methods: {
    async handleSubmit() {
        try {
            const response = await BorrowService.createBorrow(this.formData);
            console.log("Form Data: ", this.formData);
            if (response.status === "success") {
                alert(response.message);
                this.resetForm();
            } else {
                alert(response.message);
            }
        } catch (err) {
            if (err.response) {
                console.error("Lỗi từ API: ", err.response.data);
                alert(`Có lỗi xảy ra: ${err.response.data.message || "Không xác định"}`);
            } else {
                alert("Có lỗi xảy ra khi tạo yêu cầu mượn sách.");
            }
        }
    },

    resetForm() {
      this.formData = {
            userId: "",       
            username: "",      
            bookId: "",       
            bookname: "",     
            borrowDate: "",    
            returnDate: "",    
            note: "Đang mượn", // Mặc định là "Đang mượn"
      };
    },
  },
};
</script>

<style scoped>
.borrow-form {
  max-width: 700px;
  margin: 0 auto;
  padding: 30px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
}

input[type="text"],
input[type="date"],
select {
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  width: 100%;
  padding: 12px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

button:hover {
  background-color: #45a049;
}
</style>
