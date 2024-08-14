import axios from "axios";

export const createOrderGuest = async ({
  products,
  finalPrice,
  buyerName,
  buyerAddress,
  buyerPhone,
}: {
  products: any;
  finalPrice: number;
  buyerName: string;
  buyerAddress: string;
  buyerPhone: string;
}) => {
  return await axios.post("/api/guest-order", {
    products,
    finalPrice,
    buyerName,
    buyerAddress,
    buyerPhone,
  });
};

export const getOrderGuestByPhone = async (phone: string) => {
  return await axios.get("/api/guest-order", { params: { buyerPhone: phone } });
};

export const deleteOrderGuest = async (id: string) => {
  return await axios.delete("/api/guest-order", { data: { id } });
};

export const getOrderGuestAll = async () => {
  return await axios.get("/api/guest-order-all");
};

export const updateStatusGuest = async ({
  id,
  status,
}: {
  id: string;
  status: string;
}) => {
  return await axios.patch("/api/guest-order", { id, status });
};
