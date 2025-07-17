import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { fetchAllUsers } from "@/store/users";
import { useDispatch } from "react-redux";
import { TableBody } from "@/components/ui/table";

const AdminUsers = () => {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { isUsersLoading, users, totalPages } = useSelector(
    (state) => state.adminUsers
  );

  // Page limit and page number
  const [limit, setLimit] = useState(15);
  const [pageNumber, setPageNumber] = useState(3);

  useEffect(() => {
    dispatch(fetchAllUsers({ pageNumber, limit }));
  }, [dispatch, user.userId, user.isAdmin, pageNumber, limit]);

  console.log(users);
  return <div>Users list</div>;
};

export default AdminUsers;
