export default function (questions) {
  return questions.map((question) => {
    if (!question.type === 'autocomplete' || !question.choices) {
      return question;
    }
    return Object.assign({}, question, {
      source: (answersSoFar, input) => {
        return new Promise((resolve) => {
          if (!input) {
            resolve(question.choices);
            return;
          }
          const matches = question.choices.filter((choice) => {
            const choiceName =
              typeof choice === 'string' ? choice : choice.name;
            return choiceName.toLowerCase().indexOf(input.toLowerCase()) === 0;
          });
          resolve(matches);
        });
      },
    });
  });
}
