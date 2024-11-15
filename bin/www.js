///www.js
"use strict";

// 서버 시작
const app = require("../app");
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log("서버가동");
});