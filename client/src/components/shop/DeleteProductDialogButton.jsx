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

const DeleteConfirmDialog = ({ onConfirm }) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button
          className="flex-1 py-1 text-xs font-medium rounded-full
          bg-red-100 text-red-600
          hover:bg-red-200 hover:shadow-lg hover:shadow-red-200
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-red-300
          cursor-pointer flex items-center justify-center gap-1"
        >
          <FaTrash className="text-xs" /> Delete
        </button>
      </AlertDialogTrigger>

      <AlertDialogContent
        className="
          w-full max-w-md rounded-xl border border-gray-200
          bg-white p-6 shadow-lg transition-all duration-300
          animate-in zoom-in-90 fade-in-0
          data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-90
        "
      >
        <AlertDialogHeader className="space-y-2">
          <AlertDialogTitle className="text-lg font-semibold text-gray-900">
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-gray-500">
            This action cannot be undone. This will permanently delete your
            product.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-4 flex justify-end gap-2">
          <AlertDialogCancel
            className="
              px-4 py-2 text-sm font-medium rounded-md border border-gray-300
              text-gray-700 hover:bg-gray-100 transition cursor-pointer
            "
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="
              px-4 py-2 text-sm font-medium rounded-md
              bg-red-600 text-white hover:bg-red-700
              transition cursor-pointer
            "
          >
            Yes, Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteConfirmDialog;
