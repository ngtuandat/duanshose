import { NextApiRequest, NextApiResponse } from 'next';
import { User } from '../../../interfaces/user';
import prisma from './../../../lib/prisma';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";


export default function Login(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === "POST") {
        const user = req.body.user
        if (!user) return
        LoginUser(user, res)
    }
}

async function LoginUser(user: User, res: NextApiResponse) {
    try {
        const secret = '12345'
        const userCheck = await prisma.user.findFirst({
            where: {
                email: user.email
            }
        })
        if (!userCheck)
            res.status(400).json('Email không hợp lệ')

        const validPassword = await bcrypt.compare(
            user.password,
            String(userCheck?.password)
        );
        if (!validPassword)
            res.status(400).json("Mật khẩu không đúng");

        if (userCheck && validPassword) {
            const token = jwt.sign(
                {
                    id: userCheck?.id,
                    email: userCheck?.email,
                    firstName: userCheck?.firstName,
                    lastName: userCheck?.lastName,
                    admin: userCheck?.admin
                },
                secret
            );
            res.setHeader("Set-Cookie", serialize("token", token, { path: "/" }));

            res.status(200).json({
                id: userCheck?.id,
                email: userCheck?.email,
                name: userCheck?.lastName,
                admin: userCheck?.admin
            });
        }
    } catch (error) {
        res.status(500).json(error)
    }
}