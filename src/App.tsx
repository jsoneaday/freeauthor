import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./theme/base.css";
import "./theme/components.css";
import "./theme/pages.css";
import { Explorer } from "./pages/Explorer";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Explorer />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
