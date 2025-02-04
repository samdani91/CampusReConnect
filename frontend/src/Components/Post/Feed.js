import React from 'react'
import Post from './Post';
import FollowList from './FollowList';
import Footer from './Footer';
import './Feed.css'

export default function Feed() {
    const postData = { // Replace with your actual data
        title: 'My Research Paper',
        description: 'This is a description of my research paper.',
        authors: ['John Doe', 'Jane Smith'],
        pdfUrl: '/path/to/document.pdf',
        postType: 'Article',
    };

    return (
        <div className="container-md mt-4 d-flex"> {/* Main container */}
            <div className="w-50 left-side">
                <Post {...postData} />
                <Post {...postData} />
                <Post {...postData} />
                <Post {...postData} />
                <Post {...postData} />
                <Post {...postData} />
                <Post {...postData} />
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
