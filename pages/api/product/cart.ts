// import { NextApiRequest, NextApiResponse } from "next";
// import prisma from "../../../lib/prisma";
// import { IdProdCart, ProductBuy } from "./../../../interfaces/product.d";

// export default function Cart(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method === "POST") {
//     const product = req.body.product;
//     if (!product) return;
//     addProductToCart(res, product);
//   }

//   if (req.method === "GET") {
//     const id = req.query.id;
//     if (!id) return;
//     getListProductCart(res, String(id));
//   }

//   if (req.method === "DELETE") {
//     const productDl = req.body.productDelete;
//     if (!productDl) return;
//     deleteProd(res, productDl);
//   }

//   if (req.method === "PUT") {
//     const { id, idVoucher, isPay } = req.body;
//     console.log("req.body", req.body);
//     if (!id) return;
//     updateBoughtProd(res, id, idVoucher, isPay);
//   }
// }

// async function addProductToCart(res: NextApiResponse, product: ProductBuy) {
//   try {
//     const productBuy = await prisma.cart.findFirst({
//       where: {
//         idProd: product.id,
//         AND: {
//           userId: product.idUser,
//           bought: false,
//         },
//       },
//     });
//     if (productBuy) {
//       await prisma.cart.update({
//         where: {
//           id: productBuy.id,
//         },
//         data: {
//           quantityProd: productBuy.quantityProd + product.quantity,
//         },
//       });
//       const productInStock = await prisma.product.findUnique({
//         where: { id: product.id },
//         select: { quantity: true },
//       });

//       if (!productInStock || productInStock.quantity < product.quantity) {
//         throw new Error("Không đủ số lượng sản phẩm trong kho");
//       }
//       await prisma.product.update({
//         where: { id: product.id },
//         data: { quantity: { decrement: product.quantity } },
//       });
//     } else {
//       await prisma.cart.create({
//         data: {
//           user: { connect: { id: String(product.idUser) } },
//           idProd: String(product.id),
//           colorProd: product.color,
//           imageProd: String(product.image),
//           nameProd: String(product.name),
//           priceProd: Number(product.price),
//           quantityProd: product.quantity,
//           sizeProd: Number(product.size),
//         },
//       });
//     }

//     res.status(200).json("Add Successful");
//   } catch (error) {
//     res.status(500).json(error);
//   }
// }

// async function getListProductCart(res: NextApiResponse, id: string) {
//   try {
//     const result = await prisma.cart.findMany({
//       where: {
//         userId: id,
//         bought: false,
//       },
//       orderBy: {
//         createdAt: "asc",
//       },
//     });
//     const count = await prisma.cart.count({
//       where: {
//         userId: id,
//         bought: false,
//       },
//     });
//     res.status(200).json({ result, count });
//   } catch (error) {
//     res.status(500).json(error);
//   }
// }

// async function deleteProd(res: NextApiResponse, product: IdProdCart) {
//   try {
//     const productDelete = await prisma.cart.findFirst({
//       where: {
//         idProd: product.idProd,
//         userId: product.idUser,
//         bought: false,
//       },
//     });
//     if (productDelete) {
//       await prisma.cart.delete({
//         where: {
//           id: productDelete.id,
//         },
//       });
//       res.status(200).json("Delete Successful");
//     }
//     res.status(404).json("Not Found");
//   } catch (error) {
//     res.status(500).json(error);
//   }
// }

// // async function updateBoughtProd(
// //   res: NextApiResponse,
// //   id: string,
// //   idVoucher?: string,
// //   isPay?: boolean
// // ) {
// //   try {
// //     console.log("isPay", isPay);

// //     // Fetch cart items and voucher details
// //     const cartItems = await prisma.cart.findMany({
// //       where: {
// //         userId: id,
// //         bought: false,
// //       },
// //     });
// //     if (isPay) {
// //       const updatedCartItems = cartItems.map((cartItem) => {
// //         return {
// //           id: cartItem.id,
// //           bought: true,
// //           finalPrice: 0,
// //         };
// //       });
// //       for (const item of updatedCartItems) {
// //         await prisma.cart.update({
// //           where: { id: item.id },
// //           data: {
// //             bought: true,
// //             finalPrice: item.finalPrice,
// //           },
// //         });
// //       }
// //       res.status(200).json("Bought Successful");
// //       return;
// //     }

