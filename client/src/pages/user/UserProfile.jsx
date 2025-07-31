import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { FaWhatsapp, FaPhone} from "react-icons/fa";


const UserProfile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        console.log("Fetching user with ID:", id);
        const response = await axios.get(`/api/v1/users/userProfile/${id}`);
        if (response.data.succcess) {
          setUser(response.data.user);
        } else {
          setError("User not found");
        }
      } catch (err) {
        setError("Failed to fetch user");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-purple-300 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  if (error)
    return (
      <div className="text-red-500 text-center mt-5 text-lg font-semibold">
        {error}
      </div>
    );

  return (
    <div className="flex justify-center w-full  min-h-screen bg-gradient-to-br  px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white  p-6 md:p-18 sm:p-8  w-full flex flex-col sm:flex-row gap-6 md:gap-20"
      >
        {/* Profile Picture */}
        <div className="relative group flex-shrink-0 mx-auto sm:mx-0">
          <img
            src={user.profilePicture?.url || "/placeholder.jpg"}
            alt="Profile"
            className="w-36 h-36 sm:w-44 sm:h-44 rounded-full object-cover border-4 border-purple-300 shadow-lg "
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full hidden items-center justify-center transition-all">
            <img
              src={user.profilePicture?.url || "/placeholder.jpg"}
              alt="Zoomed"
              className="w-56 h-56 object-cover rounded-full border-4 border-white shadow-lg"
            />
          </div>
        </div>

        {/* User Info */}
        <div className="flex flex-col  text-center sm:text-left space-y-3">
          <h2 className="text-3xl font-extrabold text-purple-700 tracking-wide">
            {user.userName}
          </h2>
          <p className="text-lg text-gray-700">
            📧 <span className="font-medium">{user.email}</span>
          </p>
          
          <div className="text-gray-700 flex items-center justify-center md:justify-start gap-2 text-sm mt-1">
                                <FaPhone />{" "}
                                {user.phoneNumber
                                  ? <a className="font-medium"  href={`tel:+91${user.phoneNumber}`}>{user.phoneNumber}</a>
          
                                  : "Not Available"}
                              </div>
         <div className="text-gray-700 flex items-center justify-center md:justify-start gap-2 text-sm mt-1">
                               
                               {user.phoneNumber
                                 ? <a  href={`https://wa.me/91${user.phoneNumber}`} className="flex items-center font-medium"><FaWhatsapp className="mr-1" /> WhatsApp</a>
                                 :<div className="flex  items-center"><FaWhatsapp className="mr-1" /><p> Not Available</p></div>}
                             </div>
          
          <p className="text-lg text-gray-700">
            ⚥ <span className="font-medium">{user.gender || "Not specified"}</span>
          </p>
          <p className="text-sm text-gray-500 italic">
            👤 Member since {new Date(user.createdAt).toLocaleDateString()}
          </p>
         
        </div>
      </motion.div>
    </div>
  );
};

export default UserProfile;
