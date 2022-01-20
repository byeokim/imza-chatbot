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
