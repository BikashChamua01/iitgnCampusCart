import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import MylistingCard from "../../components/shop/MylistingCard";
import { fetchMyListing } from "../../store/product-slice";

const ShopListing = () => {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  useEffect(() => {
    dispatch(fetchMyListing(user.userId));
  }, [dispatch, user.userId]);

  const { myListing, myListingsLoading } = useSelector(
    (state) => state.shopProducts
  );

  const onEdit = () => {
    console.log("Edit");
  };
  const onDelete = () => {
    console.log("Delete");
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
