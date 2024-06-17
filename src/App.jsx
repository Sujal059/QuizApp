import React, { useState, useEffect } from 'react';
import './App.css';
import Question from './components/Question';
import Result from './components/Result';
import questionsData from './assets/question.json';
import screenfull from 'screenfull';

function App() {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0); // Track current question
  const [selectedAnswer, setSelectedAnswer] = useState(null); // Track selected answer
  const [startTime, setStartTime] = useState(null); // Track quiz start time
  const [score, setScore] = useState(0); // Track user score
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const [isQuizFinished, setIsQuizFinished] = useState(false);
  const [isEnterFulScrnBtnClk, setIsEnterFulScrnBtnClk] = useState(false);
  const [min, setMin] = useState(0);
  const [sec, setSec] = useState(0);



  const toggleFullScreen = () => {
    setIsEnterFulScrnBtnClk(!isEnterFulScrnBtnClk);
    if (!screenfull.isEnabled) {
      alert('Fullscreen mode is not supported by your browser.');
      return;
    }
  
    if (isFullScreen) {
      const shouldExit = window.confirm('Exiting fullscreen will end the quiz. Are you sure?');
      //console.log(shouldExit);
      if (shouldExit) {
        screenfull.exit();
        setIsFullScreen(false);
        setIsQuizFinished(true); // Set quiz finished on confirmed exit
      } else {
        // Resume the quiz if user cancels exit
        setIsFullScreen(true); // Restore fullscreen state
      }
    } else {
      screenfull.request();
      setIsFullScreen(screenfull.isFullscreen);
    }
  };
  

  
  const handleFullScreenChange = () => {
    if (!isFullScreen) {
      // End quiz if user exits fullscreen
      if(isEnterFulScrnBtnClk)setIsQuizFinished(true);
      saveQuizData(); // Save remaining data
    }
    setIsFullScreen(screenfull.isFullscreen);
  };

  const startQuiz = () => {
    if (!isFullScreen) return; // Don't allow starting quiz without full screen
    setIsQuizStarted(true);
    setStartTime(Date.now()); // Set start time for timer
  };

  const handleAnswerSubmit = () => {
    if (selectedAnswer !== null) {
      const isCorrect = selectedAnswer === questionsData[currentQuestion].correctAnswer;
      setScore(score + (isCorrect ? 1 : 0));

      if (currentQuestion === questionsData.length - 1) {
        setIsQuizFinished(true);
        screenfull.exit(); // Exit fullscreen automatically on last question submit
      } else {
        setCurrentQuestion(currentQuestion + 1);
      }
      setSelectedAnswer(null); // Reset selected answer for next question
      saveQuizData(); // Save current state to localStorage
    }
  };

  const handleEndQuiz = () => {
    setIsQuizFinished(true);
    screenfull.exit(); // Exit fullscreen automatically
  };



  useEffect(() => {
    const checkFullScreenChange = () => {
      handleFullScreenChange();
    };

    screenfull.onchange(checkFullScreenChange);

    return () => screenfull.off('change', checkFullScreenChange);
  }, []);

 


  const saveQuizData = () => {
    localStorage.setItem(
      'quizData',
      JSON.stringify({ currentQuestion, selectedAnswer, startTime })
    );
  };

  const handleTimerEnd = () => {
    setIsQuizFinished(true);
    saveQuizData(); // Save data even if timer ends
  };

  // Calculate remaining time based on start time (adjust logic if needed)
  const remainingTime = startTime ? Math.max(0, (10 * 60 * 1000 - (Date.now() - startTime))) / 1000 : null;

  useEffect(() => {
    setTimeout(() => {
      setMin(Math.floor(remainingTime / 60));
      setSec(Math.floor(remainingTime % 60) % 60);
      //console.log(min, sec);
    }, 1000);
  });

  return (
  <div className='AppSup'>
    <div className="App">
      {/* Fullscreen message if not in fullscreen mode */}
      {!isFullScreen && !isEnterFulScrnBtnClk && <p>Please enter Full Screen mode to start the quiz.</p>}

      {/* Fullscreen content */}
      {isFullScreen && (
        <>
          <button onClick={toggleFullScreen} style={{marginRight:"20px"}}>Exit Fullscreen</button>

          {/* Start Quiz button if not started yet */}
          {!isQuizStarted && <button onClick={startQuiz}>Start Quiz</button>}

          {/* Quiz content if started and not finished */}
          {isQuizStarted && !isQuizFinished && (
            <>
              <Question
                question={questionsData[currentQuestion].question}
                answers={questionsData[currentQuestion].answers}
                selectedAnswer={selectedAnswer}
                onAnswerSelect={(answerIndex) => setSelectedAnswer(answerIndex)}
              />
              <button onClick={handleAnswerSubmit} disabled={selectedAnswer === null}>
                {currentQuestion + 1}/{questionsData.length} - Submit Answer
              </button>
              {remainingTime !== null && <p>Remaining Time: {min}:{sec} seconds</p>}
              {remainingTime === 0 && handleTimerEnd()}

              {/* End Quiz button */}
              {
                <button onClick={handleEndQuiz}>End Quiz</button>
              }
            </>
          )}

          
        </>
      )}

      {/* Enter Fullscreen button if not in fullscreen mode */}
      {!isFullScreen && !isQuizFinished && <button onClick={toggleFullScreen}>Enter Fullscreen</button>}

      {/* Result if quiz is finished */}
      {isQuizFinished && (
            <Result score={score} totalQuestions={questionsData.length} />
          )}
    </div>
  </div>
  );
}

export default App;
