import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const orders = await prisma.guestOrder.findMany();

      res.status(200).json(orders);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Có lỗi xảy ra khi tra cứu đơn hàng." });
    }
  } else {
    res.status(405).json({ error: "Phương thức không được hỗ trợ." });
  }
}
