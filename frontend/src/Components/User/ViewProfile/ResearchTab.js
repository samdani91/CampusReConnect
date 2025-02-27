import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import AddPublication from "./AddPublication";
import Post from '../../Post/Post'; // Import Post component
import axios from 'axios';

const ResearchTab = ({ isOwnProfile, userId }) => {
	const [selectedItem, setSelectedItem] = useState("Article");
	const [showAddPublication, setShowAddPublication] = useState(false);
	const [articles, setArticles] = useState([]);
	const [conferencePapers, setConferencePapers] = useState([]);
	const [datasets, setDatasets] = useState([]);
	const [researches, setResearches] = useState([]);

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
	};

	const renderContent = () => {
		if (showAddPublication) {
			return <AddPublication setPost={() => { }} onPostAdded={handlePostAdded} />;
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
			case "Questions":
				return <p>No questions added yet. Use this section to manage your questions.</p>;
			case "Answers":
				return <p>No answers added yet. Use this section to manage your answers.</p>;
			default:
				return <p>No content available.</p>;
		}
		if (postsToRender.length === 0) {
			return <p>No {selectedItem.toLowerCase()}s added yet. Use this section to showcase your {selectedItem.toLowerCase()}s.</p>;
		}

		return (
			<div>
				{postsToRender.map((post) => (
					<Post
						key={post.id}
						title={post.title}
						description={post.description}
						authors={JSON.parse(post.authors)} // Assuming authors are stored as a JSON string
						pdfUrl={`http://localhost:3001/uploads/${post.attachment}`} // Assuming attachment field stores the file path
						postType={post.post_type}
						date={post.created_date}
					/>
				))}
			</div>
		);
	};

	return (
		<div className="d-flex">
			{/* ... (rest of your ResearchTab code) ... */}
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
							}}
						>
							{item}
						</li>
					))}
				</ul>
				<h6>Questions</h6>
				<ul className="list-unstyled mb-4">
					<li
						className={`p-2 ms-3 ${selectedItem === "Questions" ? "bg-primary text-white" : "text-dark"}`}
						style={{ cursor: "pointer", borderRadius: "5px" }}
						onClick={() => {
							setSelectedItem("Questions");
							setShowAddPublication(false);
						}}
					>
						Questions
					</li>
				</ul>
				<h6>Answers</h6>
				<ul className="list-unstyled">
					<li
						className={`p-2 ms-3 ${selectedItem === "Answers" ? "bg-primary text-white" : "text-dark"}`}
						style={{ cursor: "pointer", borderRadius: "5px" }}
						onClick={() => {
							setSelectedItem("Answers");
							setShowAddPublication(false);
						}}
					>
						Answers
					</li>
				</ul>
			</div>

			<div
				className="p-4 flex-grow-1"
				style={{
					maxHeight: '620px', // Adjust the height as needed
					overflowY: 'auto',
				}}
			>
				<div className="border rounded p-4 text-center">
					<div>
						{renderContent()}
					</div>
					{!showAddPublication &&
						selectedItem !== 'Questions' &&
						selectedItem !== 'Answers' &&
						isOwnProfile && (
							<button
								className="btn btn-primary mt-3"
								onClick={() => setShowAddPublication(true)}
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