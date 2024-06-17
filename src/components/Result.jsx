import '../assets/Result.css';
import React from 'react';

const Result = ({ score, totalQuestions }) => {
  return (
    <div className="Result">
      <p className="Result__score">
        You scored {score} out of {totalQuestions} questions!
      </p>
    </div>
  );
};

export default Result;
