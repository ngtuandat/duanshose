import axios from "axios";

export const updateStatus = async ({
  id,
  status,
}: {
  id: string;
  status: string;
}) => {
  return await axios.patch("/api/product/purchase", { id, status });
};
