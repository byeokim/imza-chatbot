const pool = require("../helpers/mysql");
const { errorResObject } = require("../helpers/utils");

/**
 * intent.name == 대출하기 - 대출 실행
 *
 * 필수 파라미터 (action.params)
 * barcode string 바코드 JSON (예: '{"barcodeData":"9788997107445"})
 *
 * 참조: https://i.kakao.com/docs/skill-response-format#action
 */
module.exports = async (req, res) => {
  try {
    // bookUser: authenticate.js 에서 req에 추가한 사용자 객체
    const { bookUser } = req;
    const { action } = req.body;
    const { barcodeData } = JSON.parse(action.params.barcode);

    // booksToBeBorrowed: Array<{
    //   idx: number;
    //   name: string;
    //   publisher: string;
    //   author: string;
    //   isbn: string;
    // }>
    const booksToBeBorrowed = await (() =>
      new Promise((resolve, reject) =>
        pool.query(
          "SELECT * FROM book WHERE isbn = ?",
          barcodeData,
          (err, results) => {
            if (err) {
              return reject(err);
            }
            return resolve(results);
          }
        )
      ))();

    if (booksToBeBorrowed.length > 1) {
      throw new Error(
        `${bookUser.name}님이 검색한 ISBN ${barcodeData}에 해당하는 책이 데이터베이스에 2권 이상 있습니다`
      );
    }

    if (booksToBeBorrowed.length < 1) {
      throw new Error(
        `${bookUser.name}님이 검색한 ISBN ${barcodeData}에 해당하는 책이 데이터베이스에 없습니다`
      );
    }

    const bookToBeBorrowed = booksToBeBorrowed[0];

    // bookBorrows: Array<{
    //   idx: number;
    //   user_idx: number;
    //   book_idx: number;
    //   borrow_date: string;
    //   return_date: string | null;
    // }>
    const bookBorrows = await (() =>
      new Promise((resolve, reject) =>
        pool.query(
          "SELECT * FROM book_borrow WHERE book_idx = ? AND return_date is NULL",
          bookToBeBorrowed.idx,
          (err, results) => {
            if (err) {
              return reject(err);
            }
            return resolve(results);
          }
        )
      ))();

    if (bookBorrows.length > 0) {
      res.json({
        version: "2.0",
        template: {
          outputs: [
            {
              simpleText: {
                text: "🤔 흠...이미 대출 중인 책으로 확인되네요. 누군가 저한테 반납했다고 알려주는 걸 깜빡했나 봐요. 번거롭지만 운영팀에 알려주시겠어요? 🙏",
              },
            },
          ],
        },
      });

      return;
    }

    const today = new Date().getTime() + 9 * 60 * 60 * 1000;
    // 포맷: 2022-01-01
    const borrowDate = new Date(today).toISOString().slice(0, 10);
    // 포맷: 2022-01-01
    const returnDate = new Date(today + 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10);

    // book_borrow: {
    //   idx: number;
    //   user_idx: number;
    //   book_idx: number;
    //   borrow_date: string;
    //   return_date: string | null;
    // }
    await (() =>
      new Promise((resolve, reject) =>
        pool.query(
          "INSERT INTO book_borrow SET ?",
          {
            user_idx: bookUser.idx,
            book_idx: bookToBeBorrowed.idx,
            borrow_date: borrowDate,
          },
          (err, results) => {
            if (err) {
              return reject(err);
            }
            return resolve(results);
          }
        )
      ))();

    res.json({
      version: "2.0",
      template: {
        outputs: [
          {
            simpleText: {
              text: `[대출된 도서]\n${bookToBeBorrowed.name}\n\n대출이 완료되었어요. ✨\n\n반납일은 일주일 후인 "${returnDate}" 입니다. 기간 내 반납할 수 있도록 지금 캘린더에 저장해두는 거 어때요? 📅`,
            },
          },
        ],
      },
    });
  } catch (err) {
    console.log(err);
    res.json(errorResObject);
  }
};
