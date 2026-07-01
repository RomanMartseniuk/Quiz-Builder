import { Outlet } from "react-router";
import { Header } from "./components/layout/Header";

export const App = () => {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-20">
        <Outlet />
      </main>
      <footer className="h-10 flex items-center justify-center border-t border-gray-200 bg-secondary">
        <span>
          Created by{" "}
          <a
            target="_blank"
            href="https://linkedin.com/in/roman-martseniuk-14a9b5281/"
            className="underline hover:text-blue-500 transition-colors"
          >
            {" "}
            Roman Martseniuk
          </a>
        </span>
      </footer>
    </>
  );
};
