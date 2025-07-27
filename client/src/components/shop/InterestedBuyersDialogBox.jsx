import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "../ui/alert-dialog";
import axios from "axios";
import { toast } from "sonner";

const InterestedBuyersDialogBox = ({ productId }) => {
  const [open, setOpen] = useState(false);
  const [buyers, setBuyers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchBuyers = async () => {
      if (!open || !productId) return;
      setLoading(true);
      try {
        console.log(user.userId);
        const res = await axios.get(`/api/v1/interested/get-buy-requests`, {
          params: { productId, sellerId: user.userId },
          withCredentials: true,
        });
        const data = res.data;
        if (data?.success) {
          setBuyers(data.buyRequests || []);
        } else {
          toast.error(data.msg || "Failed to load interested buyers.");
        }
      } catch (error) {
        toast.error(error?.msg || error?.message || "Error fetching buyers.");
      } finally {
        setLoading(false);
      }
    };

    fetchBuyers();
  }, [open, productId,user.userId]);
  console.log(buyers);

  return (
    <AlertDialog open={open} onOpenChange={setOpen} className="mx-2 sm:mx-0">
      <AlertDialogTrigger asChild>
        <button className="custom-button outline-none">
          View Interested Buyers
        </button>
      </AlertDialogTrigger>

      {open && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity duration-300"
          aria-hidden="true"
          onClick={() => setOpen(false)}
        />
      )}

      {open && (
        <AlertDialogContent
          asChild
          className="
            fixed top-1/2 left-1/2 z-50 max-w-lg w-[95%] sm:w-full rounded-xl bg-white border border-gray-200 shadow-lg
            transform -translate-x-1/2 -translate-y-1/2 p-6 pointer-events-auto
            transition-transform duration-300 scale-100 opacity-100
          "
        >
          <div>
            <AlertDialogHeader className="mb-4 space-y-2">
              <AlertDialogTitle className="text-xl font-bold text-violet-700 text-center">
                Interested Buyers
              </AlertDialogTitle>
              <AlertDialogDescription className="text-sm text-gray-500 text-center">
                List of buyers who have shown interest in this product.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <div className="max-h-64 overflow-y-auto mt-2 space-y-4">
              {loading ? (
                <p className="text-center text-gray-500">Loading buyers...</p>
              ) : buyers.length === 0 ? (
                <p className="text-center text-gray-400">
                  No interested buyers yet.
                </p>
              ) : (
                buyers.map((buyer, index) => (
                  <div
                    key={index}
                    className="border border-gray-300 rounded-lg p-3 bg-gray-50 text-sm shadow-sm"
                  >
                    <p className="font-semibold text-violet-700">
                      {buyer.buyer.userName || "Unknown Buyer"}
                    </p>
                    <p className="text-gray-600 text-xs">{buyer.buyer.email}</p>
                    <p className="text-gray-600 text-xs">
                      {buyer.buyer.phoneNumber}
                    </p>

                    <p className="mt-2 text-gray-800">{buyer.buyerMessage}</p>
                  </div>
                ))
              )}
            </div>

            <AlertDialogFooter className="mt-6 flex justify-center">
              <AlertDialogCancel
                className="
                  flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-xl border
                  border-violet-100 text-violet-700 bg-white
                  hover:bg-violet-50 hover:border-violet-200
                  transition shadow-sm cursor-pointer
                "
              >
                <span aria-hidden="true" className="text-lg leading-none">
                  ×
                </span>
                Close
              </AlertDialogCancel>
            </AlertDialogFooter>
          </div>
        </AlertDialogContent>
      )}
    </AlertDialog>
  );
};

export default InterestedBuyersDialogBox;