// //     if (!idVoucher) {
// //       const updatedCartItems = cartItems.map((cartItem) => {
// //         return {
// //           id: cartItem.id,
// //           bought: true,
// //           finalPrice: cartItem.priceProd,
// //         };
// //       });
// //       for (const item of updatedCartItems) {
// //         await prisma.cart.update({
// //           where: { id: item.id },
// //           data: {
// //             bought: true,
// //             finalPrice: item.finalPrice,
// //           },
// //         });
// //       }
// //       res.status(200).json("Bought Successful");
// //       return;
// //     }

// //     const voucherDiscount = await prisma.voucher.findFirst({
// //       where: {
// //         id: idVoucher,
// //       },
// //     });

// //     if (!voucherDiscount) {
// //       // Handle invalid voucher case
// //       res.status(400).json("Invalid voucher ID");
// //       return;
// //     }

// //     // Calculate final price for each cart item with voucher discount
// //     const updatedCartItems = cartItems.map((cartItem) => {
// //       const discountPerItem = voucherDiscount.discount / cartItems.length || 0; // Handle division by zero
// //       const finalPrice = cartItem.priceProd - discountPerItem;
// //       return {
// //         id: cartItem.id,
// //         bought: true,
// //         pricePaid: finalPrice,
// //       };
// //     });

// //     // Update cart items with final prices (individual updates)
// //     for (const item of updatedCartItems) {
// //       await prisma.cart.update({
// //         where: { id: item.id },
// //         data: {
// //           bought: true,
// //           finalPrice: item.pricePaid,
// //         },
// //       });
// //     }

// //     res.status(200).json({ message: "Bought Successful", updatedCartItems });
// //   } catch (error) {
// //     console.error(error);
// //     res.status(500).json(error);
// //   }
// // }

// async function updateBoughtProd(
//   res: NextApiResponse,
//   id: string,
//   idVoucher?: string,
//   isPay?: boolean
// ) {
//   try {
//     console.log("isPay", isPay);

//     // Fetch cart items and voucher details
//     const cartItems = await prisma.cart.findMany({
//       where: {
//         userId: id,
//         bought: false,
//       },
//     });

//     if (isPay) {
//       const updatedCartItems = cartItems.map((cartItem) => {
//         return {
//           id: cartItem.id,
//           bought: true,
//           finalPrice: 0,
//         };
//       });
//       for (const item of updatedCartItems) {
//         await prisma.cart.update({
//           where: { id: item.id },
//           data: {
//             bought: true,
//             finalPrice: item.finalPrice,
//           },
//         });
//       }
//       res.status(200).json("Bought Successful");
//       return;
//     }

//     if (!idVoucher) {
//       const updatedCartItems = cartItems.map((cartItem) => {
//         return {
//           id: cartItem.id,
//           bought: true,
//           finalPrice: cartItem.priceProd,
//         };
//       });
//       for (const item of updatedCartItems) {
//         await prisma.cart.update({
//           where: { id: item.id },
//           data: {
//             bought: true,
//             finalPrice: item.finalPrice,
//           },
//         });
//       }
//       res.status(200).json("Bought Successful");
//       return;
//     }

//     const voucherDiscount = await prisma.voucher.findFirst({
//       where: {
//         id: idVoucher,
//       },
//     });

//     if (!voucherDiscount) {
//       // Handle invalid voucher case
//       res.status(400).json("Invalid voucher ID");
//       return;
//     }

//     const totalProductPrice = cartItems.reduce(
//       (acc, cartItem) => acc + cartItem.priceProd,
//       0
//     );

