import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import serverbase from "../lib/server";
import { CateList, List } from "./Main";
import { Detailitem } from "./Detailitem";
import { numberinput, stringinput } from "../lib/inputnumber";
import gold from "../gold.png";
import { useNavigate, useSearchParams } from "react-router-dom";
import errorimg from "../errorimg.png";

export interface Market {
  name: string;
  icon: string;
  itemCode: number;
}

interface IProps {
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  modal: boolean;
  admin: boolean;
}

const Admin = ({ setModal, setTitle, modal, admin }: IProps): JSX.Element => {
  const [recipe, setRecipe] = useState<string>(""); // 최상단 아이템 이름 검색버튼
  const [recipeSearch, setRecipeSearch] = useState<boolean>(false); // 어떤버튼으로 검색했는지
  const [marketSearch, setMarketSearch] = useState<boolean>(false); // 어떤버튼으로 검색했는지
  const [itemId, setItemId] = useState<number>(0); // 디테일 아이템 불러오기 및 수정할때 사용
  const [create, setCreate] = useState<boolean>(true); // 레시피 불러오면 수정모드
  const [itemCode, setItemCode] = useState<number>(0); // 오픈 api에 저장된 아이템 코드
  const [itemName, setItemName] = useState<string>(""); // 아이템 이름
  const [createinfo, setCreateinfo] = useState<number[]>([0, 0, 0, 0]); // 제작단위, 활동력, 제작시간, 카테고리
  const [icon, setIcon] = useState<string>(""); // 아이콘 url
  const [cate, setCate] = useState<CateList[]>([{ id: 0, categoryName: "관심" }]); // 카테고리 불러오기
  const [marketName, setMarketName] = useState<string>(""); // 거래소에서 재료 검색
  const [ingredientName, setIngredientName] = useState<string>(""); // 거래소에서 재료 검색했을때 재료이름
  const [ingredientIcon, setIngredientIcon] = useState<string>(""); // 거래소에서 재료 검색했을때 아이콘
  const [ingredientNumber, setIngredientNumber] = useState<number>(0); // 제작시 필요한 갯수
  const [cost, setcost] = useState<number>(0); // 만들때 골드 수수료
  const [ingredientSearch, setIngredientSearch] = useState<boolean>(false); // 재료검색 버튼시 사용
  const [ingredientInfo, setIngredientInfo] = useState<
    { name: string; number: number; icon: string }[]
  >([]); // 하위 재료 정보
  const [detailCheck, setDetailCheck] = useState<boolean>(false);

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const nowid = searchParams.get("id");

  // 레시피 검색했을때 이걸로 아이템명 및 아이콘 리스트 띄워줌
  const list = useQuery({
    queryKey: ["list"],
    queryFn: async (): Promise<List[]> => {
      try {
        if (recipe === "" || recipe === " ") throw new Error("Empty Item Name");
        setRecipeSearch(true);
        setMarketSearch(false);
        const response = await serverbase.get(`/list?search=${recipe}`);
        return response.data;
      } catch (error: any) {
        console.log(error.message);
        throw new Error("Failed to Get List");
      }
    },
    enabled: false,
  });
  //
  const detailitem = useQuery({
    queryKey: ["detail"],
    queryFn: async (): Promise<Detailitem> => {
      try {
        if (!itemId || itemId === 0) throw new Error("Failed to Get Detail Item");
        const response = await serverbase.get(`/detailitem/${itemId}`);
        return response.data;
      } catch (error: any) {
        throw new Error("Failed to Get Detail Item");
      }
    },
    enabled: false,
    retry: 0,
  });

  const catelist = useQuery({
    queryKey: ["category"],
    queryFn: async (): Promise<CateList[]> => {
      try {
        const catelist = await serverbase.get("/category");
        return catelist.data;
      } catch (error: any) {
        console.log(error.message);
        throw new Error("Failed to Get List");
      }
    },
  });

  const market = useQuery({
    queryKey: ["market"],
    queryFn: async (): Promise<Market[]> => {
      try {
        if (recipe === "" || recipe === " ") throw new Error("Empty Item Name");
        setRecipeSearch(false);
        setMarketSearch(true);
        const response = await serverbase.get(`/market?search=${recipe}`);
        return response.data.marketList;
      } catch (error: any) {
        console.log(error.message);
        throw new Error("Failed to Get List");
      }
    },
    enabled: false,
    retry: 0,
  });

  const ingredient = useQuery({
    queryKey: ["ingredient"],
    queryFn: async (): Promise<Market[]> => {
      try {
        if (marketName === "" || marketName === " ") throw new Error("Empty Item Name");
        setRecipeSearch(false);
        setMarketSearch(false);
        setIngredientSearch(true);
        const response = await serverbase.get(`/market?search=${marketName}`);
        return response.data.marketList;
      } catch (error: any) {
        console.log(error.message);
        throw new Error("Failed to Get List");
      }
    },
    enabled: false,
    retry: 0,
  });

  // 레시피 추가하기
  const createrecipe = useQuery({
    queryKey: ["createrecipe"],
    queryFn: async (): Promise<number> => {
      try {
        if (
          itemName === "" ||
          itemCode === 0 ||
          createinfo[0] === 0 ||
          createinfo[1] === 0 ||
          createinfo[2] === 0 ||
          createinfo[3] === 0 ||
          icon === ""
        ) {
          throw Error("empty");
        } else {
          const ingredientarr: { itemName: string; ingredientCount: number }[] = [];
          for (let i = 0; i < ingredientInfo.length; i++) {
            ingredientarr.push({
              itemName: ingredientInfo[i].name,
              ingredientCount: ingredientInfo[i].number,
            });
          }
          if (create) {
            const recipe = await serverbase.post("/recipe", {
              itemName: itemName,
              itemCode: itemCode,
              createBundle: createinfo[0],
              energy: createinfo[1],
              createTime: createinfo[2],
              cost: cost,
              category: cate[createinfo[3] - 1].categoryName,
              icon: icon,
              ingredient: ingredientarr,
            });
            navigate(`/${recipe.data.itemId}`);
            return recipe.data;
          } else {
            const recipe = await serverbase.patch(`/recipe/${itemId}`, {
              itemName: itemName,
              itemCode: itemCode,
              createBundle: createinfo[0],
              energy: createinfo[1],
              createTime: createinfo[2],
              cost: cost,
              category: cate[createinfo[3] - 1].categoryName,
              icon: icon,
              ingredient: ingredientarr,
            });
            navigate(`/${recipe.data.itemId}`);
            return recipe.data;
          }
        }
      } catch (error: any) {
        console.log(error.message);
        throw new Error("Failed to Get List");
      }
    },
    enabled: false,
    retry: 0,
  });

  useEffect(() => {
    if (catelist.data) setCate([...catelist.data]);
  }, [catelist.data]);

  useEffect(() => {
    setDetailCheck(true);
  }, [setDetailCheck, itemId]);

  useEffect(() => {
    if (detailCheck) {
      detailitem.refetch();
      setDetailCheck(false);
    }
  }, [detailCheck, detailitem, setDetailCheck]);

  useEffect(() => {
    if (detailitem.data) {
      const iteminfo = detailitem.data.creation;
      const ingredientinfo = detailitem.data.ingredient;
      setItemCode(iteminfo.itemCode);
      setItemName(iteminfo.itemName);
      setCreateinfo([
        iteminfo.createBundle,
        iteminfo.energy,
        iteminfo.createTime,
        iteminfo.categoryId,
      ]);
      setIcon(`https://cdn-lostark.game.onstove.com/efui_iconatlas/${iteminfo.icon}`);
      let ingredient: { name: string; number: number; icon: string }[] = [];
      for (let i = 0; i < ingredientinfo.length; i++) {
        ingredient.push({
          name: ingredientinfo[i].itemName,
          number: ingredientinfo[i].ingredientCount,
          icon: ingredientinfo[i].icon,
        });
      }
      setIngredientInfo(ingredient);
      setcost(iteminfo.createCost);
      setCreate(false);
    }
  }, [detailitem.data]);

  const statereset = useCallback(() => {
    setItemCode(0);
    setItemName("");
    setCreateinfo([0, 0, 0, 0]);
    setIcon("");
    setcost(0);
    setIngredientInfo([]);
    setCreate(true);
    setSearchParams("");
    setMarketName("");
    setRecipe("");
    setIngredientName("");
    setIngredientIcon("");
    setIngredientNumber(0);
  }, [setSearchParams]);

  useEffect(() => {
    if (nowid) {
      setItemId(+nowid);
    } else {
      statereset();
    }
  }, [nowid, statereset]);

  useEffect(() => {
    if (list.data?.length! < 1) setRecipeSearch(false);
  }, [list.data]);
  useEffect(() => {
    if (market.data?.length! < 1) setMarketSearch(false);
  }, [market.data]);
  useEffect(() => {
    if (ingredient.data?.length! < 1) setIngredientSearch(false);
  }, [ingredient.data]);

  useEffect(() => {
    if (!admin) {
      navigate("/");
    }
  }, [admin, navigate]);

  return (
    <>
      <div className={`${modal ? "overflow-hidden" : ""}`}>
        {recipeSearch || marketSearch || ingredientSearch ? (
          <div
            className="w-full h-full bg-opacity-25 inset-0 flex fixed justify-center items-center"
            onClick={() => {
              setRecipeSearch(false);
              setMarketSearch(false);
              setIngredientSearch(false);
              // setRecipe("");
              // setMarketName("");
            }}
          ></div>
        ) : (
          ""
        )}
        <div className="m-auto w-11/12 min-w-[60rem] max-w-[90rem]">
          <div>
            <div className="flex justify-center bg-white p-4 mt-4 gap-4">
              <div className="flex-1 relative">
                <input
                  className="border-solid border-2 w-full h-full rounded px-1"
                  value={recipe}
                  type="text"
                  placeholder="아이템 이름"
                  onChange={(e) => setRecipe(e.target.value.replace(/ +(?= )/g, ""))}
                  onClick={() => {
                    setRecipeSearch(false);
                    setMarketSearch(false);
                    setIngredientSearch(false);
                  }}
                />
                <div className="fixed w-full absolute shadow-lg z-10">
                  {recipe && recipeSearch ? (
                    list.data?.map((item: List, idx: number) => (
                      <div
                        key={idx}
                        className="bg-white flex border-solid border-b border-footercolor py-2 px-4 z-10 hover:bg-hovercolor cursor-pointer"
                        onClick={() => {
                          setItemId(item.id);
                          setRecipeSearch(false);
                          setRecipe("");
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
                        <div className="p-2 px-4">{item.itemName}</div>
                      </div>
                    ))
                  ) : recipe && marketSearch ? (
                    market.data?.map((item: Market, idx: number) => (
                      <div
                        key={idx}
                        className="bg-white flex border-solid border-b border-footercolor py-2 px-4 hover:bg-hovercolor cursor-pointer"
                        onClick={() => {
                          setMarketSearch(false);
                          setRecipe("");
                          setItemCode(item.itemCode);
                          setItemName(item.name);
                          setCreateinfo([0, 0, 0, 0]);
                          setIcon(
                            `https://cdn-lostark.game.onstove.com/efui_iconatlas/${item.icon}`
                          );
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
                  ) : (
                    <div></div>
                  )}
                </div>
              </div>
              <button
                className="bg-layoutcolor text-white rounded px-3 py-1 w-28 z-10"
                onClick={() => {
                  list.refetch();
                }}
              >
                레시피 검색
              </button>
              <button
                className="bg-layoutcolor text-white rounded px-3 py-1 w-28 z-10"
                onClick={() => {
                  market.refetch();
                }}
              >
                거래소 검색
              </button>

              {/* 상단 ui끝 */}
            </div>
          </div>
          <div className="bg-white py-4 mt-4 justify-start flex px-4 flex justify-center gap-4">
            <input
              className="font-bold w-[20%] text-end bg-inputcolor border-dashed border-b border-black"
              type="text"
              placeholder="아이템코드"
              value={itemCode < 1 ? "" : itemCode}
              onChange={(e) => setItemCode(numberinput(e.target.value))}
            />
            <input
              className="font-bold w-[30%] text-end bg-inputcolor border-dashed border-b border-black"
              type="text"
              placeholder="아이템 명"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            {/* 아이템 수정인지 생성인지 확인시켜주는 div */}
            <div>{create ? <div>생성중입니다</div> : <div>수정중입니다</div>}</div>
          </div>

          <div className="flex justify-between mt-4">
            {/* 제작정보 */}
            <div className="bg-white min-w-[49%] p-4">
              <div className="text-2xl font-bold text-start pb-4">제작정보</div>
              <div className="flex pb-4">
                <div className="w-[50%] text-start">제작 단위</div>
                <input
                  className="font-bold w-[50%] text-end bg-inputcolor border-dashed border-b border-black"
                  value={createinfo[0] < 1 ? "" : createinfo[0]}
                  onChange={(e) => {
                    setCreateinfo((state) => {
                      state[0] = numberinput(e.target.value);
                      return [...state];
                    });
                  }}
                ></input>
              </div>
              <div className="flex pb-4">
                <div className="w-[50%] text-start">활동력</div>
                <input
                  className="font-bold w-[50%] text-end bg-inputcolor border-dashed border-b border-black"
                  value={createinfo[1] < 1 ? "" : createinfo[1]}
                  onChange={(e) => {
                    setCreateinfo((state) => {
                      state[1] = numberinput(e.target.value);
                      return [...state];
                    });
                  }}
                ></input>
              </div>
              <div className="flex pb-4">
                <div className="w-[50%] text-start">제작시간</div>
                <input
                  className="font-bold w-[50%] text-end bg-inputcolor border-dashed border-b border-black"
                  value={createinfo[2] < 1 ? "" : createinfo[2]}
                  onChange={(e) => {
                    setCreateinfo((state) => {
                      state[2] = numberinput(e.target.value);
                      return [...state];
                    });
                  }}
                ></input>
              </div>
              <div className="flex pb-4">
                <div className="w-[50%] text-start">카테고리</div>
                <input
                  className="font-bold w-[50%] text-end bg-inputcolor border-dashed border-b border-black"
                  value={
                    createinfo[3] < 1 || createinfo[3] > cate.length
                      ? ""
                      : cate[createinfo[3] - 1].categoryName
                  }
                  onChange={(e) => {
                    setCreateinfo((state) => {
                      state[3] = numberinput(e.target.value);
                      return [...state];
                    });
                  }}
                ></input>
              </div>
              <div className="flex pb-4">
                <div className="w-[50%] text-start">아이콘 url</div>
                <input
                  className="font-bold w-[50%] text-end bg-inputcolor border-dashed border-b border-black"
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                ></input>
              </div>
              <div>
                <img
                  className="w-40 h-40"
                  src={icon}
                  onError={(e) => (e.currentTarget.src = errorimg)}
                  alt="icon"
                />
              </div>
            </div>
            {/* 제작정보 끝, 재료검색 */}
            <div className="bg-white min-w-[49%] p-4">
              <div className="text-2xl font-bold text-start pb-4">재료 검색</div>
              {/* 재료 추가 상단 */}
              <div>
                <div>
                  <div className="flex justify-center bg-white pb-4 gap-4">
                    <div className="relative flex-1">
                      <input
                        className="border-solid border-2 w-full rounded px-1 h-full"
                        type="text"
                        placeholder="거래소"
                        value={marketName}
                        onChange={(e) => {
                          setMarketName(stringinput(e.target.value));
                          setIngredientSearch(false);
                        }}
                        onClick={() => {
                          setRecipeSearch(false);
                          setMarketSearch(false);
                          setIngredientSearch(false);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            ingredient.refetch();
                          }
                        }}
                      />
                      <div>
                        <div className="w-full absolute shadow-lg">
                          {marketName && ingredientSearch
                            ? ingredient.data?.map((item: Market, idx: number) => (
                                <div
                                  key={idx}
                                  className="bg-white flex border-solid border-b border-footercolor py-2 px-4 z-10 hover:bg-hovercolor cursor-pointer"
                                  onClick={() => {
                                    setIngredientName(item.name);
                                    setIngredientIcon(
                                      `https://cdn-lostark.game.onstove.com/efui_iconatlas/${item.icon}`
                                    );
                                    setIngredientSearch(false);
                                    setMarketName("");
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
                            : ""}
                        </div>
                      </div>
                    </div>
                    <button
                      className="bg-layoutcolor text-white rounded px-3 py-1 w-[4rem] z-10"
                      onClick={() => {
                        ingredient.refetch();
                      }}
                    >
                      검색
                    </button>
                  </div>
                </div>
                <div className="py-4">
                  <button
                    className="text-xl font-bold hover:bg-hovercolor"
                    onClick={() => {
                      setModal(true);
                      setTitle("재료 정보 추가");
                    }}
                  >
                    재료 정보 추가하기
                  </button>
                </div>
                <div className="pb-4">
                  <button
                    className="hover:bg-hovercolor text-xl font-bold"
                    onClick={() => {
                      setModal(true);
                      setTitle("재료 정보 수정 및 삭제하기");
                    }}
                  >
                    재료 정보 수정 및 삭제하기
                  </button>
                </div>
              </div>
              {/* 재료추가 하단 */}
              <div className="border-solid border-t border-footercolor pt-4">
                <div className="text-2xl font-bold text-start pb-4">재료 추가</div>
                <div className="flex pb-4">
                  <div className="w-[50%] text-start py-1">재료명</div>
                  <div className="font-bold w-[50%] text-end flex justify-between">
                    <div>
                      <img
                        src={ingredientIcon}
                        alt="item"
                        className="w-8 h-8"
                        onError={(e) => (e.currentTarget.src = errorimg)}
                      />
                    </div>
                    <div className="py-1">{ingredientName}</div>
                  </div>
                </div>
                <div className="flex pb-4">
                  <div className="w-[50%] text-start">필요개수</div>
                  <input
                    className="font-bold w-[50%] text-end bg-inputcolor border-dashed border-b border-black"
                    value={ingredientNumber < 1 ? "" : ingredientNumber}
                    onChange={(e) => setIngredientNumber(numberinput(e.target.value))}
                  ></input>
                </div>
                {/* <div className="flex pb-4">
                <div className="w-[50%] text-start">판매단위</div>
                <div className="font-bold w-[50%] text-end">1(t)</div>
              </div> */}
                <div className="flex justify-end pt-4">
                  <button
                    className="bg-submitcolor rounded border border-solid border-layoutcolor px-3 py-1"
                    onClick={() => {
                      if (
                        ingredientName !== "" &&
                        ingredientNumber !== 0 &&
                        ingredientIcon !== ""
                      ) {
                        setIngredientInfo([
                          ...ingredientInfo,
                          {
                            name: ingredientName,
                            number: ingredientNumber,
                            icon: ingredientIcon.slice(
                              "https://cdn-lostark.game.onstove.com/efui_iconatlas/".length
                            ),
                          },
                        ]);
                        setIngredientName("");
                        setIngredientNumber(0);
                        setIngredientIcon("");
                      }
                    }}
                  >
                    추가
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 mt-4">
            <div className="text-2xl font-bold text-start pb-4">재료정보</div>
            <div className="flex px-4 pb-2">
              <div className="flex-1 text-start">재료</div>
              <div className="w-[30%] text-end pr-2">필요개수</div>
              <div className="w-[30%] text-end">재료 삭제</div>
              {/* <div className="w-[15%] text-end">시세</div>
            <div className="w-[15%] text-end">단가</div>
            <div className="w-[15%] text-end">합계</div> */}
            </div>
            {/* 받아온 재료정보 맵으로 */}
            <div>
              {ingredientInfo.map((item, idx) => (
                <div className="flex px-4 border-solid border-t border-footercolor z-10" key={idx}>
                  <div className="flex-1 text-start flex">
                    <img
                      className="w-12 h-12"
                      src={`https://cdn-lostark.game.onstove.com/efui_iconatlas/${item.icon}`}
                      onError={(e) => (e.currentTarget.src = errorimg)}
                      alt="in"
                    />
                    <div className="py-2 pl-4 text-lg leading-8">{item.name}</div>
                  </div>
                  <div className="py-2 font-bold text-lg pl-12 leading-8 w-[30%] flex justify-end">
                    <input
                      className="font-bold text-end bg-inputcolor border-dashed border-b border-black text-lg px-2"
                      type="text"
                      value={item.number < 0 ? "" : item.number}
                      onChange={(e) =>
                        setIngredientInfo((state) => {
                          state[idx].number = numberinput(e.target.value);
                          return [...state];
                        })
                      }
                    />
                  </div>
                  <div className="w-[30%] text-end py-2 font-bold text-lg leading-8">
                    <button
                      className="text-lg px-2 text-white leading-8 bg-cancelcolor"
                      onClick={() => {
                        setIngredientInfo((state) => {
                          state.splice(idx, 1);
                          return [...state];
                        });
                      }}
                    >
                      삭제
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex px-4 border-solid border-t border-footercolor">
              <div className="flex-1 text-start flex">
                <img
                  className="w-12 h-12"
                  src={gold}
                  alt="ingredient"
                  onError={(e) => (e.currentTarget.src = errorimg)}
                />
                <div className="py-2 pl-4 text-lg leading-8">골드</div>
              </div>
              <div className="py-2 font-bold text-lg pl-12 leading-8 w-[30%] flex justify-end">
                <input
                  className="font-bold text-end bg-inputcolor border-dashed border-b border-black text-lg px-2"
                  type="text"
                  value={cost < 0 ? "" : cost}
                  onChange={(e) => setcost(numberinput(e.target.value))}
                />
              </div>
              <div className="w-[30%] text-end py-2 font-bold text-lg leading-8">
                <button
                  className="text-lg px-2 text-white leading-8 bg-cancelcolor"
                  onClick={() => setcost(0)}
                >
                  삭제
                </button>
              </div>
            </div>
            <div className="flex justify-end font-bold border-solid border-t border-footercolor pt-4 gap-4 px-4">
              <button
                className="text-lg px-2 leading-8 bg-cancelcolor"
                onClick={() => {
                  statereset();
                }}
              >
                초기화
              </button>
              <button
                className="bg-submitcolor px-4 text-lg leading-8"
                onClick={() => createrecipe.refetch()}
              >
                저장
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Admin;
