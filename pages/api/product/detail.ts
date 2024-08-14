import { NextApiRequest, NextApiResponse } from 'next';
import { CommentReview } from '../../../interfaces/product';
import prisma from '../../../lib/prisma';

export default function ProductDetail(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === "GET") {
        const id = req.query.id
        if (!id) return
        getDetailProduct(res, String(id))
    }
}

async function getDetailProduct(res: NextApiResponse, id: string) {
    try {
        const detail = await prisma.product.findFirst({
            where: {
                id: id
            },
            include: {
                review: true
            }
        })
        res.status(200).json({ detail })
    } catch (error) {
        res.status(500).json(error)
    }
}


