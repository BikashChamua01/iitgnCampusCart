import React, { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "../ui/alert-dialog";
import axios from "axios";
import { toast } from "sonner";
import { useSelector } from "react-redux";

const BuyRequestDialogBox = ({ imageUrl, product }) => {
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const { user } = useSelector((state) => state.auth);

  // Prevent background scroll and interaction when dialog open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      document.body.style.pointerEvents = "none";
    } else {
      document.body.style.overflow = "";
      document.body.style.pointerEvents = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.pointerEvents = "";
    };
  }, [open]);

  // Enable pointer events only on dialog when open
  // We'll add pointer-events-auto on the dialog content wrapper

  const handleBuyRequest = async () => {
    console.log("Hello");
    if (!message.trim()) {
      toast.error("Please add a message before sending.");
      return;
    }
    setSending(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/interested/mark-interested`,
        {
          productId: product._id,
          buyerMessage: message,
        },
        {
          withCredentials: true,
        }
      );
      const data = response.data;
      if (data?.success) {
        setMessage("");
        setOpen(false);
        toast.success(
          data.msg || data.message || "Your interest is sent to the seller"
        );
      } else {
        toast.error(data.msg || "Failed to send");
      }
    } catch (error) {
      toast.error(error?.msg || error?.message || "Failed to send");
      console.error(error);
    } finally {
      setSending(false);
    }
  };

  return (
    <AlertDialog
      open={open}
      onOpenChange={setOpen}
      product={product}
      className="mx-2 sm:mx-0"
    >
      <AlertDialogTrigger asChild>
        <button
          className="custom-button mb-1 outline-none"
          disabled={user.userId === product?.seller?._id}
        >
          {user.userId === product?.seller?._id ? "Your upload" : "Buy Request"}
        </button>
      </AlertDialogTrigger>

      {open && (
        // Backdrop with fade effect
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
          object-center
          mx-1 sm:mx-0
            fixed top-1/2 left-1/2 z-50 max-w-lg w-[95%] sm:w-full rounded-xl bg-white border border-gray-200 shadow-lg
            transform -translate-x-1/2 -translate-y-1/2 p-6
            transition-transform duration-300
            pointer-events-auto
            scale-100 opacity-100
          "
        >
          <div>
            <AlertDialogHeader className="mb-4 space-y-2">
              <AlertDialogTitle className="text-xl font-bold text-violet-700 text-center">
                Send a Buy Request
              </AlertDialogTitle>
              <AlertDialogDescription className="text-sm text-gray-500 text-center">
                Add a short message for the seller. Mention your offer, payment
                method, or any specific instructions.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <div className="w-full">
              <div className="w-full flex items-center justify-center mb-3">
                <img
                  src={imageUrl}
                  alt="Product"
                  className="w-1/2 max-h-60 object-cover rounded-2xl"
                  loading="lazy"
                />
              </div>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                placeholder="Hi, I'm interested in your product. I can pay via UPI today itself. Please let me know..."
                className="
                  w-full p-3 border border-gray-800 rounded-md text-sm text-gray-800 resize-none bg-gray-50 placeholder-gray-400
                  focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent
                  transition
                "
                disabled={sending}
              />
            </div>

            <AlertDialogFooter className="mt-6 grid grid-cols-2 sm:flex justify-center gap-3">
              <AlertDialogCancel
                disabled={sending}
                className="
                  flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-xl border
                  border-violet-100 text-violet-700 bg-white
                  hover:bg-violet-50 hover:border-violet-200
                  transition shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed
                "
              >
                {/* Unicode heavy multiply × */}
                <span aria-hidden="true" className="text-lg leading-none">
                  ×
                </span>
                Cancel
              </AlertDialogCancel>

              <AlertDialogAction
                onClick={handleBuyRequest}
                disabled={sending}
                className="
                  custom-button flex items-center gap-1 max-w-fit px-4 py-2 text-sm font-semibold
                  transition-transform duration-150 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed
                "
              >
                {/* Unicode paper plane */}
                <span aria-hidden="true" className="text-lg leading-none">
                  ✈
                </span>
                {sending ? "Sending..." : "Send Request"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </div>
        </AlertDialogContent>
      )}
    </AlertDialog>
  );
};

export default BuyRequestDialogBox;
