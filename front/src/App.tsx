import "./App.css";
import Main from "./Component/Main";
import Footer from "./Component/Footer";
import Layout from "./Component/Layout";

const App = (): JSX.Element => {
  return (
    <div className="App bg-bgcolor">
      <Layout></Layout>
      <div className="">
        <Main></Main>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default App;
