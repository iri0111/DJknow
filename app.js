///app.js
"use strict";

//module
const express = require("express");
const path = require('path');
const bodyParser = require("body-parser");

const app = express();

//url 인코딩 처리
app.use(bodyParser.urlencoded({ extended: true }));

// 라우팅 설정 및 연결
const index = require('./src/routes/index');
app.use("/", index);

// 앱세팅
app.set("view engine", "ejs");
app.set("views", "./src/views");
app.use(express.static(`${__dirname}/src/public`));

// 라우팅
app.use('/', index);

module.exports = app;