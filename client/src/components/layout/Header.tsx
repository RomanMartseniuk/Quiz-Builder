import { Link } from "react-router";

import { Container } from "../ui/container";
import { Button } from "../ui/button";

export const Header = () => {
  return (
    <header className="fixed w-screen z-50 flex items-center justify-center bg-white border-b border-gray-200">
      <Container className="h-12.5 flex items-center justify-between">
        <Link to="/">
          <h1 className="underline hover:text-blue-500 transition-colors">Quiz Builder</h1>
        </Link>
        {/* <Field orientation="horizontal" className="max-w-[40%]">
          <Input
            id="search-input"
            className=""
            type="search"
            placeholder="Search..."
            aria-invalid="false"
          />
          <Button>Search</Button>
        </Field> */}
        <Link to='quiz/create'>
         <Button>Create New</Button>
        </Link>
      </Container>
    </header>
  );
};
