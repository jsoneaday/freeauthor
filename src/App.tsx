import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./theme/base.css";
import "./theme/components.css";
import "./theme/pages.css";
import "./theme/mdxeditor.css";
import "./theme/layout.css";
import "./theme/animations.css";
import { Explorer } from "./pages/Explorer";
import { Home } from "./pages/Home";
import { WriteStory } from "./pages/write/WriteStory";
import { Read } from "./pages/read/Read";
import { ManageStories } from "./pages/write/ManageStories";
import { Write } from "./pages/write/Write";
import { ReadFollowed } from "./pages/read/ReadFollowed";
import { ReadStory } from "./pages/read/ReadStory";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/write",
    element: <Write />,
    children: [
      {
        path: "new",
        element: <WriteStory />,
      },
      {
        path: "edit/:work_id",
        element: <WriteStory />,
      },
      {
        path: "manage",
        element: <ManageStories />,
      },
    ],
  },
  {
    path: "/read/followed",
    element: <ReadFollowed />,
  },
  {
    path: "/read/:profile_id",
    element: <ReadStory />,
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
