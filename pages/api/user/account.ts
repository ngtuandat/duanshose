import { NextApiRequest, NextApiResponse } from "next";
import { GetUsersQuery } from "../../../interfaces/user";
import prisma from './../../../lib/prisma';


export default function User(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === "GET") {
        const query = req.query
        if (!query) return
        getUser(res, query)
    }

    if (req.method === "PUT") {
        updateAdmin(req, res);
    }
}

async function getUser(res: NextApiResponse, query: GetUsersQuery) {
    try {
        const getUser = await prisma.user.findMany({
            skip: (Number(query.page || 1) - 1) * 6,
            take: Number(query.limit),
        });
        const total = await prisma.user.count();

        res.status(200).json({ users: getUser, total });
    } catch (error) {
        res.status(500).json(error);
    }
}

async function updateAdmin(req: NextApiRequest, res: NextApiResponse) {
    try {
        const data = req.body.user;

        await prisma.user.update({
            where: {
                id: data.id,
            },
            data: {
                admin: !data.role,
            },
        });
        res.status(200).json("Update Successful");
    } catch (error) {
        res.status(500).json({ error });
    }
}
