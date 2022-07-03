import React from 'react';
import {Route, Routes} from "react-router-dom";
import AdminDashboard from "./Admin.Dashboard";
import AdminCategories from "./Admin.Categories";
import AdminSideBar from "../../components/Admin.SideBar";
import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;

`
const AdminRoutes = () => {
    return (
        <Wrapper>
            <AdminSideBar/>
            <Routes>
                <Route path={"/"} index element={<AdminDashboard/>}/>
                <Route path={"/categories"} element={<AdminCategories/>}/>
            </Routes>
        </Wrapper>

    );
};

export default AdminRoutes;