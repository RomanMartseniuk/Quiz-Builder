// src/test-db.ts
import "dotenv/config";
import { prisma } from "./prisma";

async function main() {
   const quiz = await prisma.quiz.create({
      data: { title: "Test quiz" },
   });
   console.log(quiz);
}

main().finally(() => prisma.$disconnect());