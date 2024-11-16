//db.js
const mysql = require('mysql2');

const db = mysql.createConnection({
 host: 'localhost',
 port: '3306',
 user: 'root',
 password: '0116',
 database: 'djinfo',
 multipleStatements: true,
 waitForConnections: true,
 connectionLimit: 0,
 queueLimit: 0
});

db.connect((err) => {
  if (err) {
    console.error('MySQL 연결 실패:', err.stack);
    return;
  }
  console.log('MySQL 연결 성공');
});

module.exports = db.promise();