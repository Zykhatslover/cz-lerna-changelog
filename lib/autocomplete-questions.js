'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (questions) {
  return questions.map(function (question) {
    if (!question.type === 'autocomplete' || !question.choices) {
      return question;
    }
    return Object.assign({}, question, {
      source: function source(answersSoFar, input) {
        return new Promise(function (resolve) {
          if (!input) {
            resolve(question.choices);
            return;
          }
          var matches = question.choices.filter(function (choice) {
            var choiceName = typeof choice === 'string' ? choice : choice.name;
            return choiceName.toLowerCase().indexOf(input.toLowerCase()) === 0;
          });
          resolve(matches);
        });
      }
    });
  });
};