import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/HomePage";
import HardPoolPage from "../pages/HardPoolPage";
import SoftPoolPage from "../pages/SoftPoolPage";
import MintPage from "../pages/MintPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "soft-pool",
    element: <SoftPoolPage />,
  },
  {
    path: "hard-pool",
    element: <HardPoolPage />,
  },
  {
    path: "mint",
    element: <MintPage />,
  },
]);

export default router;