//     let discountPerItem = 0;
//     if (voucherDiscount.type === "vnd") {
//       discountPerItem = voucherDiscount.discount / cartItems.length || 0;
//     } else if (voucherDiscount.type === "percent") {
//       const totalDiscountAmount =
//         (totalProductPrice * voucherDiscount.discount) / 100;
//       discountPerItem = totalDiscountAmount / cartItems.length || 0;
//     }

//     // Calculate final price for each cart item with voucher discount
//     const updatedCartItems = cartItems.map((cartItem) => {
//       const finalPrice = Math.max(cartItem.priceProd - discountPerItem, 0); // Ensure final price is not negative
//       return {
//         id: cartItem.id,
//         bought: true,
//         finalPrice: finalPrice,
//       };
//     });

//     // Update cart items with final prices (individual updates)
//     for (const item of updatedCartItems) {
//       await prisma.cart.update({
//         where: { id: item.id },
//         data: {
//           bought: true,
//           finalPrice: item.finalPrice,
//         },
//       });
//     }

//     res.status(200).json({ message: "Bought Successful", updatedCartItems });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json(error);
//   }
// }

import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { IdProdCart, ProductBuy } from "./../../../interfaces/product.d";

export default function Cart(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const product = req.body.product;
    if (!product) return;
    addProductToCart(res, product);
  }

  if (req.method === "GET") {
    const id = req.query.id;
    if (!id) return;
    getListProductCart(res, String(id));
  }

  if (req.method === "DELETE") {
    const productDl = req.body.productDelete;
    if (!productDl) return;
    deleteProd(res, productDl);
  }

  if (req.method === "PUT") {
    const { id, idVoucher, isPay } = req.body;
    console.log("req.body", req.body);
    if (!id) return;
    updateBoughtProd(res, id, idVoucher, isPay);
  }
}

async function addProductToCart(res: NextApiResponse, product: ProductBuy) {
  try {
    const productBuy = await prisma.cart.findFirst({
      where: {
        idProd: product.id,
        AND: {
          userId: product.idUser,
          bought: false,
        },
      },
    });
    if (productBuy) {
      await prisma.cart.update({
        where: {
          id: productBuy.id,
        },
        data: {
          quantityProd: productBuy.quantityProd + product.quantity,
        },
      });
      const productInStock = await prisma.product.findUnique({
        where: { id: product.id },
        select: { quantity: true },
      });

      if (!productInStock || productInStock.quantity < product.quantity) {
        throw new Error("Không đủ số lượng sản phẩm trong kho");
      }
      await prisma.product.update({
        where: { id: product.id },
        data: { quantity: { decrement: product.quantity } },
      });
    } else {
      await prisma.cart.create({
        data: {
          user: { connect: { id: String(product.idUser) } },
          idProd: String(product.id),
          colorProd: product.color,
          imageProd: String(product.image),
          nameProd: String(product.name),
          priceProd: Number(product.price),
          quantityProd: product.quantity,
          sizeProd: Number(product.size),
        },
      });
    }

    res.status(200).json("Add Successful");
  } catch (error) {
    res.status(500).json(error);
  }
}

// async function getListProductCart(res: NextApiResponse, id: string) {
//   try {
//     const result = await prisma.cart.findMany({
//       where: {
//         userId: id,
//         bought: false,
//       },
//       orderBy: {
//         createdAt: "asc",
//       },
//     });
//     const count = await prisma.cart.count({
//       where: {
//         userId: id,
//         bought: false,
//       },
//     });
//     res.status(200).json({ result, count });
//   } catch (error) {
//     res.status(500).json(error);
//   }
// }

