import { useContext } from "react";
import { QuizzesContext } from "../contexts/quizzesContext";

export const useQuizzes = () => {
   const ctx = useContext(QuizzesContext);
   if (!ctx) {
      throw new Error("useQuizzes must be used within a QuizzesProvider");
   }
   return ctx;
};