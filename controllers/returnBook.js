const connection = require("../helpers/mysql");
const { errorResObject } = require("../helpers/utils");

/**
 * intent.name == 반납하기 - 반납 가능 여부 체크
 *
 * 필수 파라미터 (action.params)
 * 없음
 *
 * 참조: https://i.kakao.com/docs/skill-response-format#action
 */
module.exports = async (req, res) => {
  // authenticate.js 에서 req에 추가한 사용자 객체
  const { bookUser } = req;

  try {
    // currentlyBorrowedBooks: Array<{
    //   idx: number;
    //   user_idx: number;
    //   book_idx: number;
    //   borrow_date: string;
    //   return_date: null;
    // }>
    const currentlyBorrowedBooks = await (() =>
      new Promise((resolve, reject) =>
        connection.query(
          "SELECT * FROM book_borrow WHERE user_idx = ? AND return_date is NULL",
          bookUser.idx,
          (err, results) => {
            if (err) {
              return reject(err);
            }
            return resolve(results);
          }
        )
      ))();

    if (currentlyBorrowedBooks.length > 1) {
      throw new Error(
        `${bookUser.name}님이 현재 대여 중인 책이 2권 이상입니다`
      );
    }

    if (currentlyBorrowedBooks.length < 1) {
      res.json({
        version: "2.0",
        template: {
          outputs: [
            {
              simpleText: {
                text: "현재 대출 중인 책이 없네요 🤗",
              },
            },
          ],
          quickReplies: [
            {
              label: "검색하기",
              action: "block",
              messageText: "도서 검색할래",
              blockId: "60d2f7b9c4eef1062e2b0575",
            },
            {
              label: "대출하기",
              action: "block",
              messageText: "대출할게요.",
              blockId: "60d2eb093a5c2f7222f401cb",
            },
          ],
        },
      });

      return;
    }

    // 포맷: 2022-01-01
    const returnDate = new Date(new Date().getTime() + 9 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10);

    // book_borrow: {
    //   idx: number;
    //   user_idx: number;
    //   book_idx: number;
    //   borrow_date: string;
    //   return_date: string | null;
    // }
    (() =>
      new Promise((resolve, reject) =>
        connection.query(
          "UPDATE book_borrow SET return_date = ? WHERE user_idx = ?",
          [returnDate, bookUser.idx],
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
              text: `${returnDate}\n반납이 완료되었습니다. 🧡\n반납일을 지켜주셔서 고맙습니다 🤩`,
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
