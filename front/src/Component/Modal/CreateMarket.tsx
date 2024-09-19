import { useState } from "react";
import { numberinput, stringinput } from "../../lib/inputnumber";
import { useQuery } from "@tanstack/react-query";
import serverbase from "../../lib/server";
import errorimg from "../../errorimg.png";

interface IProps {
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const CreateMarket = ({ setModal }: IProps): JSX.Element => {
  const [itemName, setItemName] = useState<string>("");
  const [itemCode, setItemCode] = useState<number>(0);
  const [iconUrl, setIconUrl] = useState<string>("");

  const createmarket = useQuery({
    queryKey: ["createmarket"],
    queryFn: async (): Promise<string> => {
      try {
        if (itemName === "" || itemCode === 0 || iconUrl === "") throw Error("emapy");
        const response = await serverbase.post(`/market`, {
          itemName: itemName,
          itemCode: itemCode,
          icon: iconUrl,
        });
        setModal(false);
        return response.data;
      } catch (error: any) {
        console.log(error.response.data);
        throw new Error("Failed to Create Market");
      }
    },
    enabled: false,
    retry: 0,
  });

  return (
    <>
      <div className="px-8 pb-8">
        <div className="text-center text-2xl font-bold pb-6 pt-4">
          <div>추가할 재료 정보를 입력하세요</div>
        </div>
        <div>
          <div className="flex pb-4 px-[10%]">
            <div className="w-[50%] text-start text-xl font-bold">아이템 이름</div>
            <input
              className="font-bold w-[50%] text-end bg-inputcolor border-dashed border-b border-black"
              value={itemName}
              onChange={(e) => setItemName(stringinput(e.target.value))}
            ></input>
          </div>
        </div>
        <div>
          <div className="flex pb-4 px-[10%]">
            <div className="w-[50%] text-start text-xl font-bold">아이템 코드</div>
            <input
              className="font-bold w-[50%] text-end bg-inputcolor border-dashed border-b border-black"
              value={itemCode < 1 ? "" : itemCode}
              onChange={(e) => setItemCode(numberinput(e.target.value))}
            ></input>
          </div>
        </div>
        <div>
          <div className="flex pb-4 px-[10%]">
            <div className="w-[50%] text-start text-xl font-bold">아이콘 url</div>
            <input
              className="font-bold w-[50%] text-end bg-inputcolor border-dashed border-b border-black"
              value={iconUrl}
              onChange={(e) => setIconUrl(stringinput(e.target.value))}
            ></input>
          </div>
        </div>
        <div className="px-[10%] flex justify-end">
          <img
            className="w-[16rem] h-[16rem]"
            src={iconUrl}
            alt="icon"
            onError={(e) => (e.currentTarget.src = errorimg)}
          />
        </div>
        <div className="flex justify-center gap-4 pt-4">
          <button
            className="text-lg px-3 leading-8 bg-cancelcolor rounded font-bold border-[1px] border-solid border-2 border-black"
            onClick={() => {
              setModal(false);
            }}
          >
            취소
          </button>
          <button
            className="bg-submitcolor px-3 text-lg rounded font-bold border-solid border-[1px] border-black"
            onClick={() => {
              createmarket.refetch();
            }}
          >
            저장
          </button>
        </div>
      </div>
    </>
  );
};

export default CreateMarket;
