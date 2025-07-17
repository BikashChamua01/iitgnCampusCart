import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllUsers } from "@/store/users";
import { Trash } from "lucide-react";

// Inline shake animation for Trash icon only
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
`;

function ShakeTrashIcon({ className = "", ...props }) {
  const [shaking, setShaking] = useState(false);

  // Start shake on icon mouse enter
  const triggerShake = (e) => {
    setShaking(false); // Immediate reset for repeated triggers
    setTimeout(() => setShaking(true), 12);
    setTimeout(() => setShaking(false), 430);
    if (props.onMouseEnter) props.onMouseEnter(e);
  };

  return (
    <span
      className={`inline-flex ${shaking ? "animate-shakeOnce" : ""}`}
      style={shaking ? { animation: "shakeOnce .45s" } : {}}
      onMouseEnter={triggerShake}
    >
      <Trash {...props} className={className} />
      <style>{shakeStyles}</style>
    </span>
  );
}

const AdminUsers = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { isUsersLoading, users, totalPages } = useSelector(
    (state) => state.adminUsers
  );
  const [limit] = useState(15);
  const [pageNumber, setPageNumber] = useState(1);

  useEffect(() => {
    dispatch(fetchAllUsers({ pageNumber, limit }));
  }, [dispatch, user?.userId, user?.isAdmin, pageNumber, limit]);

  // Placeholder for delete logic
  const handleDelete = (deleteId) => {
    console.log(deleteId);
    // dispatch(deleteUser(deleteId));
  };

  // MOBILE CARD
  const UserCard = ({ user, onDelete }) => (
    <div className="md:hidden bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-violet-100 mb-5 p-5 flex flex-col gap-4 transition hover:shadow-2xl hover:scale-[1.025] duration-200">
      <div className="flex items-center gap-4">
        <img
          src={user.profilePicture ? user.profilePicture.url : "/images/no_profile.jpeg"}
          alt="User"
          className="w-14 h-14 rounded-full border-2 border-violet-200 shadow-inner object-cover"
        />
        <div>
          <div className="font-semibold text-lg text-violet-700">{user.userName}</div>
          <div className="text-xs text-gray-500">{user.email}</div>
        </div>
      </div>
      <div className="flex flex-wrap gap-4 mt-1 text-[15px] sm:text-base">
        <span><span className="font-bold text-violet-500">Phone:</span> {user.phoneNumber}</span>
        <span><span className="font-bold text-violet-500">Gender:</span> {user.gender}</span>
      </div>
      <div className="flex mt-3">
        <button
          onClick={() => onDelete(user._id)}
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold bg-violet-50 border border-violet-200 shadow-sm text-violet-700 hover:bg-violet-500 hover:text-white hover:border-violet-400 active:scale-95 transition"
        >
          <ShakeTrashIcon className="w-5 h-5 text-violet-600" />
          Delete
        </button>
      </div>
    </div>
  );

  // DESKTOP TABLE ROW
  const UserRow = ({ user, onDelete }) => (
    <tr className="bg-white transition hover:bg-violet-50 duration-150">
      <td className="py-3 px-4">
        <img
          src={user.profilePicture ? user.profilePicture.url : "/images/no_profile.jpeg"}
          alt="User"
          className="w-10 h-10 rounded-full border-2 border-violet-200 shadow-inner object-cover"
        />
      </td>
      <td className="font-semibold text-violet-700">{user.userName}</td>
      <td>{user.email}</td>
      <td>{user.phoneNumber}</td>
      <td>{user.gender}</td>
      <td>
        <button
          onClick={() => onDelete(user._id)}
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold bg-violet-50 border border-violet-200 shadow-sm text-violet-700 hover:bg-violet-500 hover:text-white hover:border-violet-400 active:scale-95 transition"
        >
          <ShakeTrashIcon className="w-5 h-5 text-violet-600 hover:text-white" />
          Delete
        </button>
      </td>
    </tr>
  );

  return (
    <div className="bg-gradient-to-br from-violet-50 via-white to-violet-100 min-h-screen pt-2 pb-14 px-1 sm:px-4">
      <div className="max-w-3xl md:max-w-7xl mx-auto pt-7">
        <h2 className="text-[2rem] sm:text-[2.4rem] font-extrabold mb-7 text-violet-700 tracking-tight">
          User Management
        </h2>
        {/* Mobile Cards */}
        {users?.map((u) => (
          <UserCard key={u._id} user={u} onDelete={handleDelete} />
        ))}

        {/* Desktop Table */}
        <div className="desktop-table rounded-2xl overflow-hidden hidden md:block shadow-lg">
          <table className="w-full bg-white">
            <thead className="bg-violet-50">
              <tr>
                <th className="py-3 px-4 text-left font-bold text-violet-700">Photo</th>
                <th className="py-3 px-4 text-left font-bold text-violet-700">Name</th>
                <th className="py-3 px-4 text-left font-bold text-violet-700">Email</th>
                <th className="py-3 px-4 text-left font-bold text-violet-700">Phone</th>
                <th className="py-3 px-4 text-left font-bold text-violet-700">Gender</th>
                <th className="py-3 px-4 text-left font-bold text-violet-700">Action</th>
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
            onClick={() => setPageNumber(prev => Math.max(prev - 1, 1))}
            disabled={pageNumber === 1}
            className="px-4 py-2 rounded-full text-violet-600 bg-violet-100 border border-violet-200 shadow-sm font-medium hover:bg-violet-400 hover:text-white hover:border-violet-400 transition active:scale-95 disabled:opacity-50"
          >
            Prev
          </button>
          <span className="px-6 py-2 rounded-full bg-violet-50 text-violet-700 font-semibold shadow flex items-center">
            Page {pageNumber} of {totalPages || "?"}
          </span>
          <button
            onClick={() => setPageNumber(prev => prev+1)}
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
