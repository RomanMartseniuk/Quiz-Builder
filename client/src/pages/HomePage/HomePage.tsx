import { DeleteAlert } from "@/components/common/DeleteAlert";
import { Container } from "@/components/ui/container";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemTitle,
} from "@/components/ui/item";
import { Spinner } from "@/components/ui/spinner";
import { useQuizzes } from "@/hooks/useQuizzes";
import { Link } from "react-router";

export const HomePage = () => {
  const { quizzes, loading, error } = useQuizzes();
  return (
    <Container>
      {loading || error ? (
        <Spinner className="w-10! h-10! absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] m-auto" />
      ) : (
        <>
          <div>
            {quizzes.length === 0 ? (
              <>There is no quizzes now</>
            ) : (
              <>
                {quizzes.map((quiz) => (
                  <Item key={quiz.id} variant="outline">
                    <ItemContent>
                      <Link to={`/quiz/${quiz.id}`}>
                        <ItemTitle className="underline hover:text-blue-500 transition-colors">
                          {quiz.title}
                        </ItemTitle>
                      </Link>
                    </ItemContent>
                    <ItemActions>
                      <DeleteAlert id={quiz.id} />
                    </ItemActions>
                  </Item>
                ))}
              </>
            )}
          </div>
        </>
      )}
    </Container>
  );
};
