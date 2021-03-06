import React from 'react';
import {Route, Routes} from "react-router-dom";
import AdminDashboard from "./Admin.Dashboard";
import AdminCategories from "./categories/Admin.Categories";
import AdminSideBar from "../../components/Admin.SideBar";
import styled from "styled-components";
import AdminProducts from "./Products/Admin.products";
import AdminUsers from "./users/Admin.Users";
import AdminRoles from "./roles/Admin.Roles";
import AdminPermissions from "./permissions/Admin.Permissions";
import AdminBlog from "./Blogs/Admin.Blog";

const Wrapper = styled.div`
  display: flex;
  overflow: hidden;
`
const AdminRoutes = () => {
    return (
        <Wrapper>
            <AdminSideBar/>
            <Routes>
                <Route path={"/"} index element={<AdminDashboard/>}/>
                <Route path={"/categories"} element={<AdminCategories/>}/>
                <Route path={"/products"} element={<AdminProducts/>}/>
                <Route path={"/blogs"} element={<AdminBlog/>}/>
                <Route path={"/users"} element={<AdminUsers/>}/>
                <Route path={"/roles"} element={<AdminRoles/>}/>
                <Route path={"/permissions"} element={<AdminPermissions/>}/>
            </Routes>
        </Wrapper>

    );
};

export default AdminRoutes;