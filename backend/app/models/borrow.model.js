class Borrow {
    constructor(userId, username, bookId, bookname, borrowDate, returnDate, note=null) {
        this.userId = userId;
        this.username = username;
        this.bookId = bookId;
        this.bookname = bookname;
        this.borrowDate = borrowDate;
        this.returnDate = returnDate;
        this.note = note;
    }
}

module.exports = Borrow;