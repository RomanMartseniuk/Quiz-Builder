import type { Question as PrismaQuestion } from "../generated/prisma/client.js";
import type { Question } from "../types/Question.js";

export function toPrismaQuestion(q: Question, order: number) {
   const base = { question: q.question, type: q.type, order };

   switch (q.type) {
      case "boolean":
         return { ...base, boolAnswer: q.answer };
      case "input":
         return { ...base, textAnswer: q.answer };
      case "checkbox":
         return { ...base, options: q.options, checkboxAnswer: q.answer };
   }
}

export function fromPrismaQuestion(q: PrismaQuestion): Question {
   switch (q.type) {
      case "boolean":
         return { id: q.id, type: "boolean", question: q.question, answer: q.boolAnswer! };
      case "input":
         return { id: q.id, type: "input", question: q.question, answer: q.textAnswer! };
      case "checkbox":
         return {
            id: q.id,
            type: "checkbox",
            question: q.question,
            options: q.options as string[],
            answer: q.checkboxAnswer as string[],
         };
      default:
         throw new Error(`Unknown question type: ${q.type}`);
   }
}