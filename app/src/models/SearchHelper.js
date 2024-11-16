//SearchHelper.js
//검색 로직 처리 공통함수 searchPosts 생성
"use strict";

const db = require('../config/db');

//공통함수 searchPosts
async function searchPosts(query, category) {
  const sql = `
    SELECT * FROM posts
    WHERE (LOWER(title) LIKE ? OR LOWER(contents) LIKE ?) 
  `;

  const params = [`%${query}%`, `%${query}%`];

  // 카테고리 선택된 경우, 카테고리 추가 조건
  if (category) {
    sql += ' AND category = ?';
    params.push(category);
  }

  try {
    const [results] = await db.execute(sql, params); //execute가 mysql2구문인지 확인필요.
    console.log('검색된 결과:', results); //디버깅용 로그

    // 검색된 결과 없는 경우
    if (results.length === 0) {
      return { error: '검색 결과가 없습니다.', categorizedResults: [] };
    }

    //카테고리별로 결과 분류
    const categorizedResults = {
      '자료실': [],
      '주제공유': [],
      '자유게시판': []
    };

    results.forEach(item => {
      if (!categorizedResults[item.category]) {
        categorizedResults[item.category] = [];
      }
      categorizedResults[item.category].push(item);
    });

    console.log('분류된 결과:', categorizedResults); //디버깅용 로그
    
    for (let category in categorizedResults) {
      const posts = categorizedResults[category];
      if (posts.length > 0) {
        console.log(`\n카테고리: ${category} (총 ${post.length}개 게시글`);
        posts.forEach(post => {
          console.log(` 제목: ${post.title}`);
          console.log(` 내용: ${post.contents.slice(0, 50)}...`);
          console.log(` 작성자: ${post.user_id}`);
        });
      }
    }

    return { error: null, categorizedResults };

  } catch (error) {
    console.error('검색 중 오류 발생:', error);
    return { error: '검색 중 오류가 발생했습니다.', categorizedResults: [] };
  }
}

module.exports = searchPosts;