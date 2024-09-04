// import { NextApiRequest, NextApiResponse } from "next";
// import prisma from "../../../lib/prisma";
// import { Voucher } from "../../../interfaces/voucher";

// function generateVoucherCode(length: number): string {
//   const characters =
//     "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
//   let result = "";
//   const charactersLength = characters.length;
//   for (let i = 0; i < length; i++) {
//     result += characters.charAt(Math.floor(Math.random() * charactersLength));
//   }
//   return result;
// }

// async function generateUniqueVoucherCode(length: number): Promise<string> {
//   let code = "";
//   let isUnique = false;
//   while (!isUnique) {
//     code = generateVoucherCode(length);
//     const existingVoucher = await prisma.voucher.findUnique({
//       where: { code },
//     });
//     if (!existingVoucher) {
//       isUnique = true;
//     }
//   }
//   return code;
// }

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   if (req.method === "POST") {
//     try {
//       const { voucher: voucherReq } = req.body;
//       for (let i = 0; i < voucherReq.quantity; i++) {
//         const code = await generateUniqueVoucherCode(6);
//         console.log({ code, voucherReq });
//         const voucher = await prisma.voucher.create({
//           data: {
//             code,
//             discount: voucherReq.discount,
//             expiryDate: voucherReq.expiryDate,
//             type: voucherReq.type,
//             publishDate: voucherReq.publishDate,
//           },
//         });
//         console.log({ voucher });

//         const users = await prisma.user.findMany();
//         for (const user of users) {
//           await prisma.userVoucher.create({
//             data: {
//               userId: user.id,
//               voucherId: voucher.id,
//             },
//           });
//         }
//       }
//       res
//         .status(200)
//         .json({ message: "Vouchers created and assigned successfully" });
//     } catch (error) {
//       res.status(500).json(error);
//     }
//   } else if (req.method === "GET") {
//     const vouchers = await prisma.voucher.findMany({
//       orderBy: {
//         discount: "asc",
//       },
//     });
//     res.status(200).json(vouchers);
//   } else if (req.method === "PUT") {
//     try {
//       const { id, discount, expiryDate, publishDate, type } = req.body as {
//         id: string;
//         discount: number;
//         expiryDate: string;
//         publishDate: string;
//         type: string;
//       };
//       const updatedVoucher = await prisma.voucher.update({
//         where: { id },
//         data: {
//           discount,
//           expiryDate,
//           publishDate,
//           type,
//         },
//       });
//       res.status(200).json(updatedVoucher);
//     } catch (error) {
//       res.status(500).json({ error: "Failed to update voucher" });
//     }
//   } else if (req.method === "DELETE") {
//     try {
//       const { id } = req.body;

//       // Xóa tất cả các tham chiếu đến voucher trong bảng UserVoucher
//       await prisma.userVoucher.deleteMany({
//         where: { voucherId: id },
//       });

//       // Sau đó xóa voucher
//       const deletedVoucher = await prisma.voucher.delete({ where: { id } });
//       res.status(200).json({ message: "Deleted successfully", deletedVoucher });
//     } catch (error) {
//       res.status(500).json({ error: "Failed to delete voucher" });
//     }
//   } else if (req.method === "PATCH") {
//     const { userId, code } = req.body as { userId: string; code: string };
//     const userVoucher = await prisma.userVoucher.findFirst({
//       where: {
//         userId,
//         voucher: { code },
//         used: false,
//       },
//     });
//     if (userVoucher) {
//       await prisma.userVoucher.update({
//         where: { id: userVoucher.id },
//         data: { used: true },
//       });
//       res.status(200).json({ message: "Voucher used successfully" });
//     } else {
//       res.status(404).json({ message: "Voucher not found or already used" });
//     }
//   }
// }

import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

function generateVoucherCode(length: number): string {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

async function generateUniqueVoucherCode(length: number): Promise<string> {
  let code = "";
  let isUnique = false;
  while (!isUnique) {
    code = generateVoucherCode(length);
    const existingVoucher = await prisma.voucher.findUnique({
      where: { code },
    });
    if (!existingVoucher) {
      isUnique = true;
    }
  }
  return code;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const { voucher: voucherReq } = req.body;

      // Tạo voucher và lưu vào cơ sở dữ liệu
      const voucherPromises = [];
      const userVouchersData = [];

      for (let i = 0; i < voucherReq.quantity; i++) {
        const code = await generateUniqueVoucherCode(6);
        voucherPromises.push(
          prisma.voucher.create({
            data: {
              code,
              discount: voucherReq.discount,
              expiryDate: voucherReq.expiryDate,
              type: voucherReq.type,
              publishDate: voucherReq.publishDate,
            },
          })
        );
      }

      const vouchers = await Promise.all(voucherPromises);

      // Lấy tất cả người dùng và tạo bản ghi userVoucher cho từng voucher
      const users = await prisma.user.findMany();
      for (const voucher of vouchers) {
        for (const user of users) {
          userVouchersData.push({
            userId: user.id,
            voucherId: voucher.id,
          });
        }
      }

      // Batch insert tất cả bản ghi userVoucher
      await prisma.userVoucher.createMany({
        data: userVouchersData,
      });

      res
        .status(200)
        .json({ message: "Vouchers created and assigned successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to create vouchers" });
    }
  } else if (req.method === "GET") {
    try {
      const vouchers = await prisma.voucher.findMany({
        orderBy: {
          discount: "asc",
        },
      });
      res.status(200).json(vouchers);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve vouchers" });
    }
  } else if (req.method === "PUT") {
    try {
      const { id, discount, expiryDate, publishDate, type } = req.body as {
        id: string;
        discount: number;
        expiryDate: string;
        publishDate: string;
        type: string;
      };
      const updatedVoucher = await prisma.voucher.update({
        where: { id },
        data: {
          discount,
          expiryDate,
          publishDate,
          type,
        },
      });
      res.status(200).json(updatedVoucher);
    } catch (error) {
      res.status(500).json({ error: "Failed to update voucher" });
    }
  } else if (req.method === "DELETE") {
    try {
      const { id } = req.body;

      // Xóa tất cả các tham chiếu đến voucher trong bảng UserVoucher
      await prisma.userVoucher.deleteMany({
        where: { voucherId: id },
      });

      // Sau đó xóa voucher
      const deletedVoucher = await prisma.voucher.delete({ where: { id } });
      res.status(200).json({ message: "Deleted successfully", deletedVoucher });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete voucher" });
    }
  } else if (req.method === "PATCH") {
    try {
      const { userId, code } = req.body as { userId: string; code: string };
      const userVoucher = await prisma.userVoucher.findFirst({
        where: {
          userId,
          voucher: { code },
          used: false,
        },
      });
      if (userVoucher) {
        await prisma.userVoucher.update({
          where: { id: userVoucher.id },
          data: { used: true },
        });
        res.status(200).json({ message: "Voucher used successfully" });
      } else {
        res.status(404).json({ message: "Voucher not found or already used" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to use voucher" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
