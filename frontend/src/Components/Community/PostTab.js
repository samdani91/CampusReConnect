import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import AddPost from "./AddPost";
import Post from '../Post/Post';
import axios from 'axios';

const PostTab = ({ userId, communityId }) => {
    const [selectedItem, setSelectedItem] = useState("Posts");
    const [showAddPublication, setShowAddPublication] = useState(false);
    const [posts, setPosts] = useState([]);
    const [editingPost, setEditingPost] = useState(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/get-community-posts/${userId}/${communityId}`, {
                    withCredentials: true,
                });
                const fetchedPosts = response.data;
                setPosts(fetchedPosts);
            } catch (error) {
                console.error("Error fetching posts:", error);
            }
        };
        fetchPosts();
    }, [userId, communityId]);

    const handlePostAdded = (newPost) => {
        if (editingPost) {
            setPosts(posts.map(post => post.post_id === editingPost.post_id ? newPost : post));
        } else {
            setPosts([newPost, ...posts]);
        }
        setShowAddPublication(false);
        setEditingPost(null);
    };

    const handleEditClick = (post) => {
        setEditingPost(post);
        setShowAddPublication(true);
        setSelectedItem(null);
    };

    const renderContent = () => {
        if (showAddPublication) {
            return (
                <AddPost
                    setPost={setPosts}
                    onPostAdded={handlePostAdded}
                    editingPost={editingPost}
                    communityId={communityId}
                />
            );
        }

        if (selectedItem === "Posts") {
            if (posts.length === 0) {
                return <p>No posts added yet.</p>;
            }

            return (
                <div>
                    {posts.map((post) => (
                        <div key={post.post_id}>
                            <Post
                                postId={post.post_id}
                                postOwnerId={post.user_id}
                                title={post.title}
                                topic={post.topic}
                                description={post.description}
                                authors={parseAuthors(post.authors)}
                                pdfUrl={`http://localhost:3001/${post.attachment}`}
                                pdfPath={post.attachment}
                                postType={post.post_type}
                                date={post.created_date}
                                initialUpvotes={post.upvotes}
                                initialDownvotes={post.downvotes}
                                postUserId={post.user_id} 
                            />
                            <button
                                className="btn btn-sm btn-primary my-3 fs-6"
                                onClick={() => handleEditClick(post)}
                            >
                                Edit
                            </button>
                        </div>
                    ))}
                </div>
            );
        }

        return null;
    };

    const parseAuthors = (authors) => {
        try {
            return authors ? JSON.parse(authors) : [];
        } catch (error) {
            console.error("Error parsing authors:", error);
            return [];
        }
    };

    return (
        <div className="d-flex">
            <div className="border-end p-3" style={{ width: "200px" }}>
                <ul className="list-unstyled mb-4">
                    <li
                        className={`p-2 mb-2 ${selectedItem === "Posts" ? "bg-primary text-white" : "text-dark"}`}
                        style={{ cursor: "pointer", borderRadius: "5px" }}
                        onClick={() => {
                            setSelectedItem("Posts");
                            setShowAddPublication(false);
                            setEditingPost(null);
                        }}
                    >
                        Posts
                    </li>
                    <li
                        className={`p-2 ${showAddPublication ? "bg-primary text-white" : "text-dark"}`}
                        style={{ cursor: "pointer", borderRadius: "5px" }}
                        onClick={() => {
                            setShowAddPublication(true);
                            setEditingPost(null);
                            setSelectedItem(null);
                        }}
                    >
                        Add Post
                    </li>
                </ul>
            </div>

            <div
                className="p-4 flex-grow-1"
                style={{
                    maxHeight: '600px',
                    overflowY: 'auto',
                }}
            >
                <div className="border rounded p-4 text-center">
                    <div>
                        {renderContent()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostTab;
