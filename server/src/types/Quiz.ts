import { Question } from "./Question.js";

export interface Quiz {
   id: string;
   title: string;
   questions: Question[];
}