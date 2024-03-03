import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./theme/base.css";
import "./theme/components.css";
import "./theme/pages.css";
import "./theme/mdxeditor.css";
import "./theme/layout.css";
import "./theme/animations.css";
import { Explorer } from "./pages/explorer/Explorer";
import { WriteStory } from "./pages/write/WriteStory";
import { ManageStories } from "./pages/write/ManageStories";
import { Write } from "./pages/write/Write";
import { ReadFollowed } from "./pages/read/ReadFollowed";
import { ReadStory } from "./pages/read/ReadStory";
import { Read } from "./pages/read/Read";
import { Profile } from "./pages/Profile";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Explorer />,
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
        path: "edit/:work_id/:validation_msg?",
        element: <WriteStory />,
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
        path: "followed",
        element: <ReadFollowed />,
      },
      {
        path: ":work_id",
        element: <ReadStory />,
      },
    ],
  },
  {
    path: "/explorer/:topic_id?",
    element: <Explorer />,
  },
  {
    path: "/profile/:profile_id",
    element: <Profile />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
