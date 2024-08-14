import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { products, finalPrice, buyerName, buyerAddress, buyerPhone } =
      req.body;

    try {
      const newGuestOrder = await prisma.guestOrder.create({
        data: {
          products,
          finalPrice,
          buyerName,
          buyerAddress,
          buyerPhone,
        },
      });

      res.status(200).json(newGuestOrder);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Có lỗi xảy ra khi tạo đơn hàng." });
    }
  } else if (req.method === "GET") {
    const { buyerPhone } = req.query;

    try {
      const orders = await prisma.guestOrder.findMany({
        where: { buyerPhone: buyerPhone as string },
      });

      if (orders.length === 0) {
        res.json({ error: "Không tìm thấy đơn hàng với số điện thoại này." });
      } else {
        res.status(200).json(orders);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Có lỗi xảy ra khi tra cứu đơn hàng." });
    }
  } else if (req.method === "DELETE") {
    const { id } = req.body;

    try {
      const deletedOrder = await prisma.guestOrder.delete({
        where: { id: id as string },
      });

      res.status(200).json(deletedOrder);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Có lỗi xảy ra khi hủy đơn hàng." });
    }
  } else if (req.method === "PATCH") {
    const { id, status } = req.body;

    try {
      await prisma.guestOrder.update({
        where: {
          id: id,
        },
        data: {
          status: status,
        },
      });
      res.status(200).json("Update Successful");
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(405).json({ error: "Phương thức không được hỗ trợ." });
  }
}
