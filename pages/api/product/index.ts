import { NextApiRequest, NextApiResponse } from "next";
import { ProductProps } from "../../../interfaces/product";
import { GetUsersQuery } from "../../../interfaces/user";
import prisma from "../../../lib/prisma";

export default function Product(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const product = req.body.product;
    if (!product) return;
    createProduct(product, res);
  }

  if (req.method === "GET") {
    const query = req.query;
    if (!query) return;
    getProduct(res, query);
  }

  if (req.method === "PUT") {
    const product = req.body.product;
    if (!product) return;
    updateProduct(res, product);
  }

  if (req.method === "DELETE") {
    const id = req.body.id;
    if (!id) return;
    deleteProduct(res, id);
  }
}

async function createProduct(product: ProductProps, res: NextApiResponse) {
  try {
    const category = await prisma.category.findUnique({
      where: { name: product.category },
    });
    if (!category) {
      return res.status(400).json({ error: "Category not found" });
    }
    await prisma.product.create({
      data: {
        name: product.name,
        categoryId: category.id,
        color: product.color,
        description: product.desc,
        price: product.price,
        listImage: product.image,
        size: product.size,
        gender: product.gender,
        quantity: product.quantity,
      },
    });
    res.status(200).json("Create Successful");
  } catch (error) {
    res.status(500).json(error);
  }
}

async function getProduct(res: NextApiResponse, query: GetUsersQuery) {
  const color = query.color ? query.color.split("-") : undefined;
  const colorFull = [
    "black",
    "green",
    "pink",
    "white",
    "red",
    "blue",
    "yellow",
    "lime",
  ];
  const genderFull = ["men", "women", "kids"];
  const order: { [key: string]: "asc" | "desc" } =
    query.sort === "desc-date"
      ? { createdAt: "desc" }
      : query.sort === "desc-price"
      ? { price: "desc" }
      : query.sort === "asc-price"
      ? { price: "asc" }
      : { createdAt: "asc" };

  const categoryFilter =
    query.category && query.category !== "all"
      ? {
          category: {
            is: {
              name: {
                contains: query.category,
                mode: "insensitive" as const,
              },
            },
          },
        }
      : {};

  try {
    const getProd = await prisma.product.findMany({
      skip: (Number(query.page || 1) - 1) * 6,
      take: Number(query.limit),
      include: {
        category: true,
      },
      where: {
        ...categoryFilter,
        name: {
          contains: query.query,
          mode: "insensitive" as const,
        },
        gender: {
          in: query.gender ? query.gender.split("-") : genderFull,
        },
        color: {
          hasSome: color || colorFull,
        },
        price: {
          gt: query.min ? Number(query.min) : 0,
          lt: query.max ? Number(query.max) : 999999999,
        },
      },
      orderBy: order,
    });

    const total = await prisma.product.count({
      where: {
        ...categoryFilter,
        name: {
          contains: query.query,
          mode: "insensitive" as const,
        },
        gender: {
          in: query.gender ? query.gender.split("-") : genderFull,
        },
        color: {
          hasSome: color || colorFull,
        },
        price: {
          gt: query.min ? Number(query.min) : 0,
          lt: query.max ? Number(query.max) : 999999999,
        },
      },
    });

    res.status(200).json({ product: getProd, total });
  } catch (error) {
    res.status(500).json(error);
  }
}

async function updateProduct(res: NextApiResponse, product: ProductProps) {
  try {
    const category = await prisma.category.findUnique({
      where: { name: product.category },
    });

    if (!category) {
      return res.status(400).json({ error: "Category not found" });
    }

    await prisma.product.update({
      where: {
        id: product.id,
      },
      data: {
        name: product.name,
        categoryId: category.id,
        color: product.color,
        description: product.desc,
        price: product.price,
        listImage: product.image,
        size: product.size,
        gender: product.gender,
        quantity: product.quantity,
      },
    });
    res.status(200).json("Update Successful");
  } catch (error) {
    res.status(500).json(error);
  }
}

async function deleteProduct(res: NextApiResponse, id: string) {
  try {
    await prisma.product.delete({
      where: {
        id: id,
      },
    });
    res.status(200).json("Update Successful");
  } catch (error) {
    res.status(500).json(error);
  }
}
