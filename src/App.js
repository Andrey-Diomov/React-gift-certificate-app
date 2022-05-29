import  Login  from "./page/Login";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Certificate from "./page/Certificate";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/gift-certificate-app" element={<Certificate />} />
          <Route path="/gift-certificate-app/login" element={<Login />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;