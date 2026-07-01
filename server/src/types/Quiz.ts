import { Question } from "./Question";

export interface Quiz {
   id: string;
   title: string;
   questions: Question[];
}