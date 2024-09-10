interface IProps {
  title: string;
}

const ModalTitle = ({ title }: IProps): JSX.Element => {
  return (
    <>
      <div className="h-16 bg-modalcolor text-white items-center justify-between flex px-6 w-full text-xl font-bold">
        {title}
      </div>
    </>
  );
};

export default ModalTitle;
