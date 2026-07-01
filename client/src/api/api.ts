import type { Quiz } from "@/types/Quiz";
import type { Question } from "@/types/Question";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

async function getQuizzes(): Promise<Quiz[]> {
   const res = await fetch(BASE_URL);
   return res.json();
}

async function getQuiz(id: string): Promise<Quiz> {
   const res = await fetch(BASE_URL + id);
   return res.json();
}

async function postQuiz(title: string, questions: Question[]): Promise<Quiz> {
   const res = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, questions }),
   });
   return res.json();
}

async function deleteQuiz(id: string): Promise<void> {
   await fetch(BASE_URL + id, { method: "DELETE" });
}

export const api = {
   getQuizzes,
   getQuiz,
   postQuiz,
   deleteQuiz,
};