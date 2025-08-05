import "./App.css";
import "@/assets/style/globals.css";
import { HashRouter, Routes, Route } from "react-router-dom";
Home
import Home from "./pages/home";
import User from "./pages/user";

const App: React.FC = () => {

  return (
    <>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/user" element={<User />} />
        </Routes>
      </HashRouter>
    </>
  );
};

export default App;
