import { NextApiRequest, NextApiResponse } from "next";
import { CommentReview } from "../../../interfaces/product";
import prisma from "../../../lib/prisma";

export default function Review(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const comment = req.body.comment;
    if (!comment) return;
    addReviewUser(res, comment);
  }

  if (req.method === "GET") {
    const id = req.query.id;
    if (!id) return;
    countRating(res, String(id));
  }
}

async function addReviewUser(res: NextApiResponse, comment: CommentReview) {
  try {
    await prisma.review.create({
      data: {
        product: { connect: { id: String(comment.idProduct) } },
        content: comment.content,
        nameUser: comment.name,
        rating: Number(comment.rating),
      },
    });
    res.status(200).json("Add Successful");
  } catch (error) {
    res.status(500).json(error);
  }
}

async function countRating(res: NextApiResponse, id: string) {
  try {
    const oneStar = await prisma.review.count({
      where: {
        productId: id,
        rating: 1,
      },
    });
    const twoStar = await prisma.review.count({
      where: {
        productId: id,
        rating: 2,
      },
    });
    const threeStar = await prisma.review.count({
      where: {
        productId: id,
        rating: 3,
      },
    });
    const fourStar = await prisma.review.count({
      where: {
        productId: id,
        rating: 4,
      },
    });
    const fiveStar = await prisma.review.count({
      where: {
        productId: id,
        rating: 5,
      },
    });
    const countReview = await prisma.review.count({
      where: {
        productId: id,
      },
    });
    res.status(200).json({
      rating: [
        { star: 5, total: fiveStar },
        { star: 4, total: fourStar },
        { star: 3, total: threeStar },
        { star: 2, total: twoStar },
        { star: 1, total: oneStar },
      ],
      average:
        (1 * oneStar +
          2 * twoStar +
          3 * threeStar +
          4 * fourStar +
          5 * fiveStar) /
        countReview,
    });
  } catch (error) {
    res.status(500).json(error);
  }
}
