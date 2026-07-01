import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useParams } from "react-router";

import { api } from "@/api/api";

import type { Quiz } from "@/types/Quiz";

import { Container } from "@/components/ui/container";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";

export const QuizPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      navigate("/");
      return;
    }

    api
      .getQuiz(id)
      .then((res) => {
        if (!res) navigate("/");
        setQuiz(res);
      })
      .catch(() => {
        navigate("/");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id, navigate]);

  return (
    <Container>
      {loading ? (
        <Spinner className="w-10! h-10! absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] m-auto" />
      ) : (
        <>
          <h1 className="text-2xl font-bold mb-4">Quiz: {quiz?.title}</h1>
          <div>
            <h2 className="text-center text-xl font-bold">Questions</h2>
            <div>
              {quiz?.questions?.map((q, index) => (
                <div key={q.id ?? index} className="mb-6 rounded-lg border p-4">
                  <h3 className="font-semibold">
                    {index + 1}. {q.question}
                  </h3>

                  {(() => {
                    switch (q.type) {
                      case "boolean":
                        return (
                          <div className="mt-2">
                            <p>Type: True / False</p>
                            <p>
                              <strong>Correct answer:</strong>{" "}
                              {q.answer ? "True" : "False"}
                            </p>
                          </div>
                        );

                      case "input":
                        return (
                          <div className="mt-2">
                            <p>Type: Text input</p>
                            <p>
                              <strong>Correct answer:</strong> {q.answer}
                            </p>
                          </div>
                        );

                      case "checkbox":
                        return (
                          <div className="mt-2">
                            <p>Type: Multiple choice</p>

                            <p className="mt-2 font-medium">Options:</p>

                            <ul className="list-disc pl-5">
                              {q.options.map((option) => (
                                <li key={option}>
                                  {option}
                                  {q.answer.includes(option) && (
                                    <span className="ml-2 text-green-600">
                                      ✓ Correct
                                    </span>
                                  )}
                                </li>
                              ))}
                            </ul>

                            <p className="mt-3">
                              <strong>Correct answers:</strong>{" "}
                              {q.answer.join(", ")}
                            </p>
                          </div>
                        );
                    }
                  })()}
                </div>
              ))}
            </div>
          </div>
          <Button onClick={() => navigate('/')}>Go Back</Button>
        </>
      )}
    </Container>
  );
};
