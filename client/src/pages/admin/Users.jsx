import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllUsers } from "@/store/users";
import { fetchAllProducts } from "@/store/product-slice";
import axios from "axios";
import Loader from "@/components/common/Loader";
import { toast } from "sonner";
import DeleteUserButton from "@/components/admin/DeleteUserDialogbox";
import { useNavigate } from "react-router-dom";

const AdminUsers = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { isUsersLoading, users, totalPages } = useSelector(
    (state) => state.adminUsers
  );
  const [limit] = useState(10);
  const [pageNumber, setPageNumber] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchAllUsers({ pageNumber, limit }));
  }, [dispatch, user?.userId, user?.isAdmin, pageNumber, limit]);

  // Mask phone number
  function maskPhone(phone) {
    if (!phone) return "Not provided";
    const firstTwo = phone?.substring(0, 2);
    const lastTwo = phone?.substring(phone.length - 2);
    return firstTwo + "*".repeat(6) + lastTwo;
  }

  function maskEmail(email) {
    if (!email || !email.includes("@")) return "Not provided";

    const [local, domain] = email.split("@");
    if (local.length <= 4) {
      // if very short local part, just show first & last char
      return (
        local[0] +
        "*".repeat(local.length - 2) +
        local[local.length - 1] +
        "@" +
        domain
      );
    }

    const firstTwo = local.substring(0, 2);
    const lastTwo = local.substring(local.length - 2);
    const masked = "*".repeat(local.length - 4);

    return firstTwo + masked + lastTwo + "@" + domain;
  }

  // Delete User
  const handleDelete = async (deleteId) => {
    try {
      const response = await axios.post(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/v1/users/delete-account/${deleteId}`,
        {},
        {
          withCredentials: true,
        }
      );
      if (response.data.success) {
        toast.success("User deleted Successfully");
        dispatch(fetchAllUsers({ pageNumber, limit }));
        dispatch(fetchAllProducts());
        return;
      } else {
        return toast.error("Some Error Ocuured! Can not delete this user");
      }
    } catch (error) {
      console.log(error, "In the delete account function");
    }
  };

  // MOBILE CARD
  const UserCard = ({ user, onDelete }) => (
    <div className="md:hidden bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-violet-100 mb-5 p-5 text-sm py-2 flex flex-col gap-3 transition hover:shadow-2xl hover:scale-[1.025] duration-200 w-[95vw]">
      <div className="flex items-center gap-4">
        <img
          src={
            user.profilePicture
              ? user.profilePicture.url
              : "/images/no_profile.jpeg"
          }
          alt="User"
          className="w-14 h-14 rounded-full border-2 border-violet-200 shadow-inner object-cover"
        />
        <div>
          <div
            className="font-semibold text-lg text-violet-700 cursor-pointer"
            onClick={() =>
              navigate(`/admin/user/listings/${user._id}`, { state: { user } })
            }
          >
            {user.userName}
          </div>
          <div className="text-xs text-gray-500">{maskEmail(user.email)}</div>
        </div>
      </div>
      <div className="flex flex-wrap gap-4 mt-0 text-[15px] sm:text-base">
        <span>
          <span className="font-bold text-violet-500">Phone:</span>{" "}
          {maskPhone(user.phoneNumber)}
        </span>
        <span>
          <span className="font-bold text-violet-500">Gender:</span>{" "}
          {user.gender}
        </span>
      </div>
      <div className="flex mt-1">
        <DeleteUserButton onDelete={onDelete} user={user} />
      </div>
    </div>
  );

  // DESKTOP TABLE ROW
  const UserRow = ({ user, onDelete }) => (
    <tr className="bg-white transition hover:bg-violet-50 duration-150">
      <td className="py-3 px-4">
        <img
          src={
            user.profilePicture
              ? user.profilePicture.url
              : "/images/no_profile.jpeg"
          }
          alt="User"
          className="w-10 h-10 rounded-full border-2 border-violet-200 shadow-inner object-cover"
        />
      </td>
      <td
        className="font-semibold text-violet-700 cursor-pointer"
        onClick={() =>
          navigate(`/admin/user/listings/${user._id}`, { state: { user } })
        }
      >
        {user.userName}
      </td>
      <td>{maskEmail(user.email)}</td>
      <td>{maskPhone(user.phoneNumber)}</td>
      <td>{user.gender}</td>
      <td>
        <DeleteUserButton onDelete={onDelete} user={user} />
      </td>
    </tr>
  );

  return isUsersLoading ? (
    <Loader />
  ) : (
    <div className="bg-gradient-to-br from-violet-50 via-white to-violet-100 min-h-screen pt-2 pb-14 px-1 sm:px-4">
      <div className="max-w-3xl md:max-w-7xl mx-auto pt-1">
        <h2 className=" m-auto text-[2rem] sm:text-[2.4rem] font-extrabold mb-3 text-violet-700 tracking-tight text-center">
          User Management
        </h2>
        {/* Mobile Cards */}
        <div className="mx-2">
          {users?.map((u) => (
            <UserCard key={u._id} user={u} onDelete={handleDelete} />
          ))}
        </div>

        {/* Desktop Table */}
        <div className="desktop-table rounded-2xl overflow-hidden hidden md:block shadow-lg">
          <table className="w-full bg-white">
            <thead className="bg-violet-50">
              <tr>
                <th className="py-3 px-4 text-left font-bold text-violet-700">
                  Photo
                </th>
                <th className="py-3 px-4 text-left font-bold text-violet-700">
                  Name
                </th>
                <th className="py-3 px-4 text-left font-bold text-violet-700">
                  Email
                </th>
                <th className="py-3 px-4 text-left font-bold text-violet-700">
                  Phone
                </th>
                <th className="py-3 px-4 text-left font-bold text-violet-700">
                  Gender
                </th>
                <th className="py-3 px-4 text-left font-bold text-violet-700">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {users?.map((u) => (
                <UserRow key={u._id} user={u} onDelete={handleDelete} />
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-10 flex flex-wrap justify-end gap-3 items-center">
          <button
            onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
            disabled={pageNumber === 1}
            className="px-4 py-2 rounded-full text-violet-600 bg-violet-100 border border-violet-200 shadow-sm font-medium hover:bg-violet-400 hover:text-white hover:border-violet-400 transition active:scale-95 disabled:opacity-50"
          >
            Prev
          </button>
          <span className="px-6 py-2 rounded-full bg-violet-50 text-violet-700 font-semibold shadow flex items-center">
            Page {pageNumber} of {totalPages || "?"}
          </span>
          <button
            onClick={() => setPageNumber((prev) => prev + 1)}
            disabled={pageNumber === totalPages}
            className="px-4 py-2 rounded-full text-violet-600 bg-violet-100 border border-violet-200 shadow-sm font-medium hover:bg-violet-400 hover:text-white hover:border-violet-400 transition active:scale-95 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
