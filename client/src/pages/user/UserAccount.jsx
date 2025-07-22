import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useSelector } from "react-redux";
import { logout } from "../../store/auth-slice";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import EditProfile from "@/components/common/EditProfile";

const UserAccount = () => {
  const [user, setUser] = useState(null);
 
 

  

  const dispatch = useDispatch();

  const {
    isAuthenticated,
    user: userDetails,
    isLoading,
  } = useSelector((state) => state.auth);

  useEffect(() => {
    // Replace this URL with your actual API endpoint
    axios
      .get(`/api/v1/users/userProfile/${userDetails.userId}`)
      .then((res) => setUser(res.data.user))
      .catch((err) => console.error("Failed to fetch user:", err));
  }, []);

  if (!user) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <p className="text-lg font-semibold">Loading user data...</p>
      </div>
    );
  }
  console.log("User Details:", userDetails);
  console.log("user State:", user);

  return (
    <div className="w-full min-h-screen p-4 sm:p-8 bg-gray-">
      <Tabs defaultValue="profile" className="w-full max-w-6xl mx-auto">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger
            value="profile"
            className="relative data-[state=active]:after:content-[''] data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:w-full data-[state=active]:after:h-[3px] data-[state=active]:after:rounded-2xl data-[state=active]:after:bg-gray-relative 
after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[3px] after:w-full after:rounded-2xl 
after:bg-gray-700 after:scale-x-0 after:origin-left after:transition-transform after:duration-300 
data-[state=active]:after:scale-x-100"
          >
            Profile
          </TabsTrigger>
          <TabsTrigger
            value="password"
            className="relative data-[state=active]:after:content-[''] data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:w-full data-[state=active]:after:h-[3px] data-[state=active]:after:rounded-2xl data-[state=active]:after:bg-gray-relative 
after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[3px] after:w-full after:rounded-2xl 
after:bg-gray-700 after:scale-x-0 after:origin-left after:transition-transform after:duration-300 
data-[state=active]:after:scale-x-100"
          >
            Change Password
          </TabsTrigger>
          <TabsTrigger
            value="edit"
            className="relative data-[state=active]:after:content-[''] data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:w-full data-[state=active]:after:h-[3px] data-[state=active]:after:rounded-2xl data-[state=active]:after:bg-gray-relative 
after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[3px] after:w-full after:rounded-2xl 
after:bg-gray-700 after:scale-x-0 after:origin-left after:transition-transform after:duration-300 
data-[state=active]:after:scale-x-100"
          >
            Edit Profile
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card className="w-full">
            <CardContent className="flex flex-col lg:flex-row items-center gap-8 p-8">
              <div className="relative group">
                <img
                  src={user.profilePicture?.url || "/placeholder.jpg"}
                  alt="Profile"
                  className="w-48 h-48 rounded-full object-cover border shadow-lg group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 hidden group-hover:flex items-center justify-center transition-all">
                  <img
                    src={user.profilePicture?.url || "/placeholder.jpg"}
                    alt="Zoomed"
                    className="w-64 h-64 object-cover rounded-4xl border-4 border-white"
                  />
                </div>
              </div>

              <div className="text-center lg:text-left space-y-2">
                <h2 className="text-3xl font-bold">{user.userName}</h2>
                <p className="text-lg">Email: {user.email}</p>
                <p className="text-lg">Phone: {user.phoneNumber}</p>
                <p className="text-lg">Gender: {user.gender}</p>
                <p className="text-sm text-gray-500">
                  Member since {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </CardContent>

            {/* Logout Button */}
            <div
              className="px-8 pb-8 flex justify-center lg:justify-end "
              onClick={() =>
                dispatch(logout()).then(() => toast.success("Logged-Out"))
              }
            >
              <button className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 md:py-3 onpx-6 md:px-16 hover:py-3 hover:md:py-4 hover:md:px-18 rounded-xl shadow transition-all duration-300 cursor-pointer">
                Logout
              </button>
            </div>
          </Card>
        </TabsContent>

        {/* Change Password Tab */}
        <TabsContent value="password">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input id="confirmPassword" type="password" />
              </div>
              <Button>Update Password</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Edit Profile Tab */}
        <EditProfile user={user}   />
      </Tabs>
    </div>
  );
};

export default UserAccount;
