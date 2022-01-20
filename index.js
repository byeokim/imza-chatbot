const express = require("express");
const authenticate = require("./helpers/authenticate");
const createUser = require("./controllers/createUser");
const borrowBook = require("./controllers/borrowBook");
const checkBeforeBorrow = require("./controllers/checkBeforeBorrow");
const returnBook = require("./controllers/returnBook");
const searchBook = require("./controllers/searchBook");
const getBookInfo = require("./controllers/getBookInfo");
const { errorResObject } = require("./helpers/utils");

const app = express();
const port = process.env.PORT;

app.use(express.json());

app.post("/", authenticate, async (req, res) => {
  try {
    const { intent } = req.body;

    if (intent.name === "사용자 등록하기") {
      createUser(req, res);
      return;
    }

    if (intent.name === "대출하기 - 대출 가능 여부 체크") {
      checkBeforeBorrow(req, res);
      return;
    }

    if (intent.name === "대출하기 - 대출 실행") {
      borrowBook(req, res);
      return;
    }

    if (intent.name === "반납하기 - 반납 가능 여부 체크") {
      returnBook(req, res);
      return;
    }

    if (intent.name === "반납하기 - 반납 실행") {
      return;
    }

    if (intent.name === "검색하기 - 키워드") {
      searchBook(req, res);
      return;
    }

    if (intent.name === "검색하기 - 상세 정보") {
      getBookInfo(req, res);
      return;
    }
    if (intent.name === "검색하기 - 재검색") {
      return;
    }
  } catch (err) {
    console.log(err);
    res.json(errorResObject);
  }
});

app.listen(port, () => {
  console.log(`Server listening at ${port}`);
});
