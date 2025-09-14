"use client";

import { useState } from "react";
import ProductReviews from "./ProductReviews";
import AddReviewForm from "./AddReviewForm";

interface ReviewsWrapperProps {
  productId: string;
}

const ReviewsWrapper = ({ productId }: ReviewsWrapperProps) => {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleReviewAdded = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <>
      <ProductReviews productId={productId} refreshKey={refreshKey} />
      <AddReviewForm 
        productId={productId} 
        onReviewAdded={handleReviewAdded} 
      />
    </>
  );
};

export default ReviewsWrapper;