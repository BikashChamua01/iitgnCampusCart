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
import { validateForm } from "@/utils/validateForm";

const EditProfile = ({ user }) => {
  const [form, setForm] = useState({
    userName: "",
    phoneNumber: "",
    gender: "",
  });
  const [errors, setErrors] = useState({});

  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    const allErrors = validateForm(
      {
        ...form,
        [name]: value,
      },
      "updateProfile"
    );
    setErrors(allErrors);
    console.log("Form Errors:", allErrors);
  };

  const dispatch = useDispatch();

  const {
    isAuthenticated,
    user: userDetails,
    isLoading,
  } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      setForm({
        userName: user.userName || "",
        phoneNumber: user.phoneNumber || "",
        gender: user.gender || "",
        email: user.email || "",
      });
    }
  }, [user]);
  if (!user) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <p className="text-lg font-semibold">Loading user data...</p>
      </div>
    );
  }
  //   console.log("User Details:", userDetails);
  //   console.log("user State:", user);

  // handle edit profile submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);

      // Construct only the changed fields
      const updatedFields = {};
      if (form.userName !== user.userName) {
        updatedFields.userName = form.userName;
      }
      if (form.phoneNumber !== user.phoneNumber) {
        updatedFields.phoneNumber = form.phoneNumber;
      }
      if (form.gender !== user.gender) {
        updatedFields.gender = form.gender;
      }

      // Append the details in the form data
      const formData = new FormData();
      for (const key in updatedFields) {
        formData.append(key, updatedFields[key]);
      }

      // Send PATCH request with updated fields only
      console.log("Form Data to Edit Profile:", form);

      await axios.patch(
        `/api/v1/users/editProfile/${userDetails.userId}`,
        {
          ...form,
        },
        {
          withCredentials: true,
        }
      );

      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile.");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <TabsContent value="edit">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="userName">Username</Label>

              <input
                name="userName"
                value={form.userName}
                onChange={handleChange}
                className="w-full mt-1 px-4 py-2 border border-[#7635b6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6a0dad]"
                placeholder={user.userName}
              />
              {errors.userName && (
                <p className="text-red-600 mt-1">{errors.userName}</p>
              )}
            </div>

            <div
              className="space-y-2"
              onClick={() => toast.warning("Email cannot be changed")}
            >
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={user.email}
                disabled
                placeholder={user.email}
                className="cursor-not-allowed opacity-70 w-full mt-1 px-4 py-2 border border-[#7635b6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6a0dad]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={handleChange}
                placeholder={user.phoneNumber}
                className="w-full mt-1 px-4 py-2 border border-[#7635b6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6a0dad]"
              />
              {errors.phoneNumber && (
                <p className="text-red-600 mt-1">{errors.phoneNumber}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="w-full mt-1 px-4 py-2 border border-[#7635b6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6a0dad] bg-white"
              >
                <option value="" disabled>
                  Select gender
                </option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div className="md:w-1/6 w-1/2">
              <Button
                type="submit"
                className="custom-button "
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default EditProfile;
