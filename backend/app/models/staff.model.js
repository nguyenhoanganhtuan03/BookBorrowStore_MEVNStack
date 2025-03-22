class Staff {
    constructor(username, password, fullname = null, phone = null, address = null, position) {
        this.username = username;
        this.password = password;
        this.fullname = fullname;
        this.position = position;
        this.phone = phone;
        this.address = address;
    }
}

module.exports = Staff;
