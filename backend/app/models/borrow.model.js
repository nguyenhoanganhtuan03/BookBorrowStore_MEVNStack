class Borrow {
    constructor(userId, bookId, borrowDate, returnDate, note=null) {
        this.userId = userId;
        this.bookId = bookId;
        this.borrowDate = borrowDate;
        this.returnDate = returnDate;
        this.note = note;
    }
}

module.exports = Borrow;