import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import serverbase from "../lib/server";

interface IProps {
  admin: boolean;
  setAdmin: React.Dispatch<React.SetStateAction<boolean>>;
}

const Layout = ({ admin, setAdmin }: IProps): JSX.Element => {
  const navigate = useNavigate();

  const admindelete = useQuery({
    queryKey: ["admincheck"],
    queryFn: async (): Promise<{ admin: boolean }> => {
      const response = await serverbase.delete(`/admin`);
      setAdmin(false);
      return response.data;
    },
    enabled: false,
    retry: 0,
  });

  return (
    <>
      <div className="h-16 bg-layoutcolor text-white items-center justify-between flex px-6 min-w-[60rem]">
        <div className="text-4xl text-start cursor-pointer" onClick={() => navigate("/")}>
          로아 제작 계산기
        </div>
        {admin ? (
          <button
            className="text-xl bg-admincolor py-1 px-2 rounded-lg min-w-[9rem] "
            onClick={() => {
              admindelete.refetch();
            }}
          >
            관리자 로그아웃
          </button>
        ) : (
          ""
        )}
      </div>
    </>
  );
};

export default Layout;
