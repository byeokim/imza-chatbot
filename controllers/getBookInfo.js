const axios = require("axios");
const xml2js = require("xml2js");
const { errorResObject } = require("../helpers/utils");

const NAVER_BOOK_SEARCH_API =
  "https://openapi.naver.com/v1/search/book_adv.xml";

/**
 * intent.name == 검색하기 - 상세 정보
 *
 * 필수 파라미터 (action.params)
 * 없음
 *
 * 사용자의 발화가 제공하는 추가적인 정보(action.clientExtra)
 * isbn string 상세 정보를 보려는 책의 ISBN
 * isbnlist string 검색된 모든 책들의 ISBN을 &로 연결한 문자열
 *
 * 참조: https://i.kakao.com/docs/skill-response-format#action
 */
module.exports = async (req, res) => {
  try {
    const { action } = req.body;

    const resultInXml = await axios.get(NAVER_BOOK_SEARCH_API, {
      params: {
        d_isbn: action.clientExtra.isbn,
      },
      headers: {
        "X-Naver-Client-Id": process.env.X_NAVER_CLIENT_ID,
        "X-Naver-Client-Secret": process.env.X_NAVER_CLIENT_SECRET,
      },
    });

    const result = await xml2js.parseStringPromise(resultInXml.data, {
      explicitArray: false,
    });

    // https://developers.naver.com/docs/search/book/
    const { item: book } = result.rss.channel;

    res.json({
      version: "2.0",
      template: {
        outputs: [
          {
            basicCard: {
              title: book.title,
              description: `저자 : ${book.author}`,
              thumbnail: {
                imageUrl: book.image,
              },
              buttons: [
                {
                  action: "webLink",
                  label: "자세히보기",
                  webLinkUrl: book.link,
                },
              ],
            },
          },
        ],
        quickReplies: [
          {
            label: "다시 검색하기",
            action: "block",
            messageText: "다시 찾아볼래",
            blockId: "60d2f7b9c4eef1062e2b0575",
          },
          ...action.clientExtra.isbnlist
            .split("&")
            .map((isbn, index) => ({
              label: `${index + 1}번도서 자세히 알아보기`,
              action: "block",
              messageText: `${index + 1}번도서는 무슨 책이야?`,
              blockId: "60d324b23a5c2f7222f40333",
              extra: {
                isbn,
                isbnlist: action.clientExtra.isbnlist,
              },
            }))
            .filter((e) => e.extra.isbn !== action.clientExtra.isbn),
        ],
      },
    });
  } catch (err) {
    console.log(err);
    res.json(errorResObject);
  }
};
