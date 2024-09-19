import { useEffect, useState } from "react";
import { numberinput, stringinput } from "../../lib/inputnumber";
import { useQuery } from "@tanstack/react-query";
import serverbase from "../../lib/server";
import { Market } from "../Admin";
import errorimg from "../../errorimg.png";

interface IProps {
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
}

interface NewMarket extends Market {
  id: number;
  patchable: boolean;
}

const PatchMarket = ({ setModal }: IProps): JSX.Element => {
  const [itemSearch, setItemSearch] = useState<string>("");
  const [itemName, setItemName] = useState<string>("");
  const [itemCode, setItemCode] = useState<number>(0);
  const [iconUrl, setIconUrl] = useState<string>("");
  const [search, setsearch] = useState<boolean>(false); // 어떤버튼으로 검색했는지
  const [patchItemId, setPatchItemId] = useState<number>(0);
  const [patchItem, setPatchItem] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [patchable, setPatchable] = useState<boolean>(true);
  const [deleteCheck, setDeleteCheck] = useState<boolean>(false);

  const market = useQuery({
    queryKey: ["modalmarket"],
    queryFn: async (): Promise<NewMarket[]> => {
      try {
        if (itemSearch === "" || itemSearch === " ") throw new Error("Empty Item Name");
        const response = await serverbase.get(`/market?search=${itemSearch}`);
        setsearch(true);
        return response.data.marketList;
      } catch (error: any) {
        console.log(error.message);
        throw new Error("Failed to Get List");
      }
    },
    enabled: false,
    retry: 0,
  });

  const patchmarket = useQuery({
    queryKey: ["patchmarket"],
    queryFn: async (): Promise<string> => {
      try {
        if (itemName === "" || itemCode === 0 || iconUrl === "") throw Error("emapy");
        const response = await serverbase.patch(`/market/${patchItemId}`, {
          itemName: itemName,
          itemCode: itemCode,
          icon: iconUrl,
        });
        setModal(false);
        return response.data;
      } catch (error: any) {
        console.log(error.response.data);
        throw new Error("Failed to Get List");
      }
    },
    enabled: false,
    retry: 0,
  });

  const deletemarket = useQuery({
    queryKey: ["deletemarket"],
    queryFn: async (): Promise<string> => {
      try {
        const response = await serverbase.delete(`/market/${patchItemId}`);
        setModal(false);
        return response.data;
      } catch (error) {
        throw new Error("Failed to delete List");
      }
    },
    enabled: false,
    retry: 0,
  });

  useEffect(() => {
    if (market.isLoading) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [market.isLoading]);

  return (
    <div>
      {search ? (
        <div
          className="w-full h-full bg-opacity-25 inset-0 flex fixed justify-center items-center"
          onClick={() => setsearch(false)}
        ></div>
      ) : (
        ""
      )}
      {deleteCheck ? (
        <div>
          <div className="text-center text-2xl font-bold pb-6 pt-12">
            <div className="text-center pb-12">정말 삭제하시겠습니까?</div>
            <div className="flex pb-4 px-[20%]">
              <div className="w-[50%] text-start text-xl font-bold">아이템 이름</div>
              <div className="w-[50%] text-end text-xl font-bold">{itemName}</div>
            </div>
            <div className="flex pb-4 px-[20%]">
              <div className="w-[50%] text-start text-xl font-bold">아이템 코드</div>
              <div className="w-[50%] text-end text-xl font-bold">{itemCode}</div>
            </div>
            <div className="flex pb-4 px-[20%]">
              <div className="w-[50%] text-start text-xl font-bold">아이템 url</div>
              <div className="w-[50%] text-end text-xl font-bold truncate">{iconUrl}</div>
            </div>
            <div className="px-[20%] flex justify-end">
              <img
                className="w-[16rem] h-[16rem]"
                src={iconUrl}
                alt="icon"
                onError={(e) => (e.currentTarget.src = errorimg)}
              />
            </div>
            <div className="flex justify-center gap-8 pt-4">
              <button
                className="text-lg px-3 leading-8 bg-cancelcolor rounded font-bold border-[1px] border-solid border-2 border-black"
                onClick={() => {
                  setDeleteCheck(false);
                }}
              >
                취소
              </button>
              <button
                className="bg-submitcolor px-3 text-lg rounded font-bold border-solid border-[1px] border-black"
                onClick={() => {
                  deletemarket.refetch();
                  setDeleteCheck(false);
                }}
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="px-8">
          <div>
            <div className="text-2xl font-bold text-start pb-4 px-[10%] pt-4">
              <div className="text-center">추가할 재료 정보를 입력하세요</div>
              <div className="text-center pb-4">검색후 수정이 가능합니다</div>
              <div className="pb-2">재료 검색</div>
              <div className="flex justify-center gap-4 font-normal text-xl">
                <div className="flex-1 relative">
                  <input
                    className="border-solid border-2 w-full rounded px-2"
                    type="text"
                    placeholder="거래소"
                    value={itemSearch}
                    onChange={(e) => {
                      setItemSearch(stringinput(e.target.value));
                      setsearch(false);
                    }}
                    onClick={() => setsearch(false)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        market.refetch();
                      }
                    }}
                  />
                  <div className="absolute w-full z-10 max-h-[20rem] overflow-auto">
                    {loading ? (
                      <div className="flex justify-center text-3xl bg-white font-bold">검색중</div>
                    ) : (
                      ""
                    )}
                    {itemSearch && search && market.data?.length! > 0 ? (
                      market.data?.map((item: NewMarket, idx: number) => (
                        <div
                          key={idx}
                          className="bg-white flex border-solid border-b border-footercolor py-2 px-4"
                          onClick={() => {
                            if (item.patchable) {
                              setItemName(item.name);
                              setIconUrl(
                                `https://cdn-lostark.game.onstove.com/efui_iconatlas/${item.icon}`
                              );
                              setsearch(false);
                              setItemCode(item.itemCode);
                              setItemSearch("");
                              setPatchItemId(item.id);
                              setPatchItem(item.name);
                              setPatchable(true);
                            } else {
                              setsearch(false);
                              setPatchable(false);
                              setPatchItem(item.name);
                              setPatchItemId(0);
                            }
                          }}
                        >
                          <div>
                            <img
                              src={`https://cdn-lostark.game.onstove.com/efui_iconatlas/${item.icon}`}
                              alt="item"
                              onError={(e) => (e.currentTarget.src = errorimg)}
                              className="w-12 h-12"
                            />
                          </div>
                          <div className="p-2 px-4">{item.name}</div>
                        </div>
                      ))
                    ) : market.data?.length === 0 ? (
                      <div className="flex justify-center bg-white border-solid border-b border-footercolor text-2xl">
                        <div>nodata</div>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
                <button
                  className="bg-layoutcolor text-white rounded px-3 py-1 w-[5rem] h-[2.05rem] z-10"
                  onClick={() => {
                    market.refetch();
                  }}
                >
                  검색
                </button>
              </div>
            </div>

            <div className="text-center text-2xl font-bold pb-6">
              {patchable ? (
                ""
              ) : (
                <div className="pt-4">
                  {patchItem} 아이템은 <br />
                  수정 및 삭제가 불가능합니다.
                </div>
              )}
              {patchItemId ? (
                <div className="pt-4">현재 {patchItem} 아이템을 수정중입니다.</div>
              ) : (
                ""
              )}
            </div>
            {patchItemId ? (
              <div>
                <div>
                  <div className="flex pb-4 px-[10%] justify-evenly">
                    <div className="w-[50%] text-start text-xl font-bold">아이템 이름</div>
                    <div className="w-[50%] flex relative justify-end">
                      <input
                        className="font-bold w-full text-end bg-inputcolor border-dashed border-b border-black px-2"
                        value={itemName}
                        onChange={(e) => setItemName(stringinput(e.target.value))}
                      ></input>
                      <div
                        className="absolute end right-[-4rem] px-2 text-white leading-7 bg-cancelcolor"
                        onClick={() => {
                          setDeleteCheck(true);
                        }}
                      >
                        삭제
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex pb-4 px-[10%]">
                    <div className="w-[50%] text-start text-xl font-bold">아이템 코드</div>
                    <input
                      className="font-bold w-[50%] text-end bg-inputcolor border-dashed border-b border-black px-2"
                      value={itemCode < 1 ? "" : itemCode}
                      onChange={(e) => setItemCode(numberinput(e.target.value))}
                    ></input>
                  </div>
                </div>
                <div>
                  <div className="flex pb-4 px-[10%]">
                    <div className="w-[50%] text-start text-xl font-bold">아이콘 url</div>
                    <input
                      className="font-bold w-[50%] text-end bg-inputcolor border-dashed border-b border-black px-2"
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
                      patchmarket.refetch();
                    }}
                  >
                    저장
                  </button>
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      )}
    </div>
  );
};
export default PatchMarket;
