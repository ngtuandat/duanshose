import { NextApiRequest, NextApiResponse } from 'next';
import { IdProdCart } from '../../../interfaces/product';
import prisma from '../../../lib/prisma';

export default function MiniusQuantity(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === "POST") {
        const product = req.body.product
        if (!product) return
        handleMinius(res, product)
    }
}

async function handleMinius(res: NextApiResponse, product: IdProdCart) {
    try {
        const productUpdate = await prisma.cart.findFirst({
            where: {
                idProd: product.idProd,
                userId: product.idUser,
                bought: false
            }
        })
        if (productUpdate) {
            await prisma.cart.update({
                where: {
                    id: productUpdate.id
                },
                data: {
                    quantityProd: productUpdate.quantityProd - 1
                }
            })
            res.status(200).json("Minius Successful")
        } else {
            res.status(404).json("Not Found")
        }
    } catch (error) {
        res.status(500).json(error)
    }
}
