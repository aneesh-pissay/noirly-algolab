'use client';

import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiFetch } from '@/src/lib/api-client';

interface ChallengeQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface AlgorithmChallengeProps {
  algorithmId: string;
  levelId: number;
  title: string;
  topicTitle?: string;
  questions: ChallengeQuestion[];
  onComplete?: () => void;
}

export default function AlgorithmChallenge({
  algorithmId,
  levelId,
  title,
  topicTitle,
  questions,
  onComplete,
}: AlgorithmChallengeProps) {
  const { user } = useAuth();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const selectedAnswer = selectedAnswers[currentQuestionIndex];
  const isAnswered = selectedAnswer !== undefined;
  const isCorrect = isAnswered && selectedAnswer === currentQuestion.correctAnswer;

  const correctCount = Object.entries(selectedAnswers).filter(
    ([index, answer]) => answer === questions[parseInt(index)].correctAnswer
  ).length;

  const score = Math.round((correctCount / questions.length) * 100);
  const isPassed = score >= 70; // 70% passing grade

  const handleSelectAnswer = (optionIndex: number) => {
    if (isSubmitted) return;
    setSelectedAnswers({ ...selectedAnswers, [currentQuestionIndex]: optionIndex });
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setIsSubmitted(false);
    } else {
      setShowResults(true);
    }
  };

  const handleSubmitAnswer = () => {
    setIsSubmitted(true);
  };

  const handleComplete = async () => {
    if (!user) return;
    
    setIsCompleting(true);
    try {
      const response = await apiFetch('/api/user/progress', {
        method: 'POST',
        body: JSON.stringify({
          levelId,
          topicSlug: algorithmId,
          topicTitle: topicTitle || title,
          progress: 100,
          status: 'completed',
          score,
          xpGained: correctCount * 10,
          timeSpent: 0, // This should be tracked in the visualization
        }),
      });

      if (!response.ok) throw new Error('Failed to save progress');

      await response.json();

      alert('🎉 Congratulations! Challenge completed.');

      if (onComplete) {
        onComplete();
      }

      window.location.href = '/learn-path';
    } catch (error) {
      console.error('Error completing challenge:', error);
      alert('Failed to save progress. Please try again.');
    } finally {
      setIsCompleting(false);
    }
  };

  const handleRetry = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setIsSubmitted(false);
    setShowResults(false);
  };

  if (showResults) {
    return (
      <div className="glass-card rounded-2xl p-8 max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className={`w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center ${
            isPassed ? 'bg-green-500/20 border-4 border-green-500' : 'bg-red-500/20 border-4 border-red-500'
          }`}>
            <span className={`material-symbols-outlined text-6xl ${isPassed ? 'text-green-400' : 'text-red-400'}`}>
              {isPassed ? 'check_circle' : 'cancel'}
            </span>
          </div>
          
          <h2 className="font-display text-title-lg font-bold text-white mb-2">
            {isPassed ? '🎉 Challenge Passed!' : '📚 Keep Practicing!'}
          </h2>
          <p className="text-on-surface-variant mb-4">
            You scored {correctCount} out of {questions.length} questions correctly
          </p>
          
          <div className="text-5xl font-bold text-primary mb-2">{score}%</div>
          <p className="text-sm text-on-surface-variant">
            {isPassed ? 'You can now mark this algorithm as complete!' : 'You need 70% to pass. Try again!'}
          </p>
        </div>

        {/* Answer Review */}
        <div className="space-y-3 mb-6">
          <h3 className="font-display text-sm font-bold text-on-surface-variant mb-3">ANSWER REVIEW</h3>
          {questions.map((q, index) => {
            const userAnswer = selectedAnswers[index];
            const isCorrect = userAnswer === q.correctAnswer;
            return (
              <div
                key={q.id}
                className={`p-4 rounded-lg border ${
                  isCorrect ? 'bg-green-500/5 border-green-500/30' : 'bg-red-500/5 border-red-500/30'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className={`material-symbols-outlined text-xl ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                    {isCorrect ? 'check_circle' : 'cancel'}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm text-on-surface mb-1">Question {index + 1}</p>
                    {!isCorrect && (
                      <p className="text-xs text-on-surface-variant">
                        Correct answer: {q.options[q.correctAnswer]}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleRetry}
            className="flex-1 px-6 py-3 bg-surface-container-high hover:bg-surface-container-highest text-on-surface rounded-lg transition-colors font-semibold"
          >
            Try Again
          </button>
          {isPassed && (
            <button
              onClick={handleComplete}
              disabled={isCompleting}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-primary to-tertiary hover:shadow-lg hover:shadow-primary/30 text-white rounded-lg transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCompleting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                  Saving...
                </span>
              ) : (
                'Mark as Complete'
              )}
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-title-lg font-bold text-white">{title} Challenge</h2>
          <div className="text-sm text-on-surface-variant">
            Question {currentQuestionIndex + 1} of {questions.length}
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="h-1 bg-surface-container-high rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-tertiary transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-on-surface mb-4">{currentQuestion.question}</h3>
        
        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrectAnswer = index === currentQuestion.correctAnswer;
            const showCorrect = isSubmitted && isCorrectAnswer;
            const showWrong = isSubmitted && isSelected && !isCorrectAnswer;

            return (
              <button
                key={index}
                onClick={() => handleSelectAnswer(index)}
                disabled={isSubmitted}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  showCorrect
                    ? 'bg-green-500/10 border-green-500 text-green-400'
                    : showWrong
                    ? 'bg-red-500/10 border-red-500 text-red-400'
                    : isSelected
                    ? 'bg-primary/10 border-primary text-primary'
                    : 'bg-surface-container border-outline-variant/30 text-on-surface hover:border-primary/50'
                } ${isSubmitted ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    showCorrect ? 'border-green-500 bg-green-500' :
                    showWrong ? 'border-red-500 bg-red-500' :
                    isSelected ? 'border-primary bg-primary' : 'border-outline-variant'
                  }`}>
                    {(isSelected || showCorrect) && (
                      <span className="material-symbols-outlined text-white text-sm">
                        {showCorrect ? 'check' : showWrong ? 'close' : 'check'}
                      </span>
                    )}
                  </div>
                  <span className="flex-1">{option}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Explanation (shown after submission) */}
      {isSubmitted && (
        <div className={`p-4 rounded-lg mb-6 ${
          isCorrect ? 'bg-green-500/10 border border-green-500/30' : 'bg-yellow-500/10 border border-yellow-500/30'
        }`}>
          <div className="flex gap-3">
            <span className={`material-symbols-outlined ${isCorrect ? 'text-green-400' : 'text-yellow-400'}`}>
              {isCorrect ? 'lightbulb' : 'info'}
            </span>
            <div>
              <p className="font-semibold text-on-surface mb-1">
                {isCorrect ? 'Correct!' : 'Explanation'}
              </p>
              <p className="text-sm text-on-surface-variant">{currentQuestion.explanation}</p>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
          disabled={currentQuestionIndex === 0}
          className="px-6 py-3 bg-surface-container-high hover:bg-surface-container-highest text-on-surface rounded-lg transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        
        <div className="flex-1" />

        {!isSubmitted ? (
          <button
            onClick={handleSubmitAnswer}
            disabled={!isAnswered}
            className="px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit Answer
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="px-6 py-3 bg-gradient-to-r from-primary to-tertiary hover:shadow-lg hover:shadow-primary/30 text-white rounded-lg transition-all font-semibold"
          >
            {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'See Results'}
          </button>
        )}
      </div>
    </div>
  );
}
