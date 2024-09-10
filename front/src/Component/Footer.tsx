interface IProps {
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  modal: boolean;
}

const Footer = ({ setModal, setTitle, modal }: IProps): JSX.Element => {
  return (
    <>
      <div className="h-40 text-footercolor items-center px-6 text-2xl border-solid border-t-2 border-t-footercolor bg-white m-auto w-11/12 min-w-[60rem] max-w-[90rem]">
        <div className="py-4">
          <div>개인프로젝트 | 프로젝트 명</div>
          <div className="justify-end flex">
            <div
              onClick={() => {
                setModal(true);
                setTitle("관리자 로그인");
              }}
            >
              관리
            </div>
          </div>
        </div>
        <div className="pb-4">
          <div>프로젝트 명: lostark calc</div>
        </div>
      </div>
    </>
  );
};

export default Footer;
