class Book {
    constructor(bookname, author, price, quantity, publishYear = null, publisherCode = null, category = null, image = null) {
        this.bookname = bookname;
        this.author = author;
        this.price = price;
        this.quantity = quantity;
        this.publishYear = publishYear;
        this.publisherCode = publisherCode;
        this.category = category;
        this.image = image;
    }
}

module.exports = Book;
