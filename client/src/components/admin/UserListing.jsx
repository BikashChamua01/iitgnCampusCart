import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import MyListingCard from "../shop/MylistingCard";

const AdminUserListing = () => {
  const { userId } = useParams();
  const [listings, setListings] = useState([]);
  const navigate = useNavigate();
  const admin = useSelector((state) => state.auth.user.isAdmin);
  const location = useLocation();
  const user = location.state.user;

    console.log(user, " From the uselisting ");
  const fetchUserListings = async () => {
    const response = await axios.get(`/api/v1/products/my-listings/${userId}`, {
      withCredentials: true,
    });
    setListings(response.data.products);
  };

  useEffect(() => {
    fetchUserListings();
  }, [userId]);

  const onEdit = async (productId) => {
    try {
      navigate("/shop/sell", {
        state: {
          productId,
        },
      });
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
        fetchUserListings();
        toast.success("Product deleted Successfully");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete product", error);
    }
  };

  return (
    <div className=" w-full p-2 lg:px-10 min-h-screen pb-5">
      <h1 className="w-full text-violet-700 text-center text-2xl lg:text-3xl font-bold mb-2 md:mb-8 underline text-shadow-fuchsia-300" >{user?.userName.split(" ")?.[0]}'s Uploads</h1>
      <div className="w-full grid sm:grid-cols-3 lg:grid-cols-4 gap:1 lg:gap-6  items-center">
        {listings.map((product) => (
          <MyListingCard
            isAdmin={admin}
            product={product}
            key={product._id}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default AdminUserListing;
