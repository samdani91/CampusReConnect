import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Post from '../Post/Post';



export default function DiscussionTab({communityId}) {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/community-posts/${communityId}`, { withCredentials: true }); 
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
            <div className="w-100 " style={{ maxHeight: '600px', overflowY: 'auto' }}> {/* Added maxHeight and overflowY */}
                {posts.length > 0 ? (
                    posts.map((post) => (
                        <Post
                            key={post.post_id}
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
                            postUserId={post.user_id}
                            onDeletePost={handleDeletePost}
                        />
                    ))
                ) : (
                    <p className='text-center'>No posts available</p>
                )}
            </div>
        </div>
    );
}
