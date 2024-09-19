import { useEffect, useState } from "react";
import { numberinput } from "../../lib/inputnumber";

interface IProps {
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  setGround: React.Dispatch<React.SetStateAction<boolean>>;
  setRecalc: React.Dispatch<React.SetStateAction<boolean>>;
}

const GroundEffect = ({ setModal, setGround, setRecalc }: IProps): JSX.Element => {
  const [groundEffect, setGroundEffect] = useState<number[]>([
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ]);

  useEffect(() => {
    const localEffect = window.localStorage.getItem("groundEffect");
    if (!localEffect) {
      window.localStorage.setItem(
        "groundEffect",
        JSON.stringify([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
      );
    } else {
      setGroundEffect(JSON.parse(localEffect!));
    }
  }, []);

  return (
    <>
      <div className="pl-8 py-4">
        <div className="pb-4">
          <div className="text-xl font-bold text-footercolor">제작시간 감소</div>
          <div className="flex">
            <div>
              <div>전체</div>
              <div className="border py-1 px-2 w-[80%] flex">
                <input
                  className="w-full text-end"
                  value={`${groundEffect[0] > 100 ? 100 : groundEffect[0]}`}
                  onChange={(e) => {
                    setGroundEffect((state) => {
                      numberinput(e.target.value) > 100
                        ? (state[0] = 100)
                        : (state[0] = numberinput(e.target.value));
                      return [...state];
                    });
                  }}
                  type="number"
                />
                <div>%</div>
              </div>
            </div>
            <div>
              <div>배틀아이템</div>
              <div className="border py-1 px-2 w-[80%] flex">
                <input
                  className="w-full text-end"
                  value={`${groundEffect[1] > 100 ? 100 : groundEffect[1]}`}
                  onChange={(e) => {
                    setGroundEffect((state) => {
                      numberinput(e.target.value) > 100
                        ? (state[1] = 100)
                        : (state[1] = numberinput(e.target.value));
                      return [...state];
                    });
                  }}
                  type="number"
                />
                <div>%</div>
              </div>
            </div>
            <div>
              <div>요리</div>
              <div className="border py-1 px-2 w-[80%] flex">
                <input
                  className="w-full text-end"
                  value={`${groundEffect[2] > 100 ? 100 : groundEffect[2]}`}
                  onChange={(e) => {
                    setGroundEffect((state) => {
                      numberinput(e.target.value) > 100
                        ? (state[2] = 100)
                        : (state[2] = numberinput(e.target.value));
                      return [...state];
                    });
                  }}
                  type="number"
                />
                <div>%</div>
              </div>
            </div>
            <div>
              <div>생활도구</div>
              <div className="border py-1 px-2 w-[80%] flex">
                <input
                  className="w-full text-end"
                  value={`${groundEffect[3] > 100 ? 100 : groundEffect[3]}`}
                  onChange={(e) => {
                    setGroundEffect((state) => {
                      numberinput(e.target.value) > 100
                        ? (state[3] = 100)
                        : (state[3] = numberinput(e.target.value));
                      return [...state];
                    });
                  }}
                  type="number"
                />
                <div>%</div>
              </div>
            </div>
          </div>
          <div>
            <div>특수</div>
            <div className="border py-1 px-2 w-[20%] flex">
              <input
                className="w-full text-end"
                value={`${groundEffect[4] > 100 ? 100 : groundEffect[4]}`}
                onChange={(e) => {
                  setGroundEffect((state) => {
                    numberinput(e.target.value) > 100
                      ? (state[4] = 100)
                      : (state[4] = numberinput(e.target.value));
                    return [...state];
                  });
                }}
                type="number"
              />
              <div>%</div>
            </div>
          </div>
        </div>
        <div className="pb-4">
          <div className="text-xl font-bold text-footercolor">제작수수료 감소</div>
          <div className="flex">
            <div>
              <div>전체</div>
              <div className="border py-1 px-2 w-[80%] flex">
                <input
                  className="w-full text-end"
                  value={`${groundEffect[5] > 100 ? 100 : groundEffect[5]}`}
                  onChange={(e) => {
                    setGroundEffect((state) => {
                      numberinput(e.target.value) > 100
                        ? (state[5] = 100)
                        : (state[5] = numberinput(e.target.value));
                      return [...state];
                    });
                  }}
                  type="number"
                />
                <div>%</div>
              </div>
            </div>
            <div>
              <div>배틀아이템</div>
              <div className="border py-1 px-2 w-[80%] flex">
                <input
                  className="w-full text-end"
                  value={`${groundEffect[6] > 100 ? 100 : groundEffect[6]}`}
                  onChange={(e) => {
                    setGroundEffect((state) => {
                      numberinput(e.target.value) > 100
                        ? (state[6] = 100)
                        : (state[6] = numberinput(e.target.value));
                      return [...state];
                    });
                  }}
                  type="number"
                />
                <div>%</div>
              </div>
            </div>
            <div>
              <div>요리</div>
              <div className="border py-1 px-2 w-[80%] flex">
                <input
                  className="w-full text-end"
                  value={`${groundEffect[7] > 100 ? 100 : groundEffect[7]}`}
                  onChange={(e) => {
                    setGroundEffect((state) => {
                      numberinput(e.target.value) > 100
                        ? (state[7] = 100)
                        : (state[7] = numberinput(e.target.value));
                      return [...state];
                    });
                  }}
                  type="number"
                />
                <div>%</div>
              </div>
            </div>
            <div>
              <div>생활도구</div>
              <div className="border py-1 px-2 w-[80%] flex">
                <input
                  className="w-full text-end"
                  value={`${groundEffect[8] > 100 ? 100 : groundEffect[8]}`}
                  onChange={(e) => {
                    setGroundEffect((state) => {
                      numberinput(e.target.value) > 100
                        ? (state[8] = 100)
                        : (state[8] = numberinput(e.target.value));
                      return [...state];
                    });
                  }}
                  type="number"
                />
                <div>%</div>
              </div>
            </div>
          </div>
          <div>
            <div>특수</div>
            <div className="border py-1 px-2 w-[20%] flex">
              <input
                className="w-full text-end"
                value={`${groundEffect[9] > 100 ? 100 : groundEffect[9]}`}
                onChange={(e) => {
                  setGroundEffect((state) => {
                    numberinput(e.target.value) > 100
                      ? (state[9] = 100)
                      : (state[9] = numberinput(e.target.value));
                    return [...state];
                  });
                }}
                type="number"
              />
              <div>%</div>
            </div>
          </div>
        </div>
        <div>
          <div className="text-xl font-bold text-footercolor">활동력 감소</div>
          <div className="flex">
            <div>
              <div>전체</div>
              <div className="border py-1 px-2 w-[80%] flex">
                <input
                  className="w-full text-end"
                  value={`${groundEffect[10] > 100 ? 100 : groundEffect[10]}`}
                  onChange={(e) => {
                    setGroundEffect((state) => {
                      numberinput(e.target.value) > 100
                        ? (state[10] = 100)
                        : (state[10] = numberinput(e.target.value));
                      return [...state];
                    });
                  }}
                  type="number"
                />
                <div>%</div>
              </div>
            </div>
            <div>
              <div>배틀아이템</div>
              <div className="border py-1 px-2 w-[80%] flex">
                <input
                  className="w-full text-end"
                  value={`${groundEffect[11] > 100 ? 100 : groundEffect[11]}`}
                  onChange={(e) => {
                    setGroundEffect((state) => {
                      numberinput(e.target.value) > 100
                        ? (state[11] = 100)
                        : (state[11] = numberinput(e.target.value));
                      return [...state];
                    });
                  }}
                  type="number"
                />
                <div>%</div>
              </div>
            </div>
            <div>
              <div>요리</div>
              <div className="border py-1 px-2 w-[80%] flex">
                <input
                  className="w-full text-end"
                  value={`${groundEffect[12] > 100 ? 100 : groundEffect[12]}`}
                  onChange={(e) => {
                    setGroundEffect((state) => {
                      numberinput(e.target.value) > 100
                        ? (state[12] = 100)
                        : (state[12] = numberinput(e.target.value));
                      return [...state];
                    });
                  }}
                  type="number"
                />
                <div>%</div>
              </div>
            </div>
            <div>
              <div>생활도구</div>
              <div className="border py-1 px-2 w-[80%] flex">
                <input
                  className="w-full text-end"
                  value={`${groundEffect[13] > 100 ? 100 : groundEffect[13]}`}
                  onChange={(e) => {
                    setGroundEffect((state) => {
                      numberinput(e.target.value) > 100
                        ? (state[13] = 100)
                        : (state[13] = numberinput(e.target.value));
                      return [...state];
                    });
                  }}
                  type="number"
                />
                <div>%</div>
              </div>
            </div>
          </div>
          <div>
            <div>특수</div>
            <div className="border py-1 px-2 w-[20%] flex">
              <input
                className="w-full text-end"
                value={`${groundEffect[14] > 100 ? 100 : groundEffect[14]}`}
                onChange={(e) => {
                  setGroundEffect((state) => {
                    numberinput(e.target.value) > 100
                      ? (state[14] = 100)
                      : (state[14] = numberinput(e.target.value));
                    return [...state];
                  });
                }}
                type="number"
              />
              <div>%</div>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t-[1px] border-footercolor flex justify-end px-8 py-8 text-xl font-bold">
        <button
          className="hover:bg-hovercolor px-4 py-1"
          onClick={() => {
            setModal(false);
            setGround(false);
          }}
        >
          취소
        </button>
        <button
          className="hover:bg-hovercolor px-4 py-1"
          onClick={() => {
            setModal(false);
            setGround(false);
            setRecalc(true);
            window.localStorage.setItem("groundEffect", JSON.stringify(groundEffect));
          }}
        >
          수정
        </button>
      </div>
    </>
  );
};

export default GroundEffect;
