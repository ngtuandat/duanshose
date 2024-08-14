import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const { userId } = req.query;
      const currentDate = new Date().toISOString(); // Chuyển đổi ngày hiện tại thành chuỗi ISO

      const userVouchers = await prisma.userVoucher.findMany({
        where: {
          userId: String(userId),
          used: false,
          voucher: {
            expiryDate: {
              gte: currentDate,
            },
          },
        },
        select: {
          voucher: true,
        },
        orderBy: {
          voucher: {
            discount: "asc", // Sắp xếp theo discount tăng dần
          },
        },
      });

      res.status(200).json(userVouchers);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve user vouchers" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
