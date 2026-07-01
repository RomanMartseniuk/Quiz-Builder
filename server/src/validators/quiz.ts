import type { Question } from "../types/Question.js";

function isValidQuestion(q: unknown): q is Question {
   if (typeof q !== "object" || q === null) return false;

   const question = q as Record<string, unknown>;

   if (typeof question.question !== "string" || !question.question.trim()) {
      return false;
   }

   switch (question.type) {
      case "boolean":
         return typeof question.answer === "boolean";

      case "input":
         return (
            typeof question.answer === "string" && question.answer.trim().length > 0
         );

      case "checkbox": {
         const options = question.options;
         const answer = question.answer;

         if (!Array.isArray(options) || options.length < 2) return false;
         if (!options.every((o) => typeof o === "string" && o.trim().length > 0)) {
            return false;
         }

         if (!Array.isArray(answer) || answer.length === 0) return false;
         if (!answer.every((a) => typeof a === "string" && options.includes(a))) {
            return false;
         }

         return true;
      }

      default:
         return false;
   }
}

export function validateCreateQuiz(
   body: unknown
): { title: string; questions: Question[] } | null {
   if (typeof body !== "object" || body === null) return null;

   const { title, questions } = body as Record<string, unknown>;

   if (typeof title !== "string" || !title.trim()) return null;
   if (!Array.isArray(questions) || questions.length === 0) return null;
   if (!questions.every(isValidQuestion)) return null;

   return { title, questions: questions as Question[] };
}