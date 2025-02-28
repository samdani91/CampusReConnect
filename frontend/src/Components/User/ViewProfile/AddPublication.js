import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const AddPublication = ({ setPost, onPostAdded, editingPost }) => {
    const [formData, setFormData] = useState({
        publicationType: "",
        topic: "",
        file: null,
        title: "",
        authors: [""],
        description: "",
    });
    
    const [message, setMessage] = useState({ text: "", type: null }); // type can be 'success' or 'error'

    useEffect(() => {
        if (editingPost) {
            setFormData({
                publicationType: editingPost.post_type,
                topic: editingPost.topic,
                file: editingPost.attachment ? `http://localhost:3001/uploads/${editingPost.attachment}` : null,
                title: editingPost.title,
                authors: JSON.parse(editingPost.authors),
                description: editingPost.description,
            });
        } else {
            setFormData({
                publicationType: "",
                topic: "",
                file: null,
                title: "",
                authors: [""],
                description: "",
            });
        }
    }, [editingPost]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setFormData((prev) => ({ ...prev, file: e.target.files[0] }));
    };

    const handleAddAuthor = () => {
        setFormData((prev) => ({
            ...prev,
            authors: [...prev.authors, ""],
        }));
    };

    const handleAuthorChange = (index, value) => {
        const updatedAuthors = [...formData.authors];
        updatedAuthors[index] = value;
        setFormData((prev) => ({ ...prev, authors: updatedAuthors }));
    };

    const handleRemoveAuthor = (index) => {
        const updatedAuthors = formData.authors.filter((_, i) => i !== index);
        setFormData((prev) => ({ ...prev, authors: updatedAuthors }));
    };

    const handleUpload = async (e) => {
        e.preventDefault();
    
        if (!formData.publicationType || !formData.topic || !formData.title || !formData.description || formData.authors.length === 0 ) {
            alert("Please fill in all fields.");
            return;
        }
    
        const form = new FormData();
        form.append('publicationType', formData.publicationType);
        form.append('topic', formData.topic);
        if (formData.file && typeof formData.file !== 'string') {
            form.append('file', formData.file);
        }
        form.append('title', formData.title);
        form.append('authors', JSON.stringify(formData.authors));
        form.append('description', formData.description);
    
        try {
            let response;
            if (editingPost) {
                response = await axios.put(`http://localhost:3001/update-post/${editingPost.post_id}`, form, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    withCredentials: true,
                });
            } else {
                response = await axios.post('http://localhost:3001/upload', form, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    withCredentials: true,
                });
            }
    
            setMessage({ text: `Publication ${editingPost ? "updated" : "uploaded"} successfully!`, type: 'success' });
    
            setTimeout(() => {
                setMessage({ text: "", type: null });

                const newPost = {
                    post_id: response.data.post_id,
                    publicationType: response.data.publicationType,
                    topic: response.data.topic,
                    title: response.data.title,
                    authors: response.data.authors,
                    description: response.data.description,
                    attachment: response.data.attachment,
                };
    
                onPostAdded(newPost);
                setPost((prevPosts) => {
                    if (editingPost) {
                        return prevPosts.map(post => post.post_id === editingPost.post_id ? newPost : post);
                    } else {
                        return [newPost, ...prevPosts];
                    }
                });
    
            }, 1500); 
        } catch (error) {
            setMessage({ text: `Error ${editingPost ? "updating" : "uploading"} publication!`, type: 'error' });
            setTimeout(() => {
                setMessage({ text: "", type: null });
            }, 1500)
        }
    };
    

    return (
        <div className="mt-4">
            <h4 className="mb-4">{editingPost ? "Edit Publication" : "Your Research"}</h4>
            <div className="p-4 bg-light">
                <div className="mb-3">
                    <label className="form-label">Publication Type</label>
                    <select
                        className="form-select"
                        name="publicationType"
                        value={formData.publicationType}
                        onChange={handleInputChange}
                    >
                        <option value="">Select your publication type</option>
                        <option value="Article">Article</option>
                        <option value="Conference Paper">Conference Paper</option>
                        <option value="Dataset">Dataset</option>
                        <option value="Research">Research</option>
                    </select>
                </div>
                <div className="mb-3">
                    <label className="form-label">Topic</label>
                    <input
                        type="text"
                        className="form-control"
                        name="topic"
                        value={formData.topic}
                        onChange={handleInputChange}
                        placeholder="Enter the topic of your publication"
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">File (optional)</label>
                    <input
                        type="file"
                        className="form-control"
                        name="file"
                        onChange={handleFileChange}
                    />
                    {formData.file && typeof formData.file === 'string' && <p>Current file: {formData.file.split('/').pop()}</p>}
                </div>
                <div className="mb-3">
                    <label className="form-label">Title</label>
                    <input
                        type="text"
                        className="form-control"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="Enter the title"
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                        className="form-control"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Enter a brief description of your publication"
                        rows="4"
                    ></textarea>
                </div>
                <div className="mb-3">
                    <label className="form-label">Authors</label>
                    {formData.authors.map((author, index) => (
                        <div key={index} className="d-flex align-items-center mb-2">
                            <input
                                type="text"
                                className="form-control me-2"
                                value={author}
                                onChange={(e) => handleAuthorChange(index, e.target.value)}
                                placeholder="Author name"
                            />
                            {index > 0 && (
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={() => handleRemoveAuthor(index)}
                                >
                                    Remove
                                </button>
                            )}
                        </div>
                    ))}
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={handleAddAuthor}
                    >
                        Add more authors
                    </button>
                </div>
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleUpload}
                >
                    {editingPost ? "Update" : "Upload"}
                </button>
            </div>
            {message.text && (
                <div className={`alert alert-${message.type === 'success' ? 'success' : 'danger'} mt-3`} role="alert">
                    {message.text}
                </div>
            )}
        </div>
    );
};

export default AddPublication;