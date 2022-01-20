const connection = require("../helpers/mysql");
const { errorResObject } = require("../helpers/utils");

/**
 * intent.name == 대출하기 - 대출 가능 여부 체크
 *
 * 필수 파라미터 (action.params)
 * 없음
 *
 * 참조: https://i.kakao.com/docs/skill-response-format#action
 */
module.exports = async (req, res) => {
  try {
    // bookUser: authenticate.js 에서 req에 추가한 사용자 객체
    const { bookUser } = req;

    // notReturnedBooks: Array<{
    //   idx: number;
    //   user_idx: number;
    //   book_idx: number;
    //   borrow_date: string;
    //   return_date: string | null;
    // }>
    const notReturnedBooks = await (() =>
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

    if (notReturnedBooks.length > 1) {
      throw new Error(`${bookUser.name}님이 대출 중인 책이 2권 이상 있습니다`);
    }

    if (notReturnedBooks.length === 1) {
      const notReturnedBook = notReturnedBooks[0];

      // books: Array<{
      //   idx: number;
      //   name: string;
      //   publisher: string;
      //   author: string;
      //   isbn: string;
      // }>
      const books = await (() =>
        new Promise((resolve, reject) =>
          connection.query(
            "SELECT * FROM book WHERE idx = ?",
            notReturnedBook.book_idx,
            (err, results) => {
              if (err) {
                return reject(err);
              }
              return resolve(results);
            }
          )
        ))();

      if (books.length > 1) {
        throw new Error(
          `${bookUser.name}님이 대출 중인 book_idx=${notReturnedBook.idx}에 해당하는 책이 데이터베이스에 2권 이상 있습니다`
        );
      }

      if (books.length < 1) {
        throw new Error(
          `${bookUser.name}님이 대출 중인 book_idx=${notReturnedBook.idx}에 해당하는 책이 데이터베이스에 없습니다`
        );
      }

      const book = books[0];

      res.json({
        version: "2.0",
        template: {
          outputs: [
            {
              simpleText: {
                text: `🤔 흠...이미 대출 중인 책이 있는 것으로 확인되네요.\n\n[대출 중인 도서]\n${book.name}\n\n이 책을 우선 반납해주시겠어요? 🙏`,
              },
            },
          ],
        },
      });

      return;
    }

    res.json({
      version: "2.0",
      template: {
        outputs: [
          {
            simpleText: {
              text: "대출할 도서를 준비해주세요.",
            },
          },
        ],
        quickReplies: [
          {
            label: "준비완료",
            action: "block",
            messageText: "준비했어요.",
            blockId: "60d2fb58b6a923746594da33",
          },
        ],
      },
    });
  } catch (err) {
    console.log(err);
    res.json(errorResObject);
  }
};
