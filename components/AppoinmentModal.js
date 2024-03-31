import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
const swal = require("sweetalert2");

function AppointmentModal({ show, handleClose, templateId }) {
	const [messages, setMessages] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await axios.get(
					`http://127.0.0.1:8000/store/appointment/?template_id=${templateId}`
				);
				setMessages(response.data);
			} catch (error) {
				console.error("There was an error!", error);
			}
		};
		fetchData();
	}, [templateId]);

	const handleDeleteMessage = async (id) => {
		try {
			const result = await swal.fire({
				title: "Are you sure?",
				text: "You want to delete this appointment?",
				icon: "warning",
				showCancelButton: true,
				confirmButtonColor: "#3085d6",
				cancelButtonColor: "#d33",
				confirmButtonText: "Yes, delete it!",
			});

			if (result.isConfirmed) {
				await axios.delete(
					`http://127.0.0.1:8000/store/appointment/?template_id=${templateId}&appointment_id=${id}`
				);
				const newMessages = messages.filter(
					(message) => message.id !== id
				);
				setMessages(newMessages);
				swal.fire({
					title: "Success!",
					text: "appointment deleted successfully",
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

	function convertTo12HrFormat(timeString) {
		const time = new Date(`1970-01-01T${timeString}Z`);
		return time.toLocaleTimeString("en-US", {
			hour: "numeric",
			minute: "numeric",
			hour12: true,
		});
	}

	return (
		<>
			<Modal show={show} onHide={handleClose} keyboard={false}>
				<Modal.Header closeButton>
					<Modal.Title>Appointments</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<div style={{ maxHeight: "500px", overflow: "auto" }}>
						{messages.length === 0 ? (
							<div className="alert alert-info" role="alert">
								No appoinments to display.
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
											<strong>Date: </strong>
											{/* date convert to 12, januery 2024 format */}
											{new Date(
												message.date
											).toLocaleDateString("en-GB", {
												year: "numeric",
												month: "long",
												day: "numeric",
											})}
										</p>
										<p className="card-text mb-1">
											<strong>Time: </strong>
											{message.time}
										</p>
										<p className="card-text mb-0">
											<small className="text-muted">
												<strong>Created: </strong>
												{message.time_since_updated} ago
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

export default AppointmentModal;
