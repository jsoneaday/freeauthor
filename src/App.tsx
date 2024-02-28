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
import { ManageStories } from "./pages/ManageStories";
import { WriteMngStories } from "./pages/WriteMngStories";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/write",
    element: <WriteMngStories />,
    children: [
      {
        path: "new",
        element: <Write />,
      },
      {
        path: "edit/:work_id",
        element: <Write />,
      },
      {
        path: "manage",
        element: <ManageStories />,
      },
    ],
  },
  {
    path: "/read",
    element: <Read />,
    children: [
      {
        path: "/read/:profile_id",
        element: <Read />,
      },
    ],
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
