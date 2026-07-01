// src/routes/quiz.ts
import { Router } from "express";
import { prisma } from "../prisma.js";
import { validateCreateQuiz } from "../validators/quiz.js";
import { toPrismaQuestion, fromPrismaQuestion } from "../mappers/question.js";
import { Prisma } from "../generated/prisma/client.js";

const router = Router();

router.post("/quizzes", async (req, res) => {
   const parsed = validateCreateQuiz(req.body);

   if (!parsed) {
      return res.status(400).json({ error: "Invalid quiz data" });
   }

   const { title, questions } = parsed;

   try {
      const created = await prisma.quiz.create({
         data: {
            title,
            questions: {
               create: questions.map((q, i) => toPrismaQuestion(q, i)),
            },
         },
         include: {
            questions: { orderBy: { order: "asc" } },
         },
      });

      res.status(201).json({
         id: created.id,
         title: created.title,
         questions: created.questions.map(fromPrismaQuestion),
      });
   } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to create quiz" });
   }
});

router.get("/quizzes", async (req, res) => {
   try {
      const quizzes = await prisma.quiz.findMany({
         include: {
            questions: { orderBy: { order: "asc" } },
         },
         orderBy: { createdAt: "desc" },
      });

      res.json(
         quizzes.map((quiz: { id: any; title: any; questions: Prisma.QuestionModel[]; }) => ({
            id: quiz.id,
            title: quiz.title,
            questions: quiz.questions.map(fromPrismaQuestion),
         }))
      );
   } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch quizzes" });
   }
});

router.get("/quizzes/:id", async (req, res) => {
   const { id } = req.params;

   try {
      const quiz = await prisma.quiz.findUnique({
         where: { id },
         include: {
            questions: { orderBy: { order: "asc" } },
         },
      });

      if (!quiz) {
         return res.status(404).json({ error: "Quiz not found" });
      }

      res.json({
         id: quiz.id,
         title: quiz.title,
         questions: quiz.questions.map(fromPrismaQuestion),
      });
   } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch quiz" });
   }
});

router.delete("/quizzes/:id", async (req, res) => {
   const { id } = req.params;

   try {
      await prisma.quiz.delete({ where: { id } });
      res.status(204).send();
   } catch (err: any) {
      if (err.code === "P2025") {
         return res.status(404).json({ error: "Quiz not found" });
      }

      console.error(err);
      res.status(500).json({ error: "Failed to delete quiz" });
   }
});

export default router;