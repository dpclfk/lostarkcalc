import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Lastreq } from "../lib/listaxios";
import serverbase from "../lib/server";
import { useEffect, useState } from "react";

export interface List {
  id: number;
  itemName: string;
  currentMinPrice: number;
  ingredientAllCost: number;
  createCost: number;
  enargy: number;
  createBundle: number;
  categoryId: number;
  icon: string;
}

export interface CateList {
  id: number;
  categoryName: string;
}

const Main = (): JSX.Element => {
  const admin = false;

  const [category, setcategory] = useState<number[]>([]);
  const [search, setsearch] = useState<string>("");

  const cate: { id: number; categoryName: string }[] = [
    { id: 0, categoryName: "관심" },
    { id: 1, categoryName: "배틀아이템" },
    { id: 2, categoryName: "요리" },
    { id: 3, categoryName: "생활도구" },
    { id: 4, categoryName: "특수" },
  ];

  const queryclient = useQueryClient();

  const list = useQuery({
    queryKey: ["list"],
    queryFn: async (): Promise<List[]> => {
      try {
        const response = await serverbase.get(
          `/list?${category ? `category=${category}&` : ""}search=${search}`
        );
        return response.data;
      } catch (error: any) {
        console.log(error.message);
        throw new Error("Failed to Get List");
      }
    },
  });

  const { data } = useQuery({
    queryKey: ["lastreq"],
    queryFn: Lastreq,
  });

  useEffect(() => {
    queryclient.invalidateQueries({ queryKey: ["list"] });
    queryclient.invalidateQueries({ queryKey: ["lastreq"] });
  }, [category, search]);

  return (
    <div className="m-auto w-11/12 min-w-[40rem]">
      <div className="mt-8 h-auto bg-white">
        <div className="mx-3">
          <div className="flex text-xl py-2 justify-between">
            <div className="flex gap-4">
              <div className="lpx-2 py-1">제작 계산기</div>
              <button className="bg-layoutcolor text-white rounded px-2 py-1">영지효과</button>
            </div>
            {admin ? (
              <button className="bg-admincolor text-white text-center rounded px-2 py-1">
                레시피 추가
              </button>
            ) : (
              ""
            )}
          </div>
          <div className="flex text-footercolor rounded">{data}</div>
        </div>
        <div className="mx-3 py-2 flex gap-4">
          <input
            className="border-solid border-2 flex-1 rounded px-1"
            type="text"
            placeholder="레시피"
            value={search}
            onChange={(e) => setsearch(e.target.value)}
          />
          <button
            className="bg-layoutcolor text-white rounded px-4 py-1"
            onClick={() => {
              queryclient.invalidateQueries({ queryKey: ["list"] });
            }}
          >
            검색
          </button>
        </div>
        <div className="flex">
          {cate === undefined || cate?.length === 0
            ? ""
            : cate?.map((item, idx) => (
                <div
                  key={idx}
                  className={`m-auto py-4 border-solid border-b-2 ${
                    category.indexOf(item.id) === -1 ? "border-white" : "border-layoutcolor"
                  }`}
                  onClick={() => {
                    category.indexOf(item.id) === -1
                      ? setcategory([...category, item.id])
                      : setcategory(category.filter((element) => element !== item.id));
                  }}
                >
                  <div>{item.categoryName}</div>
                </div>
              ))}
        </div>
      </div>
      <div className="mt-8 h-auto bg-white">
        <div className="mx-3">
          <div className="text-footercolor flex">레시피 클릭시 이동</div>
          <div className="overflow-hidden">
            <div className="flex pt-3 pb-2 min-w-[60rem]">
              <div className="w-10"></div>
              <div className="flex-1 text-start">레시피</div>
              <div className="w-32">시세</div>
              <div className="w-32">제작비용</div>
              <div className="w-32">판매차익</div>
              <div className="w-32">원가이익률</div>
              <div className="w-32">활동력이익률</div>
              <div className="w-20">직접사용</div>
              <div className="w-20">판매</div>
            </div>
            {list === undefined || list.data?.length === 0 ? (
              <div className="border-solid border-t-[1px] border-t-footercolor leading-8 min-w-[60rem] py-4 text-footercolor">
                no data
              </div>
            ) : (
              list.data?.map((item: List, idx: number) => (
                <div
                  key={idx}
                  className="flex border-solid border-t-[1px] border-t-footercolor leading-8 min-w-[60rem]"
                >
                  <div className="w-8 py-4">별</div>
                  <div className="flex-1 text-start flex gap-4">
                    <img
                      className="w-16"
                      src={`https://cdn-lostark.game.onstove.com/efui_iconatlas/${item.icon}`}
                      alt="recipe img"
                    />
                    <div className="py-4 ">{item.itemName}</div>
                  </div>
                  <div className="w-32 py-4">시세{item.currentMinPrice}</div>
                  <div className="w-32 py-4">
                    제작비용{(item.ingredientAllCost + item.createCost * 100) / 100}
                  </div>
                  <div className="w-32 py-4">
                    차익
                    {(
                      Math.floor(item.currentMinPrice * 0.95) * item.createBundle -
                      item.ingredientAllCost / 100 -
                      item.createCost
                    ).toFixed(2)}
                  </div>
                  <div className="w-32 py-4">
                    {(
                      (+(
                        Math.floor(item.currentMinPrice * 0.95) * item.createBundle -
                        item.ingredientAllCost / 100 -
                        item.createCost
                      ).toFixed(2) /
                        ((item.ingredientAllCost + item.createCost * 100) / 100 +
                          Math.ceil(item.currentMinPrice * 0.05) * item.createBundle)) *
                      100
                    ).toFixed(2)}
                    %
                  </div>
                  <div className="w-32 py-4">
                    {(
                      (+(
                        Math.floor(item.currentMinPrice * 0.95) * item.createBundle -
                        item.ingredientAllCost / 100 -
                        item.createCost
                      ).toFixed(2) /
                        item.enargy) *
                      100
                    ).toFixed(2)}
                    %
                  </div>
                  <div className="w-20 py-4">
                    {item.currentMinPrice * 3 -
                      (item.ingredientAllCost + item.createCost * 100) / 100 >
                    0
                      ? "이득"
                      : "손해"}
                  </div>
                  <div className="w-20 py-4">
                    {+(
                      Math.floor(item.currentMinPrice * 0.95) * item.createBundle -
                      item.ingredientAllCost / 100 -
                      item.createCost
                    ).toFixed(2) > 0
                      ? "이득"
                      : "손해"}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <div className="bg-white">
        <div className="border-solid border-t-[1px] border-t-footercolor leading-8 py-4 mx-3 flex">
          <div>테스트</div>
        </div>
      </div>
    </div>
  );
};

export default Main;
