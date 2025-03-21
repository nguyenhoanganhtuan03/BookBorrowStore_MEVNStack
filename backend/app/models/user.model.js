class User {
    constructor(username, password, fullname = null, phone = null, email = null, address = null, gender = null, dob = null) {
        this.username = username;
        this.password = password;
        this.fullname = fullname;  // Họ tên
        this.phone = phone;        // Số điện thoại
        this.email = email;        // Email
        this.address = address;    // Địa chỉ
        this.gender = gender;      // Giới tính
        this.dob = dob;            // Ngày sinh (Date format)
    }
}

module.exports = User;
