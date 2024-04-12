import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
// import Form from "react-bootstrap/Form";
// import axios from "axios";
// import AuthContext from "../context/AuthContext";
// import { useRouter } from "next/router";
const swal = require("sweetalert2");
const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";


function MessagesModal({ show, handleClose, templateId }) {
	const [messages, setMessages] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await axios.get(
					`${baseURL}/store/contact/?template_id=${templateId}`
				);
				setMessages(response.data);
			} catch (error) {
				console.error("There was an error!", error);
			}
		};
		fetchData();
	}, [templateId, show]);

	const handleDeleteMessage = async (id) => {
		try {
			const result = await swal.fire({
				title: "Are you sure?",
				text: "You want to delete this message?",
				icon: "warning",
				showCancelButton: true,
				confirmButtonColor: "#3085d6",
				cancelButtonColor: "#d33",
				confirmButtonText: "Yes, delete it!",
			});

			if (result.isConfirmed) {
				await axios.delete(
					`${baseURL}/store/contact/?template_id=${templateId}&contact_id=${id}`
				);
				const newMessages = messages.filter(
					(message) => message.id !== id
				);
				setMessages(newMessages);
				swal.fire({
					title: "Success!",
					text: "Message deleted successfully",
					icon: "success",
					timer: 2000,
				});
			}
		} catch (error) {
			console.error("There was an error!", error);
			swal.fire({
				title: "Error!",
				text: "There was a problem deleting the message.",
				icon: "error",
			});
		}
	};

	const getTimeSince = (createdAt) => {
		const currentDate = new Date();
		const createdDate = new Date(createdAt);
		const timeDifference = currentDate - createdDate;
		const seconds = Math.floor(timeDifference / 1000);
		const minutes = Math.floor(seconds / 60);
		const hours = Math.floor(minutes / 60);
		const days = Math.floor(hours / 24);
		const weeks = Math.floor(days / 7);
		const months = Math.floor(days / 30);
		const years = Math.floor(days / 365);

		if (years > 0) {
			return years === 1 ? "1 year ago" : `${years} years ago`;
		} else if (months > 0) {
			return months === 1 ? "1 month ago" : `${months} months ago`;
		} else if (weeks > 0) {
			return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;
		} else if (days > 0) {
			return days === 1 ? "1 day ago" : `${days} days ago`;
		} else if (hours > 0) {
			return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
		} else if (minutes > 0) {
			return minutes === 1 ? "1 minute ago" : `${minutes} minutes ago`;
		} else {
			return "Just now";
		}
	};

	return (
		<>
			<Modal show={show} onHide={handleClose} keyboard={false}>
				<Modal.Header closeButton>
					<Modal.Title>Messages</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<div style={{ maxHeight: "500px", overflow: "auto" }}>
						{messages.length === 0 ? (
							<div className="alert alert-info" role="alert">
								No messages to display.
							</div>
						) : (
							messages.map((message) => (
								<div
									key={message.id}
									className="card mb-3"
									style={{ maxWidth: "540px" }}
								>
									<div className="card-header bg-light d-flex justify-content-between align-items-center">
										<div>
											<strong>From: </strong>
											{message.name}
										</div>
										<button
											className="btn btn-danger btn-sm"
											onClick={() =>
												handleDeleteMessage(message.id)
											}
										>
											Delete
										</button>
									</div>
									<div className="card-body">
										<p className="card-text mb-1">
											<strong>Email: </strong>
											{message.email}
										</p>
										<p className="card-text mb-1">
											<strong>Message: </strong>
											{message.message}
										</p>
										<p className="card-text mb-0">
											<small className="text-muted">
												<strong>Created Date: </strong>
												{getTimeSince(
													message.created_at
												)}
											</small>
										</p>
									</div>
								</div>
							))
						)}
					</div>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="light" onClick={handleClose}>
						Close
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
}

export default MessagesModal;
