import "./App.css";

import Footer from "./components/Footer";
import Main from "./components/Main";
import { useState } from "react";

function App() {
  const [val, setVal] = useState("");

  return (
    <div className="App">
      <Main recipeData={val} />

      <Footer />
    </div>
  );
}

export default App;
