//index.js (가은)
//라우팅 분리(app.js에서 라우터 불러오기)

const express = require("express");
const router = express.Router();
const searchPosts = require('../models/SearchHelper');  // 경로 확인

// (1)메인 검색 요청 처리
router.post('/search', async (req, res) => {
  const query = req.body.query.trim().toLowerCase(); // 검색어를 소문자로 변환
  const category = req.body.category || ''; //카테고리 미선택 시 빈 문자열
  
  console.log('POST 요청: /search');
  console.log('검색어:', query);

 //검색어가 빈 경우
  if (!query) {
    console.log('검색어가 없습니다.');
    return res.render('index', { categorizedResults: [], error: '검색어를 입력하세요' });
  }

  // 검색관련 공통함수 호출
  const { error, categorizedResults } = await searchPosts(query, category);

  res.render('index', { categorizedResults, error });
});

// (2)게시판별 검색 요청 처리
router.post('/search/:category', async (req, res) => {
  const query = req.body.query.trim().toLowerCase(); //검색어 소문자 변환
  const category = req.params.category; //url 파라미터로 받은 카테고리

  console.log(`POST 요청: /search/${category}`);
  console.log('검색어:', query);

  //검색어 빈 경우
  if (!query) {
    console.log('검색어가 없습니다.');
    return res.render('index', { categorizedResults: [], error: '검색어를 입력하세요'});
  }

  //검색관련 공통함수 호출(searchPosts)
  const { error, categorizedResults } = await searchPosts(query, category);

  res.render('index', { categorizedResults, error: error || null });  //error를 명시적으로 전달
});

module.exports = router;