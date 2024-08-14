import { NextApiRequest, NextApiResponse } from "next";
import { CommentReview } from "../../../interfaces/product";
import prisma from "../../../lib/prisma";

export default function Review(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    getAllReview(res);
  }
}

async function getAllReview(res: NextApiResponse) {
  try {
    const result = await prisma.review.findMany({
      include: {
        product: true,
      },
    });
    console.log({ result });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
}