async function getListProductCart(res: NextApiResponse, id: string) {
  try {
    const result = await prisma.cart.findMany({
      where: {
        userId: id,
        bought: false,
      },
      orderBy: {
        createdAt: "asc",
      },
      select: {
        id: true,
        idProd: true,
        nameProd: true,
        sizeProd: true,
        priceProd: true,
        finalPrice: true,
        colorProd: true,
        quantityProd: true,
        imageProd: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const productsWithQuantity = await Promise.all(
      result.map(async (cartItem) => {
        const product = await prisma.product.findUnique({
          where: { id: cartItem.idProd },
          select: { quantity: true },
        });
        return {
          ...cartItem,
          productQuantity: product?.quantity || 0,
        };
      })
    );

    const count = await prisma.cart.count({
      where: {
        userId: id,
        bought: false,
      },
    });

    res.status(200).json({ result: productsWithQuantity, count });
  } catch (error) {
    res.status(500).json(error);
  }
}
async function deleteProd(res: NextApiResponse, product: IdProdCart) {
  try {
    const productDelete = await prisma.cart.findFirst({
      where: {
        idProd: product.idProd,
        userId: product.idUser,
        bought: false,
      },
    });
    if (productDelete) {
      await prisma.cart.delete({
        where: {
          id: productDelete.id,
        },
      });
      res.status(200).json("Delete Successful");
    } else {
      res.status(404).json("Not Found");
    }
  } catch (error) {
    res.status(500).json(error);
  }
}

async function updateBoughtProd(
  res: NextApiResponse,
  id: string,
  idVoucher?: string,
  isPay?: boolean
) {
  try {
    console.log("isPay", isPay);

    // Fetch cart items and voucher details
    const cartItems = await prisma.cart.findMany({
      where: {
        userId: id,
        bought: false,
      },
    });

    // Process payment
    if (isPay) {
      const updatedCartItems = cartItems.map((cartItem) => ({
        id: cartItem.id,
        bought: true,
        finalPrice: 0,
      }));

      for (const item of updatedCartItems) {
        await prisma.cart.update({
          where: { id: item.id },
          data: {
            bought: true,
            finalPrice: item.finalPrice,
          },
        });
      }

      // Update product quantities in stock
      for (const item of cartItems) {
        await prisma.product.update({
          where: { id: item.idProd },
          data: { quantity: { decrement: item.quantityProd } },
        });
      }

      res.status(200).json("Bought Successful");
      return;
    }

    if (!idVoucher) {
      const updatedCartItems = cartItems.map((cartItem) => ({
        id: cartItem.id,
        bought: true,
        finalPrice: cartItem.priceProd,
      }));

      for (const item of updatedCartItems) {
        await prisma.cart.update({
          where: { id: item.id },
          data: {
            bought: true,
            finalPrice: item.finalPrice,
          },
        });
      }

      // Update product quantities in stock
      for (const item of cartItems) {
        await prisma.product.update({
          where: { id: item.idProd },
          data: { quantity: { decrement: item.quantityProd } },
        });
      }

      res.status(200).json("Bought Successful");
      return;
    }

    const voucherDiscount = await prisma.voucher.findFirst({
      where: { id: idVoucher },
    });

    if (!voucherDiscount) {
      res.status(400).json("Invalid voucher ID");
      return;
    }

    const totalProductPrice = cartItems.reduce(
      (acc, cartItem) => acc + cartItem.priceProd,
      0
    );

    let discountPerItem = 0;
    if (voucherDiscount.type === "vnd") {
      discountPerItem = voucherDiscount.discount / cartItems.length || 0;
    } else if (voucherDiscount.type === "percent") {
      const totalDiscountAmount =
        (totalProductPrice * voucherDiscount.discount) / 100;
      discountPerItem = totalDiscountAmount / cartItems.length || 0;
    }

    const updatedCartItems = cartItems.map((cartItem) => {
      const finalPrice = Math.max(cartItem.priceProd - discountPerItem, 0);
      return {
        id: cartItem.id,
        bought: true,
        finalPrice: finalPrice,
      };
    });

    for (const item of updatedCartItems) {
      await prisma.cart.update({
        where: { id: item.id },
        data: {
          bought: true,
          finalPrice: item.finalPrice,
        },
      });
    }

    // Update product quantities in stock
    for (const item of cartItems) {
      await prisma.product.update({
        where: { id: item.idProd },
        data: { quantity: { decrement: item.quantityProd } },
      });
    }

    res.status(200).json({ message: "Bought Successful", updatedCartItems });
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
}
