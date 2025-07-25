import React, { useEffect } from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RecentProductCard from "@/components/shop/RecentProductCard";
import { useDispatch, useSelector } from "react-redux";
import { fetchWishlist } from "@/store/wishlist-slice";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
// import Skeleton from "react-loading-skeleton"; // optional
// import "react-loading-skeleton/dist/skeleton.css";

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

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1 },
    }),
  };

  return (
    <TabsContent value="wishlist">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Your Wishlist</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} height={250} borderRadius={12} />
              ))}
            </div>
          )}

          {!loading && wishlist.length === 0 && (
            <p className="text-gray-500">Your wishlist is currently empty.</p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {!loading &&
                wishlist.map((product, index) => (
                  <motion.div
                    key={product._id}
                    custom={index}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    <RecentProductCard product={product} />
                  </motion.div>
                ))}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default Wishlist;
