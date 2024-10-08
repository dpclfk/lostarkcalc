import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import serverbase from "../lib/server";
import { Lastreq } from "../lib/listaxios";
import gold from "../gold.png";
import { numberinput } from "../lib/inputnumber";
import errorimg from "../errorimg.png";

export interface Detailitem {
  creation: {
    id: number;
    itemName: string;
    currentMinPrice: number;
    createCost: number;
    energy: number;
    createTime: number;
    createBundle: number;
    categoryId: number;
    marketBundle: number;
    icon: string;
    itemCode: number;
  };
  ingredient: {
    id: number;
    itemName: string;
    currentMinPrice: number;
    ingredientCount: number;
    bundle: number;
    icon: string;
  }[];
}

interface IProps {
  admin: boolean;
  setGround: React.Dispatch<React.SetStateAction<boolean>>;
  groundEffect: number[];
}

const Detail = ({ admin, setGround, groundEffect }: IProps): JSX.Element => {
  const param = useParams();
  const navigate = useNavigate();
  const [price, setPrice] = useState<number[]>([1]); // 재료 아이템 시세
  const [createNumber, setCreateNumber] = useState<number>(1); // 제작 묶음 수량
  const [creationPrice, setCreationPrice] = useState<number>(0); // 제작하려는 아이템 시세
  const [ingredientSum, setIngredientSum] = useState<number[]>([1]); // 각 재료별 합계
  const [sumcreation, setSumcreation] = useState<number>(0); // 제작비용 총 합계(골드 포함)
  const [sellnumber, setSellnumber] = useState<number>(0); // 판매단위 기준으로 몇개 팔건지
  const [sellcharge, setSellcharge] = useState<number>(0); // 판매단위 당 수수료
  const [sellfirstcost, setSellfirstcost] = useState<number>(0); // 판매단위 당 원가
  const [sellprofit, setSellprofit] = useState<number>(0); // 판매단위 당 판매차익
  const [creationEnergy, setCreationEnergy] = useState<number>(0); // 제작시 필요 활동력
  const [creationTime, setCreationTime] = useState<number>(0); // 제작시 필요 시간

  // 파람스 숫자아니면 메인페이지로 보냄
  useEffect(() => {
    if (param.id === undefined || Number.isNaN(+param.id)) {
      navigate("/");
    }
  }, [param.id, navigate]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // 처음에 데이터 받아옴
  const { data } = useQuery({
    queryKey: ["detailitem"],

    queryFn: async (): Promise<Detailitem> => {
      try {
        if (param.id === undefined || Number.isNaN(+param.id)) {
          throw Error;
        } else {
          const response = await serverbase.get(`/detailitem/${param.id}`);
          return response.data;
        }
      } catch (error: any) {
        console.log(error.message);
        throw new Error("Failed to Get Detail Item");
      }
    },
  });

  const deleterecipe = useQuery({
    queryKey: ["detailitem"],
    queryFn: async (): Promise<string> => {
      try {
        const response = await serverbase.delete(`/recipe/${param.id}`);
        return response.data;
      } catch (error: any) {
        console.log(error.message);
        throw new Error("Failed to Get Delete Recipe");
      }
    },
    enabled: false,
    retry: 0,
  });

  // 데이터 값이 변경되면 즉, 데이터를 받아왔을때 기능함
  useEffect(() => {
    if (data !== undefined) {
      setIngredientSum([
        Math.floor(
          (data.creation.createCost *
            (100 - (groundEffect[data.creation.categoryId + 5] + groundEffect[5]) < 0
              ? 0
              : 100 - (groundEffect[data.creation.categoryId + 5] + groundEffect[5]))) /
            100
        ),
      ]);
      let pricearr: number[] = [1];
      for (const pricedata of data?.ingredient) {
        pricearr.push(pricedata.currentMinPrice);
        setIngredientSum((state) => [
          ...state,
          +((pricedata.currentMinPrice / pricedata.bundle) * pricedata.ingredientCount).toFixed(2),
        ]);
      }
      setPrice(pricearr);
      setCreationPrice(data.creation.currentMinPrice);
      setSellnumber(+data?.creation.createBundle / +data?.creation.marketBundle);
      setCreationEnergy(
        Math.floor(
          (data.creation.energy *
            (100 - (groundEffect[data.creation.categoryId + 10] + groundEffect[10]) < 0
              ? 0
              : 100 - (groundEffect[data.creation.categoryId + 10] + groundEffect[10]))) /
            100
        ) < 1
          ? 1
          : Math.floor(
              (data.creation.energy *
                (100 - (groundEffect[data.creation.categoryId + 10] + groundEffect[10]) < 0
                  ? 0
                  : 100 - (groundEffect[data.creation.categoryId + 10] + groundEffect[10]))) /
                100
            )
      );
      setCreationTime(
        Math.floor(
          (data.creation.createTime *
            (100 - (groundEffect[data.creation.categoryId] + groundEffect[0]) < 0
              ? 0
              : 100 - (groundEffect[data.creation.categoryId] + groundEffect[0]))) /
            100
        )
      );
    }
  }, [data, groundEffect]);

  // 재료시세 변동시(직접 변동하는경우) 합계값도 자동으로 바뀌게 설정
  useEffect(() => {
    let temparr: number[] = [
      price[0] *
        Math.floor(
          (data?.creation.createCost! *
            (100 - (groundEffect[data?.creation.categoryId! + 5] + groundEffect[5]) < 0
              ? 0
              : 100 - (groundEffect[data?.creation.categoryId! + 5] + groundEffect[5]))) /
            100
        ),
    ];
    if (data) {
      for (let i = 0; i < data.ingredient.length; i++) {
        const nowin = data.ingredient[i];
        temparr.push(+((price[i + 1] / nowin.bundle) * nowin.ingredientCount).toFixed(2));
      }
      setIngredientSum(temparr);
    }
  }, [price, data, groundEffect]);

  // 합계값이 변동시 제작정보의 제작비용 변경하게 함
  useEffect(() => {
    let sum: number = 0;
    ingredientSum.forEach((num) => {
      sum += num;
    });
    setSumcreation(+sum.toFixed(2));
  }, [ingredientSum]);

  useEffect(() => {
    // 판매단위 당 수수료
    setSellcharge(creationPrice ? Math.ceil(creationPrice * 0.05) : 0);
    // 판매단위 당 원가
    setSellfirstcost(
      sumcreation && creationPrice
        ? +(
            +((sumcreation * data?.creation.marketBundle!) / data?.creation.createBundle!).toFixed(
              2
            ) + Math.ceil(creationPrice * 0.05)
          ).toFixed(2)
        : 0
    );

    setSellprofit(
      +(
        creationPrice -
        (sumcreation && creationPrice
          ? +(
              +(
                (sumcreation * data?.creation.marketBundle!) /
                data?.creation.createBundle!
              ).toFixed(2) + Math.ceil(creationPrice * 0.05)
            ).toFixed(2)
          : 0)
      ).toFixed(2)
    );
  }, [creationPrice, sumcreation, data]);

  // 최근 요청시간
  const lastreq = useQuery({
    queryKey: ["lastreq"],
    queryFn: Lastreq,
  });

  return (
    <>
      <div className="m-auto w-11/12 min-w-[60rem] max-w-[90rem]">
        {/* 상단 아이템 이름 및 추천정보 */}
        <div className="bg-white py-4 mt-4">
          <div className="text-3xl font-bold flex justify-center relative pb-1">
            <div className="">{data?.creation.itemName}</div>
            {admin ? (
              <div className="w-full flex justify-end px-4 gap-4 absolute">
                <button
                  className=" bg-admincolor font-normal text-white py-1 px-4 rounded-lg"
                  onClick={() => navigate(`/admin?id=${data?.creation.id}`)}
                >
                  수정
                </button>
                <Link
                  to={"/"}
                  className=" bg-cancelcolor font-normal text-white py-1 px-4 rounded-lg"
                  onClick={() => {
                    deleterecipe.refetch();
                  }}
                >
                  삭제
                </Link>
              </div>
            ) : (
              ""
            )}
          </div>
          <div className="flex text-footercolor rounded justify-around pb-4">{lastreq.data}</div>
          <div className="flex justify-around">
            <div className="w-24">
              <div>추천</div>
              {+(creationPrice - sumcreation / data?.creation.createBundle!).toFixed(2) > 0 ? (
                <div className="text-2xl text-green-500">제작</div>
              ) : (
                <div className="text-2xl text-red-500">판매</div>
              )}
            </div>
            <div className="w-24">
              <div>직접사용</div>
              {+(creationPrice - sumcreation / data?.creation.createBundle!).toFixed(2) > 0 ? (
                <div className="text-2xl text-green-500">이득</div>
              ) : (
                <div className="text-2xl text-red-500">손해</div>
              )}
            </div>
            <div className="w-24">
              <div>판매</div>
              {sellprofit > 0 ? (
                <div className="text-2xl text-green-500">이득</div>
              ) : (
                <div className="text-2xl text-red-500">손해</div>
              )}
            </div>
          </div>
        </div>
        {/* 상단 아이템 이름 및 추천정보 끝 */}
        <div className="bg-white py-4 mt-4 justify-start flex px-4">
          <button
            className="bg-layoutcolor text-white rounded px-2 py-1"
            onClick={() => setGround(true)}
          >
            영지효과
          </button>
        </div>
        {/* 중간 제작정보 및 판매정보 */}
        <div className="flex justify-between mt-4">
          <div className="bg-white min-w-[49%] p-4">
            <div className="text-2xl font-bold text-start pb-4">제작정보</div>
            <div>
              <div className="flex pb-4">
                <div className="w-[50%] text-start">제작단위</div>
                <div className="font-bold w-[50%] text-end">{data?.creation.createBundle}</div>
              </div>
              <div className="flex pb-4">
                <div className="w-[50%] text-start">활동력</div>
                <div className="font-bold w-[50%] text-end">{creationEnergy}</div>
              </div>
              <div className="flex pb-4">
                <div className="w-[50%] text-start">제작시간</div>
                <div className="font-bold w-[50%] text-end">{creationTime}초</div>
              </div>
              <div className="flex pb-4">
                <div className="w-[50%] text-start">판매단위 당 제작비용</div>
                <div className="font-bold w-[50%] text-end">
                  {(
                    (sumcreation * data?.creation.marketBundle!) /
                    data?.creation.createBundle!
                  ).toFixed(2)}
                </div>
              </div>
              <div className="flex pb-4">
                <div className="w-[50%] text-start">제작단위 당 제작비용</div>
                <div className="font-bold w-[50%] text-end">{sumcreation.toFixed(2)}</div>
              </div>
            </div>
            {/* 제작정보 상단 끝 하단시작 */}
            <div className="border-solid border-t border-footercolor pt-4">
              <div className="flex pb-4">
                <div className="w-[50%] text-start">제작 묶음수량</div>
                <input
                  className="font-bold w-[50%] text-end bg-inputcolor border-dashed border-b border-black"
                  value={createNumber}
                  onChange={(e) => setCreateNumber(numberinput(e.target.value))}
                ></input>
              </div>
              <div className="flex pb-4">
                <div className="w-[50%] text-start">총 제작 비용</div>
                <div className="font-bold w-[50%] text-end">
                  {(createNumber * sumcreation).toFixed(2)}
                </div>
              </div>
            </div>
          </div>
          {/* 제작정보 끝 판매정보 시작 */}
          <div className="bg-white min-w-[49%] p-4">
            <div className="text-2xl font-bold text-start pb-4">판매정보</div>
            <div>
              <div className="flex pb-4">
                <div className="w-[50%] text-start">판매단위</div>
                <div className="font-bold w-[50%] text-end">{data?.creation.marketBundle}</div>
              </div>
              <div className="flex pb-4">
                <div className="w-[50%] text-start">시세</div>
                <input
                  className="font-bold w-[50%] text-end bg-inputcolor border-dashed border-b border-black"
                  value={creationPrice}
                  onChange={(e) => {
                    setCreationPrice(numberinput(e.target.value));
                  }}
                ></input>
              </div>
              <div className="flex pb-4">
                <div className="w-[50%] text-start">판매단위 당 수수료</div>
                <div className="font-bold w-[50%] text-end">{sellcharge}</div>
              </div>
              <div className="flex pb-4">
                <div className="w-[50%] text-start">판매단위 당 원가</div>
                <div className="font-bold w-[50%] text-end">{sellfirstcost}</div>
              </div>
              <div className="flex pb-4">
                <div className="w-[50%] text-start">판매단위 당 판매차익</div>
                <div className="font-bold w-[50%] text-end">{sellprofit}</div>
              </div>
            </div>
            {/* 판매정보 상단 끝 하단 시작 */}
            <div className="border-solid border-t border-footercolor pt-4">
              <div className="flex pb-4">
                <div className="w-[50%] text-start">판매 묶음수량</div>
                <input
                  className="font-bold w-[50%] text-end bg-inputcolor border-dashed border-b border-black"
                  value={sellnumber}
                  onChange={(e) => setSellnumber(numberinput(e.target.value))}
                ></input>
              </div>
              <div className="flex pb-4">
                <div className="w-[50%] text-start">총 수수료</div>
                <div className="font-bold w-[50%] text-end">{sellcharge * sellnumber}</div>
              </div>
              <div className="flex pb-4">
                <div className="w-[50%] text-start">총 원가</div>
                <div className="font-bold w-[50%] text-end">
                  {(sellfirstcost * sellnumber).toFixed(2)}
                </div>
              </div>
              <div className="flex pb-4">
                <div className="w-[50%] text-start">총 판매차익</div>
                <div className="font-bold w-[50%] text-end">
                  {(sellprofit * sellnumber).toFixed(2)}
                </div>
              </div>
              <div className="flex pb-4">
                <div className="w-[50%] text-start">원가 대비 이익률</div>
                <div className="font-bold w-[50%] text-end">
                  {((sellprofit / (sellfirstcost === 0 ? 1 : sellfirstcost)) * 100).toFixed(2)}%
                </div>
              </div>
              <div className="flex pb-4">
                <div className="w-[50%] text-start">활동력 대비 이익률</div>
                <div className="font-bold w-[50%] text-end">
                  {((sellprofit * sellnumber * 100) / creationEnergy).toFixed(2)}%
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* 중간 제작정보 및 판매정보 끝 및 하단 재료정보 */}
        <div className="bg-white p-4 mt-4">
          <div className="text-2xl font-bold text-start pb-4">재료정보</div>
          <div className="flex px-4 pb-2">
            <div className="flex-1 text-start">재료</div>
            <div className="w-[15%] text-end">필요개수</div>
            <div className="w-[15%] text-end">판매단위</div>
            <div className="w-[15%] text-end">시세</div>
            <div className="w-[15%] text-end">단가</div>
            <div className="w-[15%] text-end">합계</div>
          </div>
          {/* 받아온 재료정보 맵으로 */}
          {data?.ingredient.map((item, idx) => (
            <div className="flex px-4 border-solid border-t border-footercolor" key={idx}>
              <div className="flex-1 text-start flex">
                <img
                  className="w-12 h-12"
                  src={`https://cdn-lostark.game.onstove.com/efui_iconatlas/${item.icon}`}
                  onError={(e) => (e.currentTarget.src = errorimg)}
                  alt="in"
                />
                <div className="py-2 pl-2 text-lg leading-8">{item.itemName}</div>
              </div>
              <div className="w-[15%] text-end py-2 font-bold text-lg leading-8">
                {item.ingredientCount}
              </div>
              <div className="w-[15%] text-end py-2 font-bold text-lg leading-8">{item.bundle}</div>
              <div className="w-[15%] py-2 font-bold text-lg pl-8 leading-8">
                <div>
                  <input
                    className="font-bold w-[100%] text-end bg-inputcolor border-dashed border-b border-black text-lg"
                    value={price[idx + 1] || ""}
                    onChange={(e) => {
                      setPrice((state) => {
                        state[idx + 1] = numberinput(e.target.value);
                        return [...state];
                      });
                    }}
                  ></input>
                </div>
              </div>
              {/* 단가 */}
              <div className="w-[15%] text-end py-2 font-bold text-lg leading-8">
                {price[idx + 1] / item.bundle || 1}
              </div>
              {/* 재료 합계 */}
              <div className="w-[15%] text-end py-2 font-bold text-lg leading-8">
                {ingredientSum[idx + 1] || 1}
              </div>
            </div>
          ))}
          {/* 재료정보 맵 끝 및 골드 관련 div */}
          <div className="flex px-4 border-solid border-t border-footercolor">
            <div className="flex-1 text-start flex">
              <img
                className="w-12 h-12"
                src={gold}
                alt="ingredient"
                onError={(e) => (e.currentTarget.src = errorimg)}
              />
              <div className="py-2 pl-2 text-lg leading-8">골드</div>
            </div>
            <div className="w-[15%] text-end py-2 font-bold text-lg leading-8">
              {data?.creation.createCost}
            </div>
            <div className="w-[15%] text-end py-2 font-bold text-lg leading-8">1</div>
            <div className="w-[15%] py-2 font-bold text-lg pl-8 leading-8">
              <div>
                <input
                  className="font-bold w-[100%] text-end bg-inputcolor border-dashed border-b border-black text-lg"
                  value={price[0]}
                  onChange={(e) => {
                    setPrice((state) => {
                      state[0] = numberinput(e.target.value);
                      return [...state];
                    });
                  }}
                ></input>
              </div>
            </div>
            <div className="w-[15%] text-end py-2 font-bold text-lg leading-8">{price[0]}</div>
            <div className="w-[15%] text-end py-2 font-bold text-lg leading-8">
              {ingredientSum[0]}
            </div>
          </div>
          {/* 골드정보 div 끝 */}
        </div>
      </div>
    </>
  );
};

export default Detail;
