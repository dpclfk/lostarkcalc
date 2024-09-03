import serverbase from "./server";

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

// export interface Lastreq {
//   lastReq: string;
// }

// category?: number[], search?: string
// ${category ? `?category=${category}` : ""}
export const getList = async (): Promise<List[]> => {
  try {
    console.log("test1");
    const response = await serverbase.get(`/list`);
    console.log("test2");
    return response.data;
  } catch (error: any) {
    console.log(error.message);
    throw new Error("Failed to Get List");
  }
};

export const Lastreq = async (): Promise<string> => {
  try {
    const response = await serverbase.get(`/lastreq`);
    const date = new Date(response.data.lastReq).toString();
    console.log(date);
    return date;
  } catch (error: any) {
    console.log(error.message);
    throw new Error("Failed to Get List");
  }
};
