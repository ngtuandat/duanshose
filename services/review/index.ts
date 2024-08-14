import axios from "axios";

export const getFullReview = () => {
  return axios.get("/api/product/review-admin");
};
