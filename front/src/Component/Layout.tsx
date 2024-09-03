const Layout = (): JSX.Element => {
  return (
    <>
      <div className="h-16 bg-layoutcolor text-white items-center justify-between flex px-6">
        <div className="text-4xl">로아 제작 계산기</div>
        <div className="text-2xl bg-admincolor py-1 px-2 rounded-lg">관리자</div>
      </div>
    </>
  );
};

export default Layout;
