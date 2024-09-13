import "./App.css";
import Main from "./Component/Main";
import Footer from "./Component/Footer";
import Layout from "./Component/Layout";
import { Route, Routes } from "react-router-dom";
import Detail from "./Component/Detailitem";
import Admin from "./Component/Admin";
import { useEffect, useState } from "react";
import CreateMarket from "./Component/Modal/CreateMarket";
import ModalTitle from "./Component/Modal/ModalTitle";
import PatchMarket from "./Component/Modal/PatchMarket";
import AdminLogin from "./Component/Modal/AdminLogin";
import GroundEffect from "./Component/Modal/GroundEffect";
import { useQuery } from "@tanstack/react-query";
import serverbase from "./lib/server";

const App = (): JSX.Element => {
  const [modal, setModal] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [admin, setAdmin] = useState<boolean>(false);
  const [ground, setGround] = useState<boolean>(false);
  const [groundEffect, setGroundEffect] = useState<number[]>([
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ]);
  const [recalc, setRecalc] = useState<boolean>(false);

  const admincheck = useQuery({
    queryKey: ["admincheck"],
    queryFn: async (): Promise<{ admin: boolean }> => {
      const response = await serverbase.get(`/admin`);
      return response.data;
    },
  });

  useEffect(() => {
    const localEffect = window.localStorage.getItem("groundEffect");
    if (!localEffect) {
      window.localStorage.setItem(
        "groundEffect",
        JSON.stringify([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
      );
    } else {
      setGroundEffect(JSON.parse(localEffect!));
    }
    setRecalc(false);
  }, [setRecalc, recalc]);

  useEffect(() => {
    if (ground) {
      setTitle("영지효과");
      setModal(true);
    }
  }, [ground]);

  useEffect(() => {
    if (admincheck.data?.admin) {
      setAdmin(true);
    }
  }, [admincheck]);

  return (
    <>
      {modal ? (
        <div>
          <div className="fixed w-[30%] h-[80%] bg-white justify-center mx-[35%] top-[10%] z-30 min-w-[40rem] max-w-[60rem] overflow-auto pb-4">
            <ModalTitle title={title}></ModalTitle>
            {title === "재료 정보 추가" ? (
              <CreateMarket setModal={setModal}></CreateMarket>
            ) : title === "재료 정보 수정 및 삭제하기" ? (
              <PatchMarket setModal={setModal}></PatchMarket>
            ) : title === "관리자 로그인" ? (
              <AdminLogin setModal={setModal} setAdmin={setAdmin}></AdminLogin>
            ) : title === "영지효과" ? (
              <GroundEffect
                setModal={setModal}
                setGround={setGround}
                setRecalc={setRecalc}
              ></GroundEffect>
            ) : (
              ""
            )}
          </div>
          <div
            className="w-full h-full bg-black bg-opacity-25 inset-0 backdrop-blur-md flex fixed justify-center items-center z-20"
            onClick={() => (modal ? (setModal(false), setGround(false)) : "")}
          ></div>
        </div>
      ) : (
        ""
      )}

      <div className={`App bg-bgcolor ${modal ? "overflow-hidden" : ""}`}>
        <Layout admin={admin} setAdmin={setAdmin}></Layout>
        <Routes>
          <Route
            path="/"
            element={<Main admin={admin} setGround={setGround} groundEffect={groundEffect} />}
          />
          <Route
            path="/admin"
            element={<Admin setModal={setModal} setTitle={setTitle} modal={modal} admin={admin} />}
          />
          <Route
            path="/:id"
            element={<Detail admin={admin} setGround={setGround} groundEffect={groundEffect} />}
          />
        </Routes>
        <Footer setModal={setModal} setTitle={setTitle} modal={modal}></Footer>
      </div>
    </>
  );
};

export default App;
