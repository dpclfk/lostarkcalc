import "./App.css";
import Main from "./Component/Main";
import Footer from "./Component/Footer";
import Layout from "./Component/Layout";
import { Route, Routes } from "react-router-dom";
import Detail from "./Component/Detailitem";
import Admin from "./Component/Admin";
import { useCallback, useEffect, useState } from "react";
import CreateMarket from "./Component/Modal/CreateMarket";
import ModalTitle from "./Component/Modal/ModalTitle";
import PatchMarket from "./Component/Modal/PatchMarket";

const App = (): JSX.Element => {
  const [modal, setModal] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");

  // const mot = useCallback(() => {
  //   console.log(mo);
  //   console.log("tqwr");
  // }, [mo]);

  // useEffect(() => {
  //   console.log("poiu");
  // }, [mo]);

  // const test = [1, 2];

  return (
    <>
      {modal ? (
        <div>
          <div
            className="fixed w-[50%] h-[80%] bg-white justify-center mx-[25%] top-[10%] z-30 min-w-[40rem] max-w-[60rem] overflow-scroll pb-4"
            onClick={() => {}}
          >
            <ModalTitle title={title}></ModalTitle>
            {title === "재료 정보 추가" ? (
              <CreateMarket setModal={setModal}></CreateMarket>
            ) : title === "재료 정보 수정 및 삭제하기" ? (
              <PatchMarket setModal={setModal}></PatchMarket>
            ) : (
              "ss"
            )}
          </div>
          <div
            className="w-full h-full bg-black bg-opacity-25 inset-0 backdrop-blur-md flex fixed justify-center items-center z-20"
            onClick={() => (modal ? setModal(false) : "")}
          ></div>
        </div>
      ) : (
        ""
      )}

      <div className={`App bg-bgcolor ${modal ? "overflow-hidden" : ""}`}>
        <Layout></Layout>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route
            path="/admin"
            element={<Admin setModal={setModal} setTitle={setTitle} modal={modal} />}
          />
          <Route path="/:id" element={<Detail />} />
        </Routes>
        <Footer></Footer>
      </div>
    </>
  );
};

export default App;
