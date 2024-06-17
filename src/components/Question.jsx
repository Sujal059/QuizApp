import '../assets/Question.css';
import React from 'react';

const Question = ({ question, answers, selectedAnswer, onAnswerSelect }) => {
  return (
    <div className="Question">
      <p className="Question__text">{question}</p>
      <div className='Answer_div'>
        {answers.map((answer, index) => (
          <label key={index} className="Answer">
            <input
              type="radio"
              name="answer"
              value={index}
              checked={selectedAnswer === index}
              onChange={() => onAnswerSelect(index)}
            />
            {answer}
          </label>
        ))}
      </div>
    </div>
  );
};

export default Question;
