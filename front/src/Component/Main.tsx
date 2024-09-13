import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Lastreq } from "../lib/listaxios";
import serverbase from "../lib/server";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { numberinput } from "../lib/inputnumber";

export interface List {
  id: number;
  itemName: string;
  currentMinPrice: number;
  ingredientAllCost: number;
  createCost: number;
  energy: number;
  createBundle: number;
  marketBundle: number;
  categoryId: number;
  icon: string;
}

export interface CateList {
  id: number;
  categoryName: string;
}

interface IProps {
  admin: boolean;
  setGround: React.Dispatch<React.SetStateAction<boolean>>;
  groundEffect: number[];
}

const Main = ({ admin, setGround, groundEffect }: IProps): JSX.Element => {
  const navigate = useNavigate();

  const queryclient = useQueryClient();

  const [category, setCategory] = useState<number[]>([]);
  const [search, setSearch] = useState<string>("");
  const [cate, setCate] = useState<CateList[]>([{ id: 0, categoryName: "관심" }]);
  const [loading, setLoading] = useState<boolean>(false);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [page] = useState<number>(10);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [maxPageNumber, setMaxPageNumber] = useState<number>(1);

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

  const list = useQuery({
    queryKey: ["list"],
    queryFn: async (): Promise<List[]> => {
      try {
        const temp = category.filter((value) => value !== 0);
        const response = await serverbase.get(
          `/list?${temp ? `category=${temp}&` : ""}search=${search}`
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
  }, [category, queryclient]);

  useEffect(() => {
    if (catelist.data) setCate([{ id: 0, categoryName: "관심" }, ...catelist.data]);
  }, [catelist.data]);

  useEffect(() => {
    if (list.isLoading) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [list.isLoading]);

  useEffect(() => {
    const localFavorites = window.localStorage.getItem("Favorites");
    if (!localFavorites) {
      window.localStorage.setItem("Favorites", JSON.stringify([]));
    } else {
      setFavorites(JSON.parse(localFavorites!));
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("Favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    if (list.data) {
      setMaxPageNumber(Math.ceil((list.data?.length! < 1 ? 1 : list.data?.length!) / page));
    } else {
    }
  }, [list.data, page]);

  return (
    <div className="m-auto w-11/12 min-w-[60rem] max-w-[90rem] ">
      <div className="mt-8 h-auto bg-white ">
        <div className="mx-3">
          <div className="flex text-xl py-2 justify-between">
            <div className="flex gap-4">
              <div className="lpx-2 py-1">제작 계산기</div>
              <button
                className="bg-layoutcolor text-white rounded px-2 py-1"
                onClick={() => setGround(true)}
              >
                영지효과
              </button>
            </div>
            {admin ? (
              <Link to="admin" className="bg-admincolor text-white text-center rounded px-2 py-1">
                레시피 추가
              </Link>
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
            onChange={(e) => setSearch(e.target.value)}
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
          {cate.map((item, idx) => (
            <button
              key={idx}
              className={`m-auto py-4 border-solid border-b-2 w-full ${
                category.indexOf(item.id) === -1 ? "border-white" : "border-layoutcolor"
              }`}
              onClick={() => {
                category.indexOf(item.id) === -1
                  ? setCategory([...category, item.id])
                  : setCategory(category.filter((element) => element !== item.id));
              }}
            >
              <div>{item.categoryName}</div>
            </button>
          ))}
        </div>
      </div>
      <div className="mt-8 bg-white">
        <div className="mx-3 overflow-auto pt-4">
          <div className="text-footercolor flex">레시피 클릭시 이동</div>
          <div className="min-h-20">
            <div className="flex justify-between pt-3 pb-2 border-b-[1px] border-b-footercolor w-[88.5rem]">
              <div className="w-12"></div>
              <div className="flex justify-between w-full">
                <div className="flex">
                  <div className="w-96 text-start">레시피</div>
                </div>
                <div className="flex">
                  <div className="w-32">시세</div>
                  <div className="w-32">제작비용</div>
                  <div className="w-32">판매차익</div>
                  <div className="w-32">원가이익률</div>
                  <div className="w-32">활동력이익률</div>
                  <div className="w-20">직접사용</div>
                  <div className="w-20">판매</div>
                </div>
              </div>
            </div>
            {loading ? <div>로딩중</div> : ""}
            {list === undefined ||
            list.data?.length === 0 ||
            (favorites.length === 0 && category.indexOf(0) !== -1) ? (
              <div className="border-b-[1px] border-b-footercolor leading-8 py-4 text-footercolor">
                no data
              </div>
            ) : (
              list.data?.map((item: List, idx: number) =>
                (favorites.indexOf(item.id) !== -1 || category.indexOf(0) === -1) &&
                idx < page * pageNumber &&
                idx > page * (pageNumber - 1) - 1 ? (
                  <div
                    key={idx}
                    className="flex border-solid border-b-[1px] border-b-footercolor leading-8 w-[88.5rem]"
                  >
                    <button
                      className={`py-4 w-12 z-10 ${
                        favorites.indexOf(item.id) === -1 ? "" : "text-cancelcolor"
                      }`}
                      onClick={() => {
                        favorites.indexOf(item.id) === -1
                          ? setFavorites([...favorites, item.id])
                          : setFavorites(favorites.filter((element) => element !== item.id));
                      }}
                    >
                      별
                    </button>
                    <div
                      className="flex justify-between w-full hover:bg-footercolor"
                      onClick={() => {
                        navigate(`${item.id}`);
                      }}
                    >
                      <div className="flex">
                        <div className="w-96 text-start flex gap-4">
                          <img
                            className="w-16"
                            src={`https://cdn-lostark.game.onstove.com/efui_iconatlas/${item.icon}`}
                            alt="recipe img"
                          />
                          <div className="py-4">{item.itemName}</div>
                        </div>
                      </div>
                      <div className="flex">
                        {/* 시세 */}
                        <div className="w-32 py-4">{item.currentMinPrice}</div>
                        {/* 제작비용 */}
                        <div className="w-32 py-4">
                          {(item.ingredientAllCost +
                            Math.floor(
                              (item.createCost *
                                (100 - (groundEffect[item.categoryId + 5] + groundEffect[5]) < 0
                                  ? 0
                                  : 100 - (groundEffect[item.categoryId + 5] + groundEffect[5]))) /
                                100
                            ) *
                              100) /
                            100}
                        </div>
                        {/* 판매차익 */}
                        <div className="w-32 py-4">
                          {(
                            (+(
                              Math.floor(item.currentMinPrice * 0.95) -
                              ((item.ingredientAllCost +
                                Math.floor(
                                  (item.createCost *
                                    (100 - (groundEffect[item.categoryId + 5] + groundEffect[5]) < 0
                                      ? 0
                                      : 100 -
                                        (groundEffect[item.categoryId + 5] + groundEffect[5]))) /
                                    100
                                ) *
                                  100) *
                                item.marketBundle) /
                                item.createBundle /
                                100
                            ).toFixed(2) *
                              item.createBundle) /
                            item.marketBundle
                          ).toFixed(2)}
                        </div>
                        {/* 원가 이익률 */}
                        <div className="w-32 py-4">
                          {(
                            (+(
                              (+(
                                Math.floor(item.currentMinPrice * 0.95) -
                                ((item.ingredientAllCost +
                                  Math.floor(
                                    (item.createCost *
                                      (100 - (groundEffect[item.categoryId + 5] + groundEffect[5]) <
                                      0
                                        ? 0
                                        : 100 -
                                          (groundEffect[item.categoryId + 5] + groundEffect[5]))) /
                                      100
                                  ) *
                                    100) *
                                  item.marketBundle) /
                                  item.createBundle /
                                  100
                              ).toFixed(2) *
                                item.createBundle) /
                              item.marketBundle
                            ).toFixed(2) /
                              ((item.ingredientAllCost +
                                Math.floor(
                                  (item.createCost *
                                    (100 - (groundEffect[item.categoryId + 5] + groundEffect[5]) < 0
                                      ? 0
                                      : 100 -
                                        (groundEffect[item.categoryId + 5] + groundEffect[5]))) /
                                    100
                                ) *
                                  100) /
                                100 +
                                (Math.ceil(item.currentMinPrice * 0.05) * item.createBundle) /
                                  item.marketBundle)) *
                            100
                          ).toFixed(2)}
                          %
                        </div>
                        {/* 활동력 이익률 */}
                        <div className="w-32 py-4">
                          {(
                            (+(
                              (+(
                                Math.floor(item.currentMinPrice * 0.95) -
                                ((item.ingredientAllCost +
                                  Math.floor(
                                    (item.createCost *
                                      (100 - (groundEffect[item.categoryId + 5] + groundEffect[5]) <
                                      0
                                        ? 0
                                        : 100 -
                                          (groundEffect[item.categoryId + 5] + groundEffect[5]))) /
                                      100
                                  ) *
                                    100) *
                                  item.marketBundle) /
                                  item.createBundle /
                                  100
                              ).toFixed(2) *
                                item.createBundle) /
                              item.marketBundle
                            ).toFixed(2) *
                              100) /
                            item.energy
                          ).toFixed(2)}
                          %
                        </div>
                        {/* 직접사용시 이득 손해 판단 */}
                        <div className="w-20 py-4">
                          {(item.currentMinPrice * item.createBundle) / item.marketBundle -
                            (item.ingredientAllCost +
                              Math.floor(
                                (item.createCost *
                                  (100 - (groundEffect[item.categoryId + 5] + groundEffect[5]) < 0
                                    ? 0
                                    : 100 -
                                      (groundEffect[item.categoryId + 5] + groundEffect[5]))) /
                                  100
                              ) *
                                100) /
                              100 >
                          0
                            ? "이득"
                            : "손해"}
                        </div>
                        {/* 제작후 판매시 이득 손해 판단 */}
                        <div className="w-20 py-4">
                          {+(
                            (+(
                              Math.floor(item.currentMinPrice * 0.95) -
                              ((item.ingredientAllCost +
                                Math.floor(
                                  (item.createCost *
                                    (100 - (groundEffect[item.categoryId + 5] + groundEffect[5]) < 0
                                      ? 0
                                      : 100 -
                                        (groundEffect[item.categoryId + 5] + groundEffect[5]))) /
                                    100
                                ) *
                                  100) *
                                item.marketBundle) /
                                item.createBundle /
                                100
                            ).toFixed(2) *
                              item.createBundle) /
                            item.marketBundle
                          ).toFixed(2) > 0
                            ? "이득"
                            : "손해"}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  ""
                )
              )
            )}
          </div>
        </div>
      </div>
      <div className="bg-white">
        <div className="leading-8 py-4 mx-3 flex justify-end px-4 gap-4">
          <div>한번에 보여줄 최대 개수</div>
          <div>{page}개</div>
          <div>현재 페이지</div>
          <input
            className="w-12 border border-footercolor rounded pl-2"
            type="number"
            value={pageNumber}
            onChange={(e) =>
              setPageNumber(
                numberinput(e.target.value) > maxPageNumber
                  ? maxPageNumber
                  : numberinput(e.target.value) === 0
                  ? 1
                  : numberinput(e.target.value)
              )
            }
          />
          <div>최대 페이지</div>
          <div>{maxPageNumber}</div>
        </div>
      </div>
    </div>
  );
};

export default Main;
