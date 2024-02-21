import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./theme/base.css";
import "./theme/components.css";
import "./theme/pages.css";
import "./theme/mdxeditor.css";
import "./theme/layout.css";
import "./theme/animations.css";
import { Explorer } from "./pages/Explorer";
import { Home } from "./pages/Home";
import { Write } from "./pages/Write";
import { Read } from "./pages/Read";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/write",
    element: <Write />,
  },
  {
    path: "/read",
    element: <Read />,
  },
  {
    path: "/explore",
    element: <Explorer />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
