// // import { NextApiRequest, NextApiResponse } from "next";
// // import prisma from "../../../lib/prisma";
// // import { IdProdCart, ProductBuy } from "./../../../interfaces/product.d";

// // export default function Purchase(req: NextApiRequest, res: NextApiResponse) {
// //   if (req.method === "GET") {
// //     const id = req.query.id;
// //     if (!id) return;
// //     getListProductPurchase(res, String(id));
// //   }

// //   if (req.method === "DELETE") {
// //     const id = req.body.id;
// //     if (!id) return;
// //     deletePurchaseOrder(res, id);
// //   }

// //   if (req.method === "PATCH") {
// //     const { id, status } = req.body;
// //     if (!id || !status) return;
// //     updateOrderStatus(res, id, status);
// //   }
// // }

// // async function getListProductPurchase(res: NextApiResponse, id: string) {
// //   try {
// //     const result = await prisma.cart.findMany({
// //       where: {
// //         userId: id,
// //         bought: true,
// //       },
// //       orderBy: {
// //         updatedAt: "desc",
// //       },
// //     });
// //     res.status(200).json({ result });
// //   } catch (error) {
// //     res.status(500).json(error);
// //   }
// // }

// // async function deletePurchaseOrder(res: NextApiResponse, id: string) {
// //   try {
// //     await prisma.cart.delete({
// //       where: {
// //         id: id,
// //       },
// //     });
// //     res.status(200).json("Delete Successful");
// //   } catch (error) {
// //     res.status(500).json(error);
// //   }
// // }

// // async function updateOrderStatus(
// //   res: NextApiResponse,
// //   id: string,
// //   status: string
// // ) {
// //   try {
// //     await prisma.cart.update({
// //       where: {
// //         id: id,
// //       },
// //       data: {
// //         status: status,
// //       },
// //     });
// //     res.status(200).json("Update Successful");
// //   } catch (error) {
// //     res.status(500).json(error);
// //   }
// // }

// import { NextApiRequest, NextApiResponse } from "next";
// import prisma from "../../../lib/prisma";

// export default async function Purchase(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   if (req.method === "GET") {
//     const id = req.query.id as string;
//     if (!id) return res.status(400).json({ error: "ID is required" });
//     await getListProductPurchase(res, id);
//   } else if (req.method === "PATCH") {
//     const { id, status } = req.body;
//     if (!id || !status)
//       return res.status(400).json({ error: "ID and status are required" });
//     await updateOrderStatus(res, id, status);
//   } else {
//     res.status(405).json({ error: "Method Not Allowed" });
//   }
// }

// async function getListProductPurchase(res: NextApiResponse, id: string) {
//   try {
//     const result = await prisma.cart.findMany({
//       where: {
//         userId: id,
//         bought: true,
//       },
//       orderBy: {
//         updatedAt: "desc",
//       },
//     });
//     res.status(200).json({ result });
//   } catch (error) {
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// }

// async function updateOrderStatus(
//   res: NextApiResponse,
//   id: string,
//   status: string
// ) {
//   try {
//     await prisma.cart.update({
//       where: {
//         id: id,
//       },
//       data: {
//         status: status,
//       },
//     });
//     res.status(200).json({ message: "Update Successful" });
//   } catch (error) {
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// }

import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function Purchase(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const id = req.query.id as string;
    if (!id) return res.status(400).json({ error: "ID is required" });
    await getListProductPurchase(res, id);
  } else if (req.method === "DELETE") {
    const id = req.body.id as string;
    if (!id) return res.status(400).json({ error: "ID is required" });
    await deletePurchaseOrder(res, id);
  } else if (req.method === "PATCH") {
    const { id, status } = req.body;
    if (!id || !status)
      return res.status(400).json({ error: "ID and status are required" });
    await updateOrderStatus(res, id, status);
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}

async function getListProductPurchase(res: NextApiResponse, id: string) {
  try {
    const result = await prisma.cart.findMany({
      where: {
        userId: id,
        bought: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
    res.status(200).json({ result });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function deletePurchaseOrder(res: NextApiResponse, id: string) {
  try {
    await prisma.cart.delete({
      where: {
        id: id,
      },
    });
    res.status(200).json({ message: "Delete Successful" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// async function updateOrderStatus(
//   res: NextApiResponse,
//   id: string,
//   status: string
// ) {
//   try {
//     await prisma.cart.update({
//       where: {
//         id: id,
//       },
//       data: {
//         status: status,
//       },
//     });
//     res.status(200).json({ message: "Update Successful" });
//   } catch (error) {
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// }

async function updateOrderStatus(
  res: NextApiResponse,
  id: string,
  status: string
) {
  try {
    // Lấy thông tin đơn hàng trước khi cập nhật
    const order = await prisma.cart.findUnique({
      where: { id: id },
    });

    if (order) {
      // Nếu trạng thái mới là "cancelled", cộng lại số lượng sản phẩm
      if (status === "cancelled" || status === "returns") {
        await prisma.product.update({
          where: { id: order.idProd },
          data: { quantity: { increment: order.quantityProd } },
        });
      }

      // Cập nhật trạng thái đơn hàng
      await prisma.cart.update({
        where: { id: id },
        data: { status: status },
      });
    }

    res.status(200).json({ message: "Update Successful" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}
