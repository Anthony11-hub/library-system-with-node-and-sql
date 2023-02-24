const db = require.main.require('./models/config');

const validateUser = (email, password, callback) => {
    const sql = "SELECT * FROM `users` WHERE email = ? AND password = ?";
    db.executeQuery(sql, [email, password], function(result) {
        callback(result[0]);
    });
}

const createUser = (user, callback) => {
    const sql = "INSERT INTO users VALUES(null, ?, ?, ?, ?, ?, ?, ?)";
    db.executeQuery(sql, [user.name, user.phone, user.email, 0, user.password, user.address, user.gender], function(result) {
        callback(result);
    });
};

const getUser = (id, callback) => {
    const sql = "SELECT * FROM users WHERE user_id=?";
    db.executeQuery(sql, [id], function(result) {
        callback(result);
    });
};

const updateUser = (user, callback) => {
    const sql = "UPDATE users SET name = ?, email = ?, phone = ?, address = ?, gender = ? WHERE user_id = ?";
    db.executeQuery(sql, [user.name, user.email, user.phone, user.address, user.gender, user.user_id], function(result) {
        callback(result);
    });
};

const updatePassword = (password, id, callback) => {
    const sql = "UPDATE users SET password=? WHERE user_id=?";
    db.executeQuery(sql, [password, id], function(result){
        callback(result);
    });
};

const getAll = (callback) => {
    const sql = "SELECT * FROM users";
    db.executeQuery(sql, null, function(result){
        callback(result);
    });
};

const searchBy = (searchBy, word, callback) => {
    const sql = "SELECT * FROM users WHERE "+searchBy+" = ?";
    db.executeQuery(sql, [word], function(result){
        callback(result);
    });
};

const updateStudent = (id, customer, callback) => {
    const sql = "UPDATE users SET name = ?, email = ?, phone = ?, address = ?, gender = ? WHERE user_id = ?";
    db.executeQuery(sql, [customer.name, customer.email, customer.phone, customer.address, customer.gender, id], function(result) {
        callback(result);
    })
};


const deleteUser = (id, callback) => {
    const sql = "DELETE FROM users WHERE user_id=?";
    db.executeQuery(sql, [id], function(result){
        callback(result);
    });
};

const getUserBorrow = (id, callback) => {
    const sql = "SELECT * FROM books WHERE user_id=?";
    db.executeQuery(sql, [id], function(result){
        callback(result);
    });
};


const getUserHistory = (id, callback) => {
    const sql = "SELECT issue_date.user_id, issue_date.book_id, books.title, books.author, books.publisher, books.isbn, issue_date.date, FROM issue_date INNER JOIN books ON issue_date.book_id=books.book_id WHERE issue_date.user_id=?";
    db.executeQuery(sql, [id], function(result){
        callback(result);
    });
};

const totalBooksBorrowedByStudent = (id, callback) => {
    const sql = "SELECT books.*, issue_date.book_id FROM issue_date INNER JOIN books ON issue_date.book_id=books.book_id WHERE issue_date.user_id=?";
    db.executeQuery(sql, [id], function(result){
        callback(result);
    });
};

module.exports = {
    validateUser,
    createUser,
    getUser,
    updateUser,
    updatePassword,
    getAll,
    searchBy,
    updateStudent,
    deleteUser,
    getUserBorrow,
    getUserHistory,
    totalBooksBorrowedByStudent
};