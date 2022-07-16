import React, {Fragment, useEffect, useState} from 'react';
import {Button, Header, Table, Wrapper} from "../../../components/tableComponents";
import {BiDownArrow} from "react-icons/bi";
import {IoCreateOutline} from "react-icons/io5";
import LoadingComponent from "../../../components/LoadingComponent";
import {BsGearWide} from "react-icons/bs";
import {AiFillDelete, AiFillEdit, AiOutlineClose} from "react-icons/ai";
import Swal from "sweetalert2";
import {useSelector} from "react-redux";
import {selectCurrentToken} from "../../../app/features/auth/authSlice";
import {useDeleteBlogMutation, useGetBlogsQuery} from "../../../app/features/AdminApies/BlogsApiSlice";
import {CloseButton} from "../../../components/FormsComponents";
import AdminBlogForm from "./Admin.BlogForm";

const AdminBlog = () => {
    const token = useSelector(selectCurrentToken);
    const {data, isLoading} = useGetBlogsQuery({token});
    const [blogs, setBlogs] = useState([]);
    const [remove] = useDeleteBlogMutation();
    const [showForm, setShowForm] = useState(false);
    const [formMode, setFormMode] = useState("create");
    const [selectedBlog, setSelectedBlog] = useState(null);
    useEffect(() => {
        if (!isLoading) {
            console.log(data)
            setBlogs(data.blogs);
        }
    }, [data]);
    return (
        <Fragment>
            <Wrapper>
                <Header>
                    <h3>Blogs</h3>
                    <div>
                        <Button>
                            Export <BiDownArrow/>
                        </Button>
                        <Button onClick={() => {
                            setShowForm(true);
                            setFormMode("create");
                        }}>
                            Create <IoCreateOutline/>
                        </Button>
                    </div>
                </Header>
                <Table>
                    {isLoading ? (
                        <LoadingComponent/>
                    ) : blogs ? (
                        <Fragment>
                            <thead>
                            <th>Title</th>
                            <th>overView</th>
                            <th>Tags</th>
                            <th>Category</th>
                            <th>Image</th>
                            <th>
                                <BsGearWide/>
                            </th>
                            </thead>
                            {blogs?.map((blog) => (
                                <tr key={blog._id}>
                                    <td>{blog.title}</td>
                                    <td>{blog.overView.substring(0, 30)}</td>
                                    <td>
                                        {blog.tags.map((tag) => (
                                            <span key={tag}>
                        #{tag}
                                                <br/>
                      </span>
                                        ))}
                                    </td>
                                    <td>{blog?.categoryName?.title}</td>
                                    <td>
                                        <img
                                            src={blog?.imageURL}
                                            alt={blog.title}
                                        />
                                    </td>
                                    <td className="flex">
                                        <div className="btnContainer">
                                            <button className={"editBtn"}
                                                    onClick={() => {
                                                        setSelectedBlog(blog._id);
                                                        setShowForm(true);
                                                        setFormMode("edit");
                                                    }}
                                            >
                                                Edit <AiFillEdit/>
                                            </button>
                                            <button
                                                className={"deleteBtn"}
                                                onClick={() => {
                                                    Swal.fire({
                                                        title: "Do you want to delete this product?",
                                                        showDenyButton: true,
                                                        confirmButtonText: "Delete",
                                                    }).then(async (result) => {
                                                        if (result.isConfirmed) {
                                                            const response = await remove({
                                                                token: token,
                                                                id: blog._id,
                                                            }).unwrap();
                                                            if (response.success) {
                                                                Swal.fire({
                                                                    icon: "success",
                                                                    title: "Deleted!",
                                                                });
                                                                setBlogs((blogs) => [
                                                                    ...blogs.filter(
                                                                        (pr) => pr._id !== blog._id
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
                        <h1>No Blog</h1>
                    )}
                </Table>
            </Wrapper>
            {showForm && (
                <Fragment>
                    <CloseButton onClick={() => setShowForm(false)}>
                        <AiOutlineClose/>
                    </CloseButton>
                    <AdminBlogForm mode={formMode} id={selectedBlog}/>
                </Fragment>
            )}
        </Fragment>
    );
};

export default AdminBlog;