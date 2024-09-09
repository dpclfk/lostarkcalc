import "./App.css";
import Main from "./Component/Main";
import Footer from "./Component/Footer";
import Layout from "./Component/Layout";
import { Route, Routes } from "react-router-dom";
import Detail from "./Component/Detailitem";
import Admin from "./Component/Admin";
import { useCallback, useEffect, useState } from "react";

const App = (): JSX.Element => {
  const [mo, setmo] = useState<boolean>(false);
  const mot = useCallback(() => {
    console.log(mo);
    console.log("tqwr");
  }, [mo]);

  useEffect(() => {
    console.log("poiu");
  }, [mo]);

  // const test = [1, 2];

  return (
    <div className="App bg-bgcolor">
      <Layout></Layout>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/admin" element={<Admin test={setmo} mo={mo} />} />
        <Route path="/:id" element={<Detail />} />
      </Routes>
      <Footer></Footer>
    </div>
  );
};

export default App;
