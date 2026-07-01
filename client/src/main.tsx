import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router";

import "./index.css";

import { App } from "./App.tsx";
import { HomePage } from "./pages/HomePage";
import { CreateQuizPage } from "./pages/CreateQuizPage";
import { QuizPage } from "./pages/QuizPage";
import { QuizzesProvider } from "./contexts/quizzesContext.tsx";

createRoot(document.getElementById("root")!).render(
  <QuizzesProvider>
    <Router>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<HomePage />} />
          <Route path="quiz/create" element={<CreateQuizPage />} />
          <Route path="quiz/:id" element={<QuizPage />} />
        </Route>
      </Routes>
    </Router>
  </QuizzesProvider>,
);
