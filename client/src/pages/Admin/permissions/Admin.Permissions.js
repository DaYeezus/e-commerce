import React, {Fragment, useEffect, useState} from 'react';
import {CloseButton} from "../../../components/FormsComponents";
import {AiFillDelete, AiFillEdit, AiOutlineClose} from "react-icons/ai";
import {Header, Table, Wrapper} from "../../../components/tableComponents";
import {BiDownArrow} from "react-icons/bi";
import {Link} from "react-router-dom";
import {FaUniversalAccess} from "react-icons/fa";
import {IoCreate} from "react-icons/io5";
import LoadingComponent from "../../../components/LoadingComponent";
import {BsGearWide} from "react-icons/bs";
import Swal from "sweetalert2";
import {useSelector} from "react-redux";
import {selectCurrentToken} from "../../../app/features/auth/authSlice";
import {
    useDeletePermissionsMutation,
    useGetPermissionsQuery
} from "../../../app/features/AdminApies/PermissionsApiSlice";
import AdminPermissionsForm from "./Admin.PermissionsForm";

const AdminPermissions = () => {
    const token = useSelector(selectCurrentToken);
    const {data, isLoading} = useGetPermissionsQuery({token});
    const [permissions, setPermissions] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formMode, setFormMode] = useState("create");
    const [selectedPermission, setSelectedPermission] = useState(null)
    const [remove] = useDeletePermissionsMutation()
    useEffect(() => {
        if (!isLoading) {
            console.log(data)
            setPermissions(data.permissions)
        }
    }, [data])
    return (
        <Fragment>
            {showForm && (
                <Fragment>
                    <CloseButton onClick={() => {
                        setShowForm(false)
                        setSelectedPermission(null)
                    }}>
                        <AiOutlineClose/>
                    </CloseButton>
                    <AdminPermissionsForm mode={formMode} id={selectedPermission}/>
                </Fragment>
            )}
            <Wrapper>
                <Header>
                    <h3>Permissions</h3>
                    <div>
                        <button>
                            Export <BiDownArrow/>
                        </button>
                        <button>
                            <Link to={"/admin/roles"}>Roles <FaUniversalAccess/></Link>
                        </button>
                        <button
                            onClick={() => {
                                setShowForm(true)
                            }}
                        >
                            Create New <IoCreate/>
                        </button>


                    </div>
                </Header>
                <Table>
                    {isLoading ? (
                        <LoadingComponent/>
                    ) : permissions?.length > 0 ? (
                        <Fragment>
                            <thead>
                            <th>ID</th>
                            <th>Title</th>
                            <th>Description</th>
                            <th>
                                <BsGearWide/>
                            </th>
                            </thead>
                            {permissions?.map((permission) => (
                                <tr key={permission._id}>
                                    <td>{permission._id}</td>
                                    <td>{permission.title}</td>
                                    <td>{permission.description}</td>
                                    <td className="flex">
                                        <div className="btnContainer">
                                            <button className={"editBtn"} onClick={() => {
                                                setShowForm(true)
                                                setFormMode("edit")
                                                setSelectedPermission(permission._id)
                                            }}>
                                                Edit <AiFillEdit/>
                                            </button>
                                            <button
                                                className={"deleteBtn"}
                                                onClick={() => {
                                                    Swal.fire({
                                                        title: "Do you want to delete this Role?",
                                                        showDenyButton: true,
                                                        confirmButtonText: "Delete",
                                                    }).then(async (result) => {
                                                        if (result.isConfirmed) {
                                                            const response = await remove({
                                                                token: token,
                                                                id: permission._id,
                                                            }).unwrap();
                                                            if (response.success) {
                                                                await Swal.fire({
                                                                    icon: "success",
                                                                    title: "Deleted!",
                                                                });
                                                                setPermissions((permissions) => [
                                                                    ...permissions.filter(
                                                                        (pr) => pr._id !== permission._id
                                                                    ),
                                                                ]);
                                                            }
                                                            if (response.error) {
                                                                return Swal.fire({
                                                                    icon: "error",
                                                                    title: "Failed to delete.",
                                                                });
                                                            }
                                                        }
                                                    });
                                                }}
                                            >
                                                Delete <AiFillDelete/>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </Fragment>
                    ) : (
                        <h1>No Role</h1>
                    )}
                </Table>
            </Wrapper>
        </Fragment>
    );
};

export default AdminPermissions;