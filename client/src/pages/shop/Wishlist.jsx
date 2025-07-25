import React, { useEffect } from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RecentProductCard from "@/components/shop/RecentProductCard";
import { useDispatch, useSelector } from "react-redux";
import { fetchWishlist } from "@/store/wishlist-slice"; // adjust the path as needed
import { toast } from "sonner";

const Wishlist = ({ user }) => {
  const dispatch = useDispatch();

  const { wishlist, loading, error } = useSelector((state) => state.wishlist);

  useEffect(() => {
    if (user?._id) {
      dispatch(fetchWishlist())
        .unwrap()
        .catch((err) => toast.error(err));
    }
  }, [user, dispatch]);

  return (
    <TabsContent value="wishlist">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Your WishList</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {loading && <p className="text-gray-500">Loading your wishlist...</p>}

          {!loading && wishlist.length === 0 && (
            <p className="text-gray-500">Your wishlist is currently empty.</p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {!loading &&
              wishlist.map((product) => (
                <RecentProductCard key={product._id} product={product} />
              ))}
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default Wishlist;
