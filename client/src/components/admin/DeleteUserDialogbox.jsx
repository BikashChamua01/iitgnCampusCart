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
import { Trash } from "lucide-react";

const DeleteUserButton = ({ onDelete, user }) => {
  const shakeStyles = `
  @keyframes shakeOnce {
    0% { transform: translateX(0); }
    15% { transform: translateX(-7px) rotate(-9deg); }
    30% { transform: translateX(6px) rotate(7deg);}
    45% { transform: translateX(-4px) rotate(-6deg); }
    60% { transform: translateX(5px) rotate(7deg);}
    75% { transform: translateX(-2px); }
    100% { transform: translateX(0) rotate(0);}
  }
  /* Button hover applies animation and color to icon: */
  .shake-on-hover:hover .trash-shake { 
    animation: shakeOnce .45s;
    color: white !important;
  }
`;
  return (
    <>
      <style>{shakeStyles}</style>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <button
            type="button"
            className="shake-on-hover cursor-pointer inline-flex items-center gap-2 px-4 py-2 text-sm rounded-full font-semibold bg-violet-50 border border-violet-200 shadow-sm text-violet-700 hover:bg-violet-500 hover:text-white hover:border-violet-400 active:scale-95 transition"
          >
            <Trash className="trash-shake w-5 h-5 text-violet-600 transition-colors" />
            Delete
          </button>
        </AlertDialogTrigger>

        <AlertDialogContent
          className="
            bg-white p-6 rounded-xl shadow-2xl max-w-md w-[90vw]
            animate-scale-in
            transition-transform z-50
          "
        >
          <AlertDialogHeader className="space-y-4 text-center">
            <AlertDialogTitle className="text-xl font-semibold text-gray-900 text-center">
              Are you absolutely sure?
            </AlertDialogTitle>

            <div className="flex justify-center flex-col items-center">
              <img
                src={
                  user.profilePicture
                    ? user.profilePicture.url
                    : "/images/no_profile.jpeg"
                }
                alt="image"
                className="w-24 h-24 rounded-full shadow object-cover"
              />
              <div className="text-sm text-gray-500">{user.email}</div>
            </div>

            <AlertDialogDescription className="text-sm text-gray-600">
              This action cannot be undone. This will permanantly delete this
              user an all the products uploaded by the user
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="mt-4 flex flex-row flex-wrap justify-evenly sm:justify-evenly gap-2">

            <AlertDialogCancel className="bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md px-4 py-2 transition cursor-pointer">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => onDelete(user._id)}
              className="bg-red-500 hover:bg-red-600 text-white rounded-md px-4 py-2 transition cursor-pointer "
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default DeleteUserButton;
