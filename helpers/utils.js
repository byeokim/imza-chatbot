// https://i.kakao.com/docs/skill-response-format#skillresponse
module.exports.errorResObject = {
  version: "2.0",
  template: {
    outputs: [
      {
        simpleText: {
          text: "문제가 발생했습니다🙃 운영팀으로 연락주시면 감사하겠습니다!",
        },
      },
    ],
  },
};
