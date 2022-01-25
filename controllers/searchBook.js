const pool = require("../helpers/mysql");
const { errorResObject } = require("../helpers/utils");

const BOOK_LIST_URL = process.env.BOOK_LIST_URL;
const REQUEST_FOR_BOOK_URL = process.env.REQUEST_FOR_BOOK_URL;

/**
 * intent.name == 검색하기 - 키워드
 *
 * 필수 파라미터 (action.params)
 * book_name string 검색할 키워드
 *
 * 참조: https://i.kakao.com/docs/skill-response-format#action
 */
module.exports = async (req, res) => {
  try {
    const { action } = req.body;

    // searchedBooks: Array<{
    //   idx: number;
    //   name: string;
    //   publisher: string;
    //   author: string;
    //   isbn: string;
    // }>
    const searchedBooks = await (() =>
      new Promise((resolve, reject) =>
        pool.query(
          "SELECT * FROM book WHERE name LIKE ?",
          `%${action.params.book_name}%`,
          (err, results) => {
            if (err) {
              return reject(err);
            }
            return resolve(results);
          }
        )
      ))();

    if (searchedBooks.length < 1) {
      res.json({
        version: "2.0",
        template: {
          outputs: [
            {
              basicCard: {
                description:
                  "아쉽게도 검색어가 포함된 책을 찾지 못했어요. 💦\n\n●비슷한 주제의 다른 책이 있는지 궁금하다면, 상상서가 도서 리스트를 한번 확인해보세요!  \n●상상서가에 꼭 있었으면 하는 책이 있다면, 도서 구매를 신청해보세요.",
                buttons: [
                  {
                    action: "webLink",
                    label: "도서 리스트 확인하기",
                    webLinkUrl: BOOK_LIST_URL,
                  },
                  {
                    action: "webLink",
                    label: "도서 구매 요청하기",
                    webLinkUrl: REQUEST_FOR_BOOK_URL,
                  },
                ],
              },
            },
          ],
          quickReplies: [
            {
              label: "다시 검색하기",
              action: "block",
              messageText: "다시 검색해볼게요.",
              blockId: "60d2f7b9c4eef1062e2b0575",
            },
          ],
        },
      });

      return;
    }

    const isbnlist = searchedBooks.map((result) => result.isbn).join("&");
    let bookList = [];
    let quickReplies = [];

    for (const [index, book] of searchedBooks.entries()) {
      bookList.push(`${index + 1}. ${book.name}\n`);
      quickReplies.push({
        label: `${index + 1}번 책 자세히 알아보기`,
        action: "block",
        messageText: `${index + 1}번 책에 대해 좀 더 알려주세요.`,
        blockId: "60d324b23a5c2f7222f40333",
        extra: {
          isbn: book.isbn,
          isbnlist,
        },
      });
    }

    res.json({
      version: "2.0",
      template: {
        outputs: [
          {
            simpleText: {
              text: `짜잔, 총 ${searchedBooks.length}권의 책을 찾았어요! 👐\n\n(다만 이 책들이 대여중인지, 어디에 있는지까진 확인해줄 수는 없어요. 미안해요! 보물찾기 하는 마음으로 1, 2층의 서가에서 원하는 책을 찾아보세요.😉)`,
            },
          },
          {
            simpleText: {
              text: bookList.join("\n"),
            },
          },
        ],
        quickReplies,
      },
    });
  } catch (err) {
    console.log(err);
    res.json(errorResObject);
  }
};
