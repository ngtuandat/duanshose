import type { NextApiRequest, NextApiResponse } from 'next'
import { newUser } from './../../../interfaces/user.d';
import bcrypt from "bcrypt";
import prisma from './../../../lib/prisma';


export default function register(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'POST') {
        const user = req.body.user
        if(!user) return
        CreateAccount(res, user)
    }
}

async function CreateAccount(res: NextApiResponse, user: newUser) {
    //Tiêu chuẩn mã hóa 10 ký tự
    const salt = await bcrypt.genSalt(10);
    try {
        // Kiểm tra email
        const users = await prisma.user.findFirst({
            where: {
                email: user.email,
            },
        });
        if (users) res.status(500).json('Email already exists')

        //   Mã hóa pass
        const hashed = await bcrypt.hash(user.password, salt);

        const regis = await prisma.user.create({
            data: {
                email: user.email,
                password: hashed,
                firstName: user.firstName,
                lastName: user.lastName,
            },
        });
        await prisma.profile.create({
            data: {
                user: { connect: { email: regis.email } }
            }
        })
        res.status(200).json("Register Successfully!");

    } catch (error) {
        res.status(500).json(error)
    }
}