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

  return (
    <>
      <header>{`${user.userName}'s Products`}</header>
      <div>
        {myListing.map((product) => {
          return <MylistingCard product={product} key={product._id} />;
        })}
      </div>
    </>
  );
};

export default ShopListing;
