const db = require.main.require('./models/config');

const getAll = (callback) => {
    const sql = "SELECT * FROM books";
    db.executeQuery(sql, null, function(result) {
        callback(result);
    });
};

const searchBy = (searchBy, word, callback) => {
    const sql = "SELECT * FROM books WHERE "+searchBy+" = ?";
    db.executeQuery(sql, [word], function(result) {
        callback(result);
    });
};

const createBook = (book, callback) => {
    const date = new Date();
    const sql = "INSERT INTO books VALUES(null, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    db.executeQuery(sql, [0, book.title, book.author, book.publisher, book.isbn, date], function(result) {
        callback(result);
    });
};

const getBook = (id, callback) => {
    const sql = "SELECT * FROM books WHERE book_id=?";
    db.executeQuery(sql, [id], function(result) {
        callback(result[0]);
    });
};


const updateBook = (id, book, callback) => {
    const sql = "UPDATE books SET title = ?, author = ?, publisher = ?, isbn = ? WHERE book_id = ?";
    db.executeQuery(sql, [ book.title, book.author, book.publisher, book.isbn, id], function(result) {
        callback(result);
    });
};

const deleteBook = (id, callback) => {
    const sql = "DELETE FROM books WHERE book_id = ?";
    db.executeQuery(sql, [id], function(result) {
        callback(result);
    });
};

const issueBook = (book_id, customer_id, callback) => {
    const date = new Date();
    const sql = "UPDATE books SET user_id = ?, date_issued = ? WHERE book_id = ?";
    db.executeQuery(sql, [student_id, date, book_id], function(result) {
        callback(result);
    });
};

const unissueBook = (book_id, callback) => {
    const sql = "UPDATE books SET user_id = '', date_issued = '' WHERE book_id = ?";
    db.executeQuery(sql, [book_id], function(result) {
        callback(result);
    });
};

const getIssuedBooks = (id, callback) => {
    const sql = "SELECT * FROM books WHERE NOT user_id = ''";
    db.executeQuery(sql, null, function(result) {
        callback(result);
    });
};

const getUnborrowedBooks = (callback) => {
    const sql = "SELECT * FROM books WHERE (user_id = 'NULL') OR (user_id = 0)";
    db.executeQuery(sql, null, function(result) {
        callback(result);
    });
};

const bookRequest = (customer_id, book, callback) => {
    const date = new Date();
    const sql = "INSERT INTO books_request VALUES(null, ?, ?, ?, ?, ?, ?, ?)";
    db.executeQuery(sql, [customer_id, book.title, book.author, book.isbn, date], function(result) {
        callback(result);
    });
};

const customerSearch = (searchBy, word, callback) => {
    const sql = "(SELECT * FROM books WHERE "+searchBy+" = ?) AND ((user_id = '') OR (user_id = 0))";
    db.executeQuery(sql, [word], function(result) {
        callback(result);
    });
};


const getRequestedBooks = (callback) => {
    const sql = "SELECT * FROM books_request";
    db.executeQuery(sql, null, function(result) {
        callback(result);
    });
};


const bookRequestSearch = (searchBy, word, callback) => {
    const sql = "SELECT * FROM books_request WHERE "+searchBy+" = ?";
    db.executeQuery(sql, [word], function(result) {
        callback(result);
    });
};


const setIssueDate = (book_id, customer_id, callback) => {
    const date = new Date();
    const sql = "INSERT INTO issue_date VALUES(null, ?, ?, ?)";
    db.executeQuery(sql, [book_id, customer_id, date], function(result) {
        callback(result);
    });
};

const booksIssuedByCustomer = (customer_id, callback) => {
    const sql = "SELECT * FROM books WHERE user_id = ?";
    db.executeQuery(sql, [customer_id], function(result) {
        callback(result);
    });
};

const getAllBorrowedBooks = (callback) => {
    const sql = "SELECT * FROM issue_date";
    db.executeQuery(sql, null, function(result) {
        callback(result);
    });
};

const totalBorrowed30 = (callback) => {
    const result = new Date();
    const newDate = result.setDate(result.getDate() + 30);
    const sql = "SELECT books.*, issue_date.book_id FROM issue_date INNER JOIN books ON issue_date.book_id=books.book_id WHERE (date BETWEEN ? AND ?)";
    db.executeQuery(sql, [newDate, result], function(result) {
        callback(result);
    });
};

const mostBorrowedBook = (callback) => {
    const sql = "SELECT books.*, issue_date.book_id, COUNT(*) AS magnitude FROM issue_date INNER JOIN books ON issue_date.book_id=books.book_id GROUP BY books.isbn ORDER BY magnitude DESC LIMIT 1";
    db.executeQuery(sql, null, function(result) {
        callback(result[0]);
    });
};


const mostRequestedBook = (callback) => {
    const sql = "SELECT *, COUNT(*) AS magnitude FROM books_request GROUP BY isbn ORDER BY magnitude DESC LIMIT 1";
    db.executeQuery(sql, null, function(result) {
        callback(result[0]);
    });
};



module.exports = {
    getAll,
    searchBy,
    createBook,
    getBook,
    updateBook,
    deleteBook,
    issueBook,
    unissueBook,
    getIssuedBooks,
    getUnborrowedBooks,
    bookRequest,
    customerSearch,
    getRequestedBooks,
    bookRequestSearch,
    setIssueDate,
    booksIssuedByCustomer,
    getAllBorrowedBooks,
    totalBorrowed30,
    mostRequestedBook,
    mostBorrowedBook
};