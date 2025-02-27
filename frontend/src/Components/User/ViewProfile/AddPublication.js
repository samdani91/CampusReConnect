import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const AddPublication = ({ setPost, onPostAdded }) => {
	const [formData, setFormData] = useState({
		publicationType: "",
		topic: "",
		file: null,
		title: "",
		authors: [""],
	});

	const [showSuccessMessage, setShowSuccessMessage] = useState(false);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleFileChange = (e) => {
		setFormData((prev) => ({ ...prev, file: e.target.files[0] }));
	};

	const handleDateChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			date: { ...prev.date, [name]: value },
		}));
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
			alert("Please fill in all  fields.");
			return;
		}

		const form = new FormData();
		form.append('publicationType', formData.publicationType);
		form.append('topic', formData.topic);
		form.append('file', formData.file);
		form.append('title', formData.title);
		form.append('authors', JSON.stringify(formData.authors));
		form.append('description', formData.description);
		if (formData.file) {
			form.append('file', formData.file);
		}

		try {
			const response = await axios.post('http://localhost:3001/upload', form, {
				headers: { 'Content-Type': 'multipart/form-data' },
				withCredentials: true,
			});

			// Show success message
			setShowSuccessMessage(true);
			setTimeout(() => setShowSuccessMessage(false), 3000);

			// Directly add the newly uploaded post to the posts state
			const newPost = {
				id: response.data.id,
				publicationType: response.data.publicationType,
				topic: response.data.topic,
				file: response.data.file,
				title: response.data.title,
				authors: response.data.authors,
				description: response.data.description,
			};
			onPostAdded((prevPosts) => [newPost, ...prevPosts]);
			setPost((prevPosts) => [newPost, ...prevPosts]);  // Add new post to the front
		} catch (error) {
			console.error("Error uploading publication", error);
		}
	};

	return (
		<div className="mt-4">
			<h4 className="mb-4">Your Research</h4>
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
						value={formData.file}
						onChange={handleFileChange}
					/>
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
					Upload
				</button>
			</div>
			{showSuccessMessage && (
				<div className="alert alert-success mt-3" role="alert">
					Publication uploaded successfully!
				</div>
			)}
		</div>
	);
};

export default AddPublication;
