import React, { useState } from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { validateForm } from "@/utils/validateForm";

const ChangePassword = () => {
  const userDetails = useSelector((state) => state.auth.user);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors , setErrors]= useState({});

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    const allErrors = validateForm(
          {
            ...form,
            [name]: value,
          },
          "passwordOnly"
        );
    setErrors(allErrors);
    console.log("Form Errors:", allErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.newPassword !== form.confirmPassword) {
      toast.error("New password and confirm password do not match.");
      return;
    }

    try {
      setIsSubmitting(true);

      await axios.patch(
        `/api/v1/users/changePassword/${userDetails.userId}`,
        {
          oldPassword: form.currentPassword,
          password: form.newPassword,
        },
        {
          withCredentials: true,
        }
      );

      toast.success("Password updated successfully!");
      setForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message || "Failed to update password."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <TabsContent value="password">
      <form onSubmit={handleSubmit}>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                name="currentPassword"
                type="password"
                value={form.currentPassword}
                onChange={handleChange}
                required
              />
              {errors.currentPassword && (
                <p className="text-red-600 mt-1">{errors.currentPassword}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                name="newPassword"
                type="password"
                value={form.newPassword}
                onChange={handleChange}
                required
              />
              {errors.newPassword && (
                <p className="text-red-600 mt-1">{errors.newPassword}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                name="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={handleChange}
                required
              />
              {errors.confirmPassword && (
                <p className="text-red-600 mt-1">{errors.confirmPassword}</p>
              )}
            </div>
            <div className="md:w-1/6 w-1/2">
              <Button
                type="submit"
                className="custom-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Updating..." : "Update Password"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </TabsContent>
  );
};

export default ChangePassword;
