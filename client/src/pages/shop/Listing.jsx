import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import MylistingCard from "../../components/shop/MylistingCard";
import { fetchMyListing, fetchAllProducts } from "../../store/product-slice";
import { toast } from "sonner";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const ShopListing = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { products, myListing } = useSelector((state) => state.shopProducts);

  useEffect(() => {
    dispatch(fetchMyListing(user.userId));
  }, [dispatch, user.userId]);

  const onEdit = async (productId) => {
    try {
      navigate("/shop/sell");
    } catch (error) {
      console.log(error);
      toast.error("Failed to edit product", error);
    }
  };

  const onDelete = async (productId) => {
    try {
      const response = await axios.delete(
        `/api/v1/products/delete/${productId}`,
        {
          withCredentials: true,
        }
      );
      if (response.data.success) {
        dispatch(fetchAllProducts);
        dispatch(fetchMyListing(user.userId));
        toast.success("Product deleted Successfully");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete product", error);
    }
  };

  return (
    <>
      <header>{`${user.userName}'s Products`}</header>
      <div
        className="
  grid grid-cols-1  sm:grid-cols-2 lg:grid-cols-4
  gap-4 sm:gap-6 p-2 sm:p-4 lg:p-6
  max-w-7xl mx-auto
"
      >
        {myListing.map((product) => (
          <MylistingCard
            product={product}
            key={product._id}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </>
  );
};

export default ShopListing;
