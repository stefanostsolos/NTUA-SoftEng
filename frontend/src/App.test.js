/* When you create a new project with create-react-app it comes with a basic test for App. js component called App. test. js. This is the default nomenclature for tests with Jest, so for every component you create, just add a new file called {YourComponentName}. */ 
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders learn react link", () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
