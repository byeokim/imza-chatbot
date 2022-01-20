# 임자(IMZA) 챗봇

[상상플래닛](https://www.sangsangplanet.com/) 상상서가의 책을 관리하는 챗봇, [임자](https://pf.kakao.com/_AYXns)의 [스킬서버](https://i.kakao.com/docs/skill-build#%EC%8A%A4%ED%82%AC-%EC%84%9C%EB%B2%84%EB%9E%80) 소스코드입니다. PHP로 최초 제작된 것을 자바스크립트로 포팅한 버전입니다. 카카오 봇 시스템에서 전송한 요청을 받아 처리합니다.

# 개발

## 요구사항

- Node.js
- MySQL
- 네이버 오픈 API Client ID 및 Client Secret ([링크](https://developers.naver.com/docs/search/book/))
- 임자 카카오 챗봇 관리자센터에서 스킬의 URL이 본 서버로 연결되도록 설정 ([링크](https://i.kakao.com/docs/skill-build#%EC%8A%A4%ED%82%AC-%EC%B6%94%EA%B0%80))

## 설치

```
git clone
cd imza-chatbot
yarn
```

## 셋업

### 테스트용 DB 생성

```
mysql -u username -p
mysql> CREATE DATABASE sangsang_library_dev;

```

### 더미 데이터 입력

```
mysql -u username -p sangsang_library_dev < db/seeds.sql
```

### 환경변수 설정

`.env` 파일을 생성한 후 아래를 채워넣습니다.

```
PORT= #본 서버의 포트번호
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USERNAME=username
DB_PASSWORD=password
DB_DATABASE=sangsang_library_dev
X_NAVER_CLIENT_ID=
X_NAVER_CLIENT_SECRET=
BOOK_LIST_URL= #도서 리스트 확인하기 URL
REQUEST_FOR_BOOK_URL= #도서 구매 요청하기 URL
```

## 실행

```
yarn start
```
