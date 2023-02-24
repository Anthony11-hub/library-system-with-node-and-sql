const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'mypasswordhere',
    database: 'library_management_system'
});

module.exports = {
    executeQuery: function(sql, sqlParam, callback) {
        if(sqlParam == null){
            connection.query(sql, function(error, result) {
                if(error){
                    console.log(error);
                }
                callback(result);
            });
        }
        else {
            connection.query(sql, sqlParam, function(error, result) {
                if(error){
                    console.log(error);
                }
                callback(result);
            });
        }
    }
}

