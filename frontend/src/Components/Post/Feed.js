import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Post from './Post';
import FollowList from './FollowList';
import Footer from './Footer';
import './Feed.css';

export default function Feed() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get('http://localhost:3001/posts', { withCredentials: true }); 
                setPosts(response.data);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };

        fetchPosts();
    }, [posts]);

    const handleDeletePost = (postId) => {
        setPosts(posts.filter(post => post.post_id !== postId));
    };

    return (
        <div className="container-md mt-4 d-flex">
            <div className="w-50 left-side">
                {posts.length > 0 ? (
                    posts.map((post) => (
                        <Post
                            key={post.post_id}
                            postId={post.post_id}
                            title={post.title}
                            topic={post.topic}
                            description={post.description}
                            authors={JSON.parse(post.authors)} // Assuming authors are stored as a JSON string
                            pdfUrl={`http://localhost:3001/uploads/${post.attachment}`} // Assuming attachment field stores the file path
                            postType={post.post_type}
                            date={post.created_date}
                            initialUpvotes={post.upvotes}
                            initialDownvotes={post.downvotes}
                            postUserId={post.user_id} 
                            onDeletePost={handleDeletePost}
                        />
                    ))
                ) : (
                    <p>No posts available</p>
                )}
            </div>

            <div className="d-flex flex-column w-50 right-side">
                <div className="flex-grow-1">
                    <FollowList />
                    <Footer />
                </div>
            </div>
        </div>
    );
}
