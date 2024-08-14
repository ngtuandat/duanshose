import type { NextApiRequest, NextApiResponse } from 'next'
import { ProfileUpdate } from '../../../interfaces/user';
import prisma from './../../../lib/prisma';


export default function Profile(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === "GET") {
        const email = req.query.email
        if(!email) return
        profileUser(res, String(email))
    }

    if (req.method === 'PUT') {
        const profileUpdate = req.body.profileUpdate
        if(!profileUpdate) return
        updateProfile(res, profileUpdate)
    }
}

async function profileUser(res: NextApiResponse, email: string) {
    try {
        const profile = await prisma.user.findFirst({
            where: {
                email: email
            },
            include: {
                profile: true
            }
        })
        res.status(200).json({ profile })
    } catch (error) {
        res.status(500).json(error)
    }
}

async function updateProfile(res: NextApiResponse, profileUpdate: ProfileUpdate) {
    try {
        await prisma.user.update({
            where: {
                email: profileUpdate.email
            },
            data: {
                firstName: profileUpdate.firstName,
                lastName: profileUpdate.lastName,
                profile: {
                    update: {
                        address: profileUpdate.address,
                        avatar: profileUpdate.avatar,
                        birthDay: profileUpdate.birthDay && new Date(profileUpdate.birthDay),
                        city: profileUpdate.city,
                        phoneNumber: profileUpdate.phone,
                        sex: profileUpdate.sex
                    }
                }
            }
        })
        res.status(200).json("Update Successful")
    } catch (error) {
        res.status(500).json(error)
    }
}