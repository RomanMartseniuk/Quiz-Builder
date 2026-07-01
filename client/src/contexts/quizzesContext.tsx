/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useState, type ReactNode } from "react";
import type { Quiz } from "@/types/Quiz";
import type { Question } from "@/types/Question";
import { api } from "@/api/api";

export interface QuizzesContextValue {
  quizzes: Quiz[];
  loading: boolean;
  error: string | null;
  refreshQuizzes: () => Promise<void>;
  createQuiz: (title: string, questions: Question[]) => Promise<Quiz>;
  removeQuiz: (id: string) => Promise<void>;
}

export const QuizzesContext = createContext<QuizzesContextValue | null>(null);

export const QuizzesProvider = ({ children }: { children: ReactNode }) => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshQuizzes = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getQuizzes();
      setQuizzes(data);
    } catch {
      setError("Failed to load quizzes");
    } finally {
      setLoading(false);
    }
  };

  const createQuiz = async (title: string, questions: Question[]) => {
    const newQuiz = await api.postQuiz(title, questions);
    setQuizzes((prev) => [...prev, newQuiz]);
    return newQuiz;
  };

  const removeQuiz = async (id: string) => {
    await api.deleteQuiz(id);
    setQuizzes((prev) => prev.filter((q) => q.id !== id));
  };

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await api.getQuizzes();
        if (!cancelled) setQuizzes(data);
      } catch {
        if (!cancelled) setError("Failed to load quizzes");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <QuizzesContext.Provider
      value={{
        quizzes,
        loading,
        error,
        refreshQuizzes,
        createQuiz,
        removeQuiz,
      }}
    >
      {children}
    </QuizzesContext.Provider>
  );
};
