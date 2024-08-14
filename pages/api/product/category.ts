import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET":
      return getCategories(req, res);
    case "POST":
      return createCategory(req, res);
    case "PUT":
      return updateCategory(req, res);
    case "DELETE":
      return deleteCategory(req, res);
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

async function getCategories(req: NextApiRequest, res: NextApiResponse) {
  try {
    const categories = await prisma.category.findMany();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: "Có lỗi xảy ra khi lấy danh mục." });
  }
}

async function createCategory(req: NextApiRequest, res: NextApiResponse) {
  const { name } = req.body.data;
  console.log({ nameqwe: req.body });
  try {
    const newCategory = await prisma.category.create({
      data: {
        name,
      },
    });
    res.status(200).json(newCategory);
  } catch (error) {
    res.status(500).json({ error: "Có lỗi xảy ra khi tạo danh mục." });
  }
}

async function updateCategory(req: NextApiRequest, res: NextApiResponse) {
  const { id, name } = req.body;
  try {
    const updatedCategory = await prisma.category.update({
      where: { id },
      data: { name },
    });
    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(500).json({ error: "Có lỗi xảy ra khi cập nhật danh mục." });
  }
}

async function deleteCategory(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.body;
  try {
    await prisma.category.delete({
      where: { id },
    });
    res.status(200).json({ message: "Xóa danh mục thành công." });
  } catch (error) {
    res.status(500).json({ error: "Có lỗi xảy ra khi xóa danh mục." });
  }
}
