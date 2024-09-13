import { useNavigate } from "react-router-dom";

interface IProps {
  admin: boolean;
  setAdmin: React.Dispatch<React.SetStateAction<boolean>>;
}

const Layout = ({ admin, setAdmin }: IProps): JSX.Element => {
  const navigate = useNavigate();

  return (
    <>
      <div className="h-16 bg-layoutcolor text-white items-center justify-between flex px-6 min-w-[60rem]">
        <div className="text-4xl min-w-[20rem] text-start" onClick={() => navigate("/")}>
          로아 제작 계산기
        </div>
        {admin ? (
          <div
            className="text-xl bg-admincolor py-1 px-2 rounded-lg min-w-[9rem]"
            onClick={() => {
              setAdmin(false);
            }}
          >
            관리자 로그아웃
          </div>
        ) : (
          ""
        )}
      </div>
    </>
  );
};

export default Layout;
