interface IProps {
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  modal: boolean;
}

const Footer = ({ setModal, setTitle, modal }: IProps): JSX.Element => {
  return (
    <>
      <div className="min-h-28 pt-4 text-footercolor items-center px-6 text-2xl border-solid border-t-2 border-t-footercolor bg-white m-auto w-11/12 min-w-[60rem] max-w-[90rem]">
        <div className="pb-4 relative">
          <div className="justify-end flex absolute text-xl right-0">
            <button
              onClick={() => {
                setModal(true);
                setTitle("관리자 로그인");
              }}
            >
              관리
            </button>
          </div>
          <div>
            <div>
              개인프로젝트 <br />
              진행자 : 이승배
            </div>
            <div className="pb-4 flex justify-center gap-4">
              <div>깃허브 : </div>
              <div
                className="cursor-pointer"
                onClick={() => {
                  window.open("https://github.com/dpclfk/lostarkcalc");
                }}
              >
                https://github.com/dpclfk/lostarkcalc
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
