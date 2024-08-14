import axios from "axios";
import { ProductBuy, ProductProps, IdProdCart } from "../../interfaces/product";
import { GetUsersQuery } from "../../interfaces/user";
import { CommentReview } from "./../../interfaces/product.d";

export const CreateProduct = async (product: ProductProps) => {
  return await axios.post("/api/product", { product });
};

export const getAllProducts = async (query: GetUsersQuery) => {
  return await axios.get("/api/product", { params: query });
};

export const getAllProductsManage = async (query: GetUsersQuery) => {
  return await axios.get("/api/product/manage", { params: query });
};

export const UpdateProduct = async (product: ProductProps) => {
  return await axios.put("/api/product", { product });
};

export const deleteProduct = async (id: string) => {
  return await axios.delete("/api/product", { data: { id } });
};

export const getDetailProduct = async (id: string) => {
  return await axios.get("/api/product/detail", { params: { id } });
};

export const addReview = async (comment: CommentReview) => {
  return await axios.post("/api/product/review", { comment });
};

export const addToCart = async (product: ProductBuy) => {
  return await axios.post("/api/product/cart", { product });
};

export const getProductCart = async (id: string) => {
  return await axios.get("/api/product/cart", { params: { id } });
};

export const getRatingStarProd = async (id: string) => {
  return await axios.get("/api/product/review", { params: { id } });
};

export const plusQuantityCart = async (product: IdProdCart) => {
  return await axios.post("/api/product/plus", { product });
};

export const miniusQuantityCart = async (product: IdProdCart) => {
  return await axios.post("/api/product/minius", { product });
};

export const deleteProdCart = async (productDelete: IdProdCart) => {
  return await axios.delete("/api/product/cart", { data: { productDelete } });
};

export const boughtProduct = async (
  id: string,
  idVoucher?: string,
  isPay?: boolean
) => {
  try {
    return await axios.put("/api/product/cart", { id, idVoucher, isPay });
  } catch (error) {
    console.log(error);
  }
};

export const getPurchaseOrder = async (id: string) => {
  return await axios.get("/api/product/purchase", { params: { id } });
};

export const getPurchaseAll = async () => {
  return await axios.get("/api/product/purchase-all");
};

export const deletePurchase = async (id: string) => {
  return await axios.delete("/api/product/purchase", { data: { id } });
};
