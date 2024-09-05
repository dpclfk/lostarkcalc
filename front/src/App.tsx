import "./App.css";
import Main from "./Component/Main";
import Footer from "./Component/Footer";
import Layout from "./Component/Layout";
import { Route, Routes } from "react-router-dom";
import Detail from "./Component/Detailitem";

const App = (): JSX.Element => {
  return (
    <div className="App bg-bgcolor">
      <Layout></Layout>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/:id" element={<Detail />} />
      </Routes>
      <Footer></Footer>
    </div>
  );
};

export default App;
