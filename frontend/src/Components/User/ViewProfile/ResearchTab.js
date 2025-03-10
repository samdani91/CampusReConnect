import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import AddPublication from "./AddPublication";
import Post from '../../Post/Post';
import axios from 'axios';

const ResearchTab = ({ isOwnProfile, userId }) => {
    const [selectedItem, setSelectedItem] = useState("Article");
    const [showAddPublication, setShowAddPublication] = useState(false);
    const [articles, setArticles] = useState([]);
    const [conferencePapers, setConferencePapers] = useState([]);
    const [datasets, setDatasets] = useState([]);
    const [researches, setResearches] = useState([]);
    const [editingPost, setEditingPost] = useState(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/get-posts/${userId}`, {
                    withCredentials: true,
                });
                const posts = response.data;
                const articles = posts.filter(post => post.post_type === 'Article');
                const conferencePapers = posts.filter(post => post.post_type === 'Conference Paper');
                const datasets = posts.filter(post => post.post_type === 'Dataset');
                const researches = posts.filter(post => post.post_type === 'Research');

                setArticles(articles);
                setConferencePapers(conferencePapers);
                setDatasets(datasets);
                setResearches(researches);
            } catch (error) {
                console.error("Error fetching posts:", error);
            }
        };
        fetchPosts();
    }, [userId, articles, conferencePapers, datasets, researches]);

    const handlePostAdded = (newPost) => {
        switch (newPost.publicationType) {
            case "Article":
                setArticles([newPost, ...articles]);
                break;
            case "Conference Paper":
                setConferencePapers([newPost, ...conferencePapers]);
                break;
            case "Dataset":
                setDatasets([newPost, ...datasets]);
                break;
            case "Research":
                setResearches([newPost, ...researches]);
                break;
            default:
                break;
        }
        setShowAddPublication(false);
        setEditingPost(null);
    };

    const handleEditClick = (post) => {
        setEditingPost(post);
        setShowAddPublication(true);
    };

    const renderContent = () => {
        if (showAddPublication) {
            return (
                <AddPublication
                    setPost={() => {}}
                    onPostAdded={handlePostAdded}
                    editingPost={editingPost}
                />
            );
        }

        let postsToRender = [];
        switch (selectedItem) {
            case "Article":
                postsToRender = articles;
                break;
            case "Conference Paper":
                postsToRender = conferencePapers;
                break;
            case "Data":
                postsToRender = datasets;
                break;
            case "Research":
                postsToRender = researches;
                break;
            default:
                return <p>No content available.</p>;
        }
        if (postsToRender.length === 0) {
            return <p>No {selectedItem.toLowerCase()}s added yet. Use this section to showcase your {selectedItem.toLowerCase()}s.</p>;
        }

        return (
            <div>
                {postsToRender.map((post) => (
                    <div key={post.post_id}>
                        <Post
                            postId={post.post_id}
                            postOwnerId={post.user_id}
                            title={post.title}
							topic={post.topic}
                            description={post.description}
                            authors={JSON.parse(post.authors)}
                            pdfUrl={`http://localhost:3001/${post.attachment}`}
                            pdfPath={post.attachment}
                            postType={post.post_type}
                            date={post.created_date}
                            initialUpvotes={post.upvotes}
                            initialDownvotes={post.downvotes}
                            postUserId={post.user_id} // Pass the post's user ID
                        />
                        {isOwnProfile && (
                            <button
                                className="btn btn-sm btn-primary my-3 fs-6"
                                onClick={() => handleEditClick(post)}
                            >
                                Edit
                            </button>
                        )}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="d-flex">
            <div className="border-end p-3" style={{ width: "250px" }}>
                <h6>Research Items</h6>
                <ul className="list-unstyled mb-4">
                    {["Article", "Conference Paper", "Data", "Research"].map((item) => (
                        <li
                            key={item}
                            className={`p-2 ms-3 ${selectedItem === item ? "bg-primary text-white" : "text-dark"}`}
                            style={{ cursor: "pointer", borderRadius: "5px" }}
                            onClick={() => {
                                setSelectedItem(item);
                                setShowAddPublication(false);
                                setEditingPost(null);
                            }}
                        >
                            {item}
                        </li>
                    ))}
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
                    {!showAddPublication &&
                        isOwnProfile && (
                            <button
                                className="btn btn-primary mt-3"
                                onClick={() => {
                                    setShowAddPublication(true);
                                    setEditingPost(null);
                                }}
                            >
                                Add a publication
                            </button>
                        )}
                </div>
            </div>
        </div>
    );
};

export default ResearchTab;