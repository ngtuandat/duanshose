import { useRouter } from "next/router";
import React from "react";

const ArticleDetails = () => {
  const router = useRouter();

  const { id } = router.query;

  return <div>ArticleDetails</div>;
};

export default ArticleDetails;
