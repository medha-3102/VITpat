import Login from "./components/auth/login";
import Register from "./components/auth/register";
import DSA from "./components/DSA/dsa";

import Header from "./components/header";
import Planner from "./components/planner";
import Leaderboard from "./components/Leaderboard/leaderboard";

import { AuthProvider } from "./contexts/authContext";
import { useRoutes } from "react-router-dom";

function App() {
  const routesArray = [
    {
      path: "*",
      element: <Login />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/leader",
      element: <Leaderboard />,
    },
    {
      path: "/dsa",
      element: <DSA />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/planner",
      element: <Planner />,
    },
  ];
  let routesElement = useRoutes(routesArray);
  return (
    <AuthProvider>
      <Header />
      <div className="w-full h-screen flex flex-col">{routesElement}</div>
    </AuthProvider>
  );
}

export default App;
