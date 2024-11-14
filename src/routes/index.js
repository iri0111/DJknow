//index.js (가은)
//라우팅 분리(app.js에서 라우터 불러오기)

const express = require("express");
const router = express.Router();
const db = require('../../config/db'); 


// 홈 페이지 (검색 폼)
router.get('/', (req, res) => {
 console.log('GET 요청: /');
 res.render('index', { categorizedResults: [], error: null });
});

// 검색 요청 처리
router.post('/search', async (req, res) => {
  const query = req.body.query.trim().toLowerCase(); // 검색어를 소문자로 변환
  const category = req.body.category || '';
  
  console.log('POST 요청: /search');
  console.log('검색어:', query);

 //검색어가 빈 경우
  if (!query) {
    console.log('검색어가 없습니다.');
    return res.render('index', { categorizedResults: [], error: '검색어를 입력하세요' });
  }

  try {
    //카테고리와 검색어에 맞는 게시글 검색
    let sql = `
      SELECT * FROM posts #테이블명 확인
      WHERE (LOWER(title) LIKE ? OR LOWER(contents) LIKE ?)
    `;
    let params = [`%${query}%`, `%${query}%`];

    // 카테고리 선택된 경우, 카테고리 추가 조건
    if (category) {
      sql += ' AND category = ?';
      params.push(category);
    }

    const [results] = await db.execute(sql, params);

    // 검색된 결과가 없을 경우
    if (results.length === 0) {
      console.log('검색 결과가 없습니다.');
      return res.render('index', { categorizedResults: [], error: '검색 결과가 없습니다.' });
    }

  // 검색 결과를 카테고리별로 분류
  const categorizedResults = {
    '자료실': [],
    '주제공유': [],
    '자유게시판': []
  };

  results.forEach(item => {
    categorizedResults[item.category].push(item);
  });

  console.log(`검색된 결과: ${results.length}개`);
  res.render('index', { categorizedResults, error: null});

  } catch (error) {
    console.error('데이터베이스 오류:', error);
    return res.render('index', { categorizedResults: [], error: '검색 중 오류가 발생했습니다.'});
  }
});

module.exports = router;