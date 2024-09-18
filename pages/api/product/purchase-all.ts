import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { IdProdCart, ProductBuy } from "./../../../interfaces/product.d";

export default function PurchaseAll(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    getAllPurchase(res);
  }
}

async function getAllPurchase(res: NextApiResponse) {
  try {
    const result = await prisma.cart.findMany({
      orderBy: {
        updatedAt: "desc",
      },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
      },
    });
    res.status(200).json({ result });
  } catch (error) {
    res.status(500).json(error);
  }
}
