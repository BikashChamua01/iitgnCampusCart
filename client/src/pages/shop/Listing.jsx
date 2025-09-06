import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import MylistingCard from "../../components/shop/MylistingCard";
import { fetchMyListing, fetchAllProducts } from "../../store/product-slice";
import { toast } from "sonner";
import axios from "axios";
import MyListingsEmpty from "@/components/shop/MyListingEmpty";
import { useNavigate } from "react-router-dom";

const ShopListing = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { user } = useSelector((state) => state.auth);
  const { products, myListing } = useSelector((state) => state.shopProducts);
  // console.log(products);

  useEffect(() => {
    dispatch(fetchMyListing(user.userId));
    dispatch(fetchAllProducts());
  }, [dispatch, user.userId]);

  const onEdit = async (productId) => {
    try {
      navigate("/shop/sell", {
        state: {
          productId,
        },
      });
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.msg || "Failed to edit product" );
    }
  };

  const onDelete = async (productId) => {
    setLoading(true);
    try {
      const response = await axios.delete(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/v1/products/delete/${productId}`,
        {
          withCredentials: true,
        }
      );
      if (response.data.success) {
        dispatch(fetchAllProducts());
        dispatch(fetchMyListing(user.userId));
        toast.success("Product deleted Successfully");
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.msg || "Failed to delete product\n");
    } finally {
      setLoading(false);
    }
  };

  if (myListing.length === 0 && !user.isAdmin) return <MyListingsEmpty />;

  return (
    <div className="block w-full min-h-screen">
      <header className="m-auto text-center p-2 text-2xl font-bold mb-1 mt-1 tracking-tight text-violet-700 drop-shadow-sm">
        {!user.isAdmin ? `${user.userName.split(" ")[0]}'s Uploads` : ""}
      </header>
      <div
        className="
  grid grid-cols-1  sm:grid-cols-2 lg:grid-cols-4
  gap-4 sm:gap-6 p-2 sm:p-3 lg:p-4
  max-w-7xl mx-auto
"
      >
        {!user.isAdmin
          ? myListing?.map((product) => (
              <MylistingCard
                isAdmin={user.isAdmin}
                product={product}
                key={product._id}
                onEdit={onEdit}
                onDelete={onDelete}
                loading={loading}
                setLoading={setLoading}
              />
            ))
          : products?.map((product) => (
              <MylistingCard
                isAdmin={user.isAdmin}
                product={product}
                key={product._id}
                onEdit={onEdit}
                onDelete={onDelete}
                loading={loading}
                setLoading={setLoading}
              />
            ))}
      </div>
    </div>
  );
};

export default ShopListing;
