import axios from "axios";
import { CategoryValidator } from "../../interfaces/voucher";

export const getFullCategory = async () => {
  return await axios.get("/api/product/category");
};

export const createCategory = async (data: CategoryValidator) => {
  return await axios.post("/api/product/category", { data });
};

export const deleteCategory = async (id: string) => {
  return await axios.delete("/api/product/category", { data: { id } });
};

export const editCategory = async ({
  id,
  name,
}: {
  id: string;
  name: string;
}) => {
  return await axios.put("/api/product/category", {
    id,
    name,
  });
};
