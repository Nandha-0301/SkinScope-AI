import { useMemo, useState } from "react";
import ProgressBar from "./ProgressBar.jsx";

function RoutineForm({ questions, onSubmit, onClear, onAnswersChange }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [started, setStarted] = useState(false);

  const current = questions[currentQuestion];

  const answeredCount = useMemo(
    () => answers.filter((answer) => (Array.isArray(answer) ? answer.length > 0 : String(answer || "").trim().length > 0)).length,
    [answers]
  );

  const canProceed = useMemo(() => {
    if (!started || !current) return false;
    const value = answers[currentQuestion];
    if (current.type === "multi-select") return Array.isArray(value) && value.length > 0;
    if (current.type === "select") return typeof value === "string" && value !== "" && !value.startsWith("Select");
    return String(value || "").trim().length > 0;
  }, [answers, current, currentQuestion, started]);

  const updateAnswer = (index, value) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[index] = value;
      if (onAnswersChange) onAnswersChange(next);
      return next;
    });
  };

  const startAssessment = () => {
    setStarted(true);
    setCurrentQuestion(0);
    setAnswers(Array(questions.length).fill(""));
    if (onAnswersChange) onAnswersChange(Array(questions.length).fill(""));
  };

  const goNext = () => {
    if (!canProceed) return;
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((value) => value + 1);
    }
  };

  const submitAssessment = () => {
    if (!canProceed || answers.length !== questions.length || answers.some((answer) => !String(answer || "").trim())) {
      return;
    }
    if (onSubmit) onSubmit(answers);
  };

  const clearAssessment = () => {
    setStarted(false);
    setCurrentQuestion(0);
    setAnswers([]);
    if (onAnswersChange) onAnswersChange([]);
    if (onClear) onClear();
  };

  return (
    <section className="tool-section skin-assessment">
      <h3 className="title">Personalized Skin Type Assessment</h3>

      {!started ? (
        <div className="question-block question-enter">
          <label>Start answering your skin assessment questions</label>
          <button type="button" onClick={startAssessment}>
            Start Assessment
          </button>
        </div>
      ) : (
        <>
          <ProgressBar value={answeredCount} total={questions.length} />

          <div className="question-block question-enter" key={`routine-q-${currentQuestion}`}>
            <label>{`${currentQuestion + 1}. ${current.q}`}</label>

            {current.type === "select" && (
              <select
                value={typeof answers[currentQuestion] === "string" ? answers[currentQuestion] : current.options[0]}
                onChange={(event) => updateAnswer(currentQuestion, event.target.value)}
              >
                {current.options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            )}

            {current.type === "text" && (
              <input
                type="text"
                placeholder="Type your answer..."
                value={typeof answers[currentQuestion] === "string" ? answers[currentQuestion] : ""}
                onChange={(event) => updateAnswer(currentQuestion, event.target.value)}
              />
            )}

            {currentQuestion < questions.length - 1 && (
              <button type="button" className="next-btn" onClick={goNext} disabled={!canProceed}>
                Next Question
              </button>
            )}
          </div>

          {currentQuestion === questions.length - 1 && (
            <div className="end-buttons">
              <button type="button" onClick={submitAssessment} disabled={!canProceed}>
                Submit
              </button>
              <button type="button" onClick={clearAssessment}>
                Clear All
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}

export default RoutineForm;
