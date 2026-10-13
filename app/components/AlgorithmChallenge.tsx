'use client';

import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiFetch } from '@/src/lib/api-client';

import { Icon } from '@/src/components/Icon';
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
      <div className="surface rounded-2xl p-8 max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className={`w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center ${
            isPassed ? 'bg-positive/20 border-4 border-positive' : 'bg-destructive/20 border-4 border-destructive'
          }`}>
            <Icon name={isPassed ? 'check_circle' : 'cancel'} className={`text-6xl ${isPassed ? 'text-positive' : 'text-destructive'}`} />
          </div>
          
          <h2 className="font-display text-title-lg font-bold text-fg mb-2">
            {isPassed ? '🎉 Challenge Passed!' : '📚 Keep Practicing!'}
          </h2>
          <p className="text-fg-2 mb-4">
            You scored {correctCount} out of {questions.length} questions correctly
          </p>
          
          <div className="text-5xl font-bold text-accent mb-2">{score}%</div>
          <p className="text-sm text-fg-2">
            {isPassed ? 'You can now mark this algorithm as complete!' : 'You need 70% to pass. Try again!'}
          </p>
        </div>

        {/* Answer Review */}
        <div className="space-y-3 mb-6">
          <h3 className="font-display text-sm font-bold text-fg-2 mb-3">ANSWER REVIEW</h3>
          {questions.map((q, index) => {
            const userAnswer = selectedAnswers[index];
            const isCorrect = userAnswer === q.correctAnswer;
            return (
              <div
                key={q.id}
                className={`p-4 rounded-lg border ${
                  isCorrect ? 'bg-positive/5 border-positive/30' : 'bg-destructive/5 border-destructive/30'
                }`}
              >
                <div className="flex items-start gap-3">
                  <Icon name={isCorrect ? 'check_circle' : 'cancel'} className={`text-xl ${isCorrect ? 'text-positive' : 'text-destructive'}`} />
                  <div className="flex-1">
                    <p className="text-sm text-fg mb-1">Question {index + 1}</p>
                    {!isCorrect && (
                      <p className="text-xs text-fg-2">
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
            className="flex-1 px-6 py-3 bg-surface-2 hover:bg-surface-2 text-fg rounded-lg transition-colors font-semibold"
          >
            Try Again
          </button>
          {isPassed && (
            <button
              onClick={handleComplete}
              disabled={isCompleting}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-accent to-negative hover:shadow-lg hover:shadow-accent/30 text-fg rounded-lg transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCompleting ? (
                <span className="flex items-center justify-center gap-2">
                  <Icon name="progress_activity" className="text-sm animate-spin" />
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
    <div className="surface rounded-2xl p-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-title-lg font-bold text-fg">{title} Challenge</h2>
          <div className="text-sm text-fg-2">
            Question {currentQuestionIndex + 1} of {questions.length}
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="h-1 bg-surface-2 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-accent to-negative transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-fg mb-4">{currentQuestion.question}</h3>
        
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
                    ? 'bg-positive/10 border-positive text-positive'
                    : showWrong
                    ? 'bg-destructive/10 border-destructive text-destructive'
                    : isSelected
                    ? 'bg-accent/10 border-accent text-accent'
                    : 'bg-surface border-line text-fg hover:border-accent/50'
                } ${isSubmitted ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    showCorrect ? 'border-positive bg-positive' :
                    showWrong ? 'border-destructive bg-destructive' :
                    isSelected ? 'border-accent bg-accent' : 'border-line-strong'
                  }`}>
                    {(isSelected || showCorrect) && (
                      <Icon name={showCorrect ? 'check' : showWrong ? 'close' : 'check'} className="text-fg text-sm" />
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
          isCorrect ? 'bg-positive/10 border border-positive/30' : 'bg-negative/10 border border-negative/30'
        }`}>
          <div className="flex gap-3">
            <Icon name={isCorrect ? 'lightbulb' : 'info'} className={`${isCorrect ? 'text-positive' : 'text-negative'}`} />
            <div>
              <p className="font-semibold text-fg mb-1">
                {isCorrect ? 'Correct!' : 'Explanation'}
              </p>
              <p className="text-sm text-fg-2">{currentQuestion.explanation}</p>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
          disabled={currentQuestionIndex === 0}
          className="px-6 py-3 bg-surface-2 hover:bg-surface-2 text-fg rounded-lg transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        
        <div className="flex-1" />

        {!isSubmitted ? (
          <button
            onClick={handleSubmitAnswer}
            disabled={!isAnswered}
            className="px-6 py-3 bg-accent hover:bg-accent/90 text-accent-ink rounded-lg transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit Answer
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="px-6 py-3 bg-gradient-to-r from-accent to-negative hover:shadow-lg hover:shadow-accent/30 text-fg rounded-lg transition-all font-semibold"
          >
            {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'See Results'}
          </button>
        )}
      </div>
    </div>
  );
}
