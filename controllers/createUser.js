const connection = require("../helpers/mysql");
const { errorResObject } = require("../helpers/utils");

/**
 * intent.name == 사용자 등록하기
 *
 * 필수 파라미터 (action.params)
 * name string 등록할 사용자의 이름
 * seat string 등록할 사용자의 좌석
 *
 * 참조: https://i.kakao.com/docs/skill-response-format#action
 */
module.exports = async (req, res) => {
  try {
    const { action, userRequest } = req.body;

    // book_user: {
    //   idx: number;
    //   user_id: string;
    //   name: string;
    //   seat: string;
    //   overdue: string | null;
    // }
    await (() =>
      new Promise((resolve, reject) =>
        connection.query(
          "INSERT INTO book_user SET ?",
          {
            // https://i.kakao.com/docs/skill-response-format#user
            user_id: userRequest.user.id,
            name: action.params.name,
            seat: action.params.seat,
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
              text: "감사합니다. 등록이 완료되었습니다! ✨\n\n이제 원하는 책을 빌려보세요.\n어떤 책이 있는지 궁금하다면 검색도 가능해요! ",
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
  } catch (err) {
    console.log(err);
    res.json(errorResObject);
  }
};
