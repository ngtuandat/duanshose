import { NextApiRequest, NextApiResponse } from "next";
import { GetUsersQuery } from "../../../interfaces/user";
import prisma from "../../../lib/prisma";

export default function Product(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const query = req.query;
    if (!query) return;
    getProduct(res, query);
  }
}

async function getProduct(res: NextApiResponse, query: GetUsersQuery) {
  try {
    const getProd = await prisma.product.findMany({
      skip: (Number(query.page || 1) - 1) * 6,
      take: Number(query.limit),
      include: { category: true },
    });

    const total = await prisma.product.count();

    res.status(200).json({ product: getProd, total });
  } catch (error) {
    res.status(500).json(error);
  }
}
