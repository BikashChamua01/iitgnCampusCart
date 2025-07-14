import React from "react";
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
import { FaTrash } from "react-icons/fa";

const DeleteImageButton = ({ onDelete, image }) => {
  return (
    <>
      <style>
        {`
        @keyframes scaleIn {
          0% { opacity: 0; transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes scaleOut {
          0% { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(0.9); }
        }
        .animate-scale-in {
          animation: scaleIn 200ms ease-out forwards;
        }
        .animate-scale-out[data-state="closed"] {
          animation: scaleOut 150ms ease-in forwards;
        }
        `}
      </style>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <button className="text-red-500 hover:text-red-700 transition cursor-pointer focus:outline-none focus:ring-0">
            <FaTrash className="text-base" />
          </button>
        </AlertDialogTrigger>

        <AlertDialogContent
          className="
            bg-white p-6 rounded-xl shadow-2xl max-w-md w-full
            animate-scale-in
            transition-transform z-50
          "
        >
          <AlertDialogHeader className="space-y-4 text-center">
            <AlertDialogTitle className="text-xl font-semibold text-gray-900">
              Are you absolutely sure?
            </AlertDialogTitle>

            <div className="flex justify-center">
              <img
                src={image}
                alt="image"
                className="w-24 h-24 rounded-lg shadow object-cover"
              />
            </div>

            <AlertDialogDescription className="text-sm text-gray-600">
              This action cannot be undone. The image will be permanently
              deleted from your product.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="mt-6 flex justify-end gap-2">
            <AlertDialogCancel className="bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md px-4 py-2 transition cursor-pointer">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={onDelete}
              className="bg-red-500 hover:bg-red-600 text-white rounded-md px-4 py-2 transition cursor-pointer"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default DeleteImageButton;
