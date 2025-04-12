import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import { ThemeProvider } from '@mui/material/styles';
import theme from './Theme.jsx'; // Import your custom theme

const TriviaApp = () => {
  const [questions, setQuestions] = useState(null);
  const [answerVisibility, setAnswerVisibility] = useState({});
  const [score, setScore] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetch('https://the-trivia-api.com/v2/questions');
        const resultJSON = await result.json();

        // Shuffle answers for each question once
        const shuffledQuestions = resultJSON.map(question => {
          const allAnswers = [question.correctAnswer, ...question.incorrectAnswers];
          const shuffledAnswers = shuffleArray(allAnswers);
          return { ...question, shuffledAnswers };
        });
        setScore(0); //reset score with each refresh

        setQuestions(shuffledQuestions);
        // console.log('Success! Status:', result.status);
        // console.log('JSON Results:', resultJSON);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const shuffleArray = (array) => {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
  };

const handleAnswerClick = (questionIndex, answer, correctAnswer) => {
  const isCorrect = correctAnswer[0] === answer;
  setAnswerVisibility((prevVisibility) => ({
    ...prevVisibility,
    [`${questionIndex}-${answer}`]: isCorrect ? "success" : "error",
  }));
  if (isCorrect) {
    setScore(score + 1);
    // console.log(score);
  }
};


  return (
    <body>
      <ThemeProvider theme={theme}>
        <div className='app-container'>
          <div className='title-container'>
            <h1>Trivia Game</h1>
          </div>
          <div className='title-container'>
            <div className='score'>Current Score: { score }</div>
          </div>

          
            {questions && questions.map((question, questionIndex) => {
            const correctAnswer = [question.correctAnswer];
            const shuffledAnswers = question.shuffledAnswers;
            
            return (
            <div className='all-questions-container'>
                <div key={questionIndex} className='question-container'>
                  <div>
                    <p className='question'>{questionIndex + 1}. {question.question.text}</p>
                    <div className='grid-container'>
                      <div className='answers-container'>
                        {shuffledAnswers.map((answer, answerIndex) => (
                          <div className='answer-button' key={answerIndex}>
                            <Button
                                id='button'
                                variant="contained"
                                color={answerVisibility[`${questionIndex}-${answer}`] ? (answerVisibility[`${questionIndex}-${answer}`] === "success" ? "success" : "error") : "primary"}
                                onClick={() => handleAnswerClick(questionIndex, answer, correctAnswer)}
                              >
                                {answer}
                            </Button>
                          </div>
                        ))}
                      </div>

                    </div>
                  </div>

                  </div>
                </div>
            );
          })}
          
        </div>
        </ThemeProvider>
      </body>
  );
};

export default TriviaApp;
