import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Post from './Post';
import FollowList from './FollowList';
import Footer from './Footer';
import './Feed.css';

export default function Feed() {
    const [posts, setPosts] = useState([]); // State to store the fetched posts

    useEffect(() => {
        // Fetch posts when the component mounts
        const fetchPosts = async () => {
            try {
                const response = await axios.get('http://localhost:3001/posts',{withCredentials:true}); // Replace with your backend API URL
                setPosts(response.data); // Update the state with the fetched posts
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };

        fetchPosts();
    }, []); // Empty dependency array means this effect runs once when the component mounts

    return (
        <div className="container-md mt-4 d-flex">
            <div className="w-50 left-side">
                {/* Map through the posts and render a Post component for each */}
                {posts.length > 0 ? (
                    posts.map((post) => (
                        <Post
                            key={post.id}
                            title={post.title}
                            description={post.description}
                            authors={JSON.parse(post.authors)} // Assuming authors are stored as a JSON string
                            pdfUrl={`http://localhost:3001/uploads/${post.attachment}`} // Assuming attachment field stores the file path
                            postType={post.post_type}
                            date={post.created_date}
                        />
                    ))
                ) : (
                    <p>No posts available</p> // Show this message if there are no posts
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
