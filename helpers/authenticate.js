const connection = require("./mysql");
const { errorResObject } = require("./utils");

module.exports = async (req, res, next) => {
  try {
    const { intent, userRequest } = req.body;

    // 스킬 실행시 카카오 봇 시스템이 스킬 서버(본 서버)에 전달하는 SkillPayload를 JSON으로 저장하여 로그로 활용
    // https://i.kakao.com/docs/skill-response-format#skillpayload
    (() =>
      new Promise((resolve, reject) =>
        connection.query(
          "INSERT INTO kakao_chat_request (con) VALUES (?)",
          JSON.stringify(req.body),
          (err, results) => {
            if (err) {
              return reject(err);
            }
            return resolve(results);
          }
        )
      ))();

    // bookUsers: Array<{
    //   idx: number;
    //   user_id: string;
    //   name: string;
    //   seat: string;
    //   overdue: string | null;
    // }>
    const bookUsers = await (() =>
      new Promise((resolve, reject) =>
        connection.query(
          "SELECT * FROM book_user WHERE user_id = ?",
          // https://i.kakao.com/docs/skill-response-format#userrequest
          userRequest.user.id,
          (err, results) => {
            if (err) {
              return reject(err);
            }
            return resolve(results);
          }
        )
      ))();

    if (bookUsers.length === 1) {
      req.bookUser = bookUsers[0];
      next();
      return;
    }

    if (
      // https://i.kakao.com/docs/skill-response-format#intent
      intent.name === "사용자 등록하기" ||
      intent.name.includes("검색하기")
    ) {
      next();
      return;
    }

    if (bookUsers.length > 1) {
      throw new Error(
        `동일한 사용자(${bookUsers[0].name})가 2명 이상 있습니다`
      );
    }

    res.json({
      version: "2.0",
      template: {
        outputs: [
          {
            simpleText: { text: "사용자 정보 기입 후 이용해주세요." },
          },
        ],
        quickReplies: [
          {
            label: "사용자 등록하기",
            action: "block",
            messageText: "사용자 등록할래",
            blockId: "60d2f5a566fd8c18c0dbb16d",
          },
        ],
      },
    });
  } catch (err) {
    console.log(err);
    res.json(errorResObject);
  }
};
