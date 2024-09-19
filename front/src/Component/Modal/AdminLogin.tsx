import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import serverbase from "../../lib/server";

interface IProps {
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  setAdmin: React.Dispatch<React.SetStateAction<boolean>>;
}

const AdminLogin = ({ setModal, setAdmin }: IProps): JSX.Element => {
  const [password, setPassword] = useState<string>("");
  const [errormessage, setErrormessage] = useState<string>("");

  const adminlogin = useQuery({
    queryKey: ["adminlogin"],
    queryFn: async (): Promise<string> => {
      try {
        const response = await serverbase.post(`/admin`, {
          password: password,
        });
        setAdmin(true);
        setErrormessage("");
        window.scrollTo(0, 0);
        setModal(false);
        return response.data;
      } catch (error: any) {
        setErrormessage("비밀번호 오류");

        throw new Error("error password");
      }
    },
    enabled: false,
    retry: 0,
  });

  return (
    <div className="pb-40">
      <div className="items-center justify-center flex px-6 w-full text-xl font-bold pt-20">
        <div>비밀번호를 입력하세요</div>
      </div>
      <div className="items-center justify-center flex px-[20%] w-full text-xl font-bold pt-8 gap-4">
        <form
          action=""
          onSubmit={(e) => {
            e.preventDefault();
            adminlogin.refetch();
          }}
        >
          <input
            className="border-solid border-2 flex-1 rounded px-1 mr-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            autoComplete="off"
          />
          <button
            className="bg-layoutcolor text-white rounded px-2 py-1"
            type="button"
            onClick={() => adminlogin.refetch()}
          >
            확인
          </button>
        </form>
      </div>
      {errormessage ? (
        <div className="items-center justify-center flex px-[20%] w-full text-xl text-cancelcolor">
          {errormessage}
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default AdminLogin;
