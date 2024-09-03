const Footer = (): JSX.Element => {
  return (
    <>
      <div className="h-40 text-footercolor items-center px-6 text-2xl border-solid border-t-2 border-t-footercolor bg-white m-auto w-11/12 min-w-[40rem]">
        <div className="py-4">
          <div>개인프로젝트 | 프로젝트 명</div>
          <div className="justify-end flex">
            <div>관리</div>
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
