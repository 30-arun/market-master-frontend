import React, { useState, useContext } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import axios from "axios";
import AuthContext from "../context/AuthContext";
import { useRouter } from "next/router";
const swal = require("sweetalert2");

function AddTemplateModal({ show, handleClose }) {
	const [formData, setFormData] = useState({
		title: "",
		image: null, // Modified to hold file object
		description: "",
	});
	const [errors, setErrors] = useState({});

	const { user } = useContext(AuthContext);
	const userId = user?.user_id || 1;
	const router = useRouter();

	const handleChange = (e) => {
		const { name, value, files } = e.target;
		// If the input type is file, set the value to the file object
		const newValue = name === "image" ? files[0] : value;
		setFormData({ ...formData, [name]: newValue });
		// Clear the error message when user starts typing in the field
		setErrors({ ...errors, [name]: "" });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const formDataToSend = new FormData();
			Object.entries(formData).forEach(([key, value]) => {
				formDataToSend.append(key, value);
			});
			formDataToSend.append("deleted", true);
			formDataToSend.append(
				"html_content",
				`<div class="vh-100"><h1 class="text-center my-5">This is Blank Website</h1></div>`
			);
			const response = await axios.post(
				`${process.env.NEXT_PUBLIC_API_URL}/store/templates/`,
				formDataToSend,
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
				}
			);
			console.log("Form submitted successfully:", response.data);
			// Optionally, you can reset the form after successful submission
			setFormData({
				title: "",
				image: null,
				description: "",
			});
			handleClose(); // Close the modal after successful submission
			swal.fire({
				title: "Success!",
				text: "Template has been created.",
				icon: "success",
				timer: 2000,
				showConfirmButton: false,
			});
			window.location.reload();
		} catch (error) {
			console.error("Error submitting form:", error);
			// Handle validation errors from the server
			if (error.response && error.response.data) {
				setErrors(error.response.data);
			}
			swal.fire({
				title: "Error!",
				text: `Failed to create template: ${error.message}`,
				icon: "error",
				timer: 2000,
				showConfirmButton: false,
			});
		}
	};

	return (
		<>
			<Modal show={show} onHide={handleClose} keyboard={false}>
				<Modal.Header closeButton>
					<Modal.Title>Add Template</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form
						onSubmit={handleSubmit}
						id="starterForm"
						encType="multipart/form-data"
					>
						<Form.Group controlId="title" className="mb-2">
							<Form.Label>Template Title</Form.Label>
							<Form.Control
								type="text"
								placeholder="Enter Template Title"
								name="title"
								value={formData.title}
								onChange={handleChange}
								required
							/>
							<Form.Control.Feedback type="invalid">
								{errors.title}
							</Form.Control.Feedback>
						</Form.Group>
						<Form.Group controlId="image" className="mb-2">
							<Form.Label>Template Logo</Form.Label>
							<Form.Control
								type="file"
								name="image"
								onChange={handleChange}
								accept="image/*"
								required
							/>
							<Form.Control.Feedback type="invalid">
								{errors.image}
							</Form.Control.Feedback>
						</Form.Group>

						<Form.Group controlId="description" className="mb-2">
							<Form.Label>Template Description</Form.Label>
							<Form.Control
								type="text"
								placeholder="Enter Template Description"
								name="description"
								value={formData.description}
								onChange={handleChange}
							/>
							<Form.Control.Feedback type="invalid">
								{errors.description}
							</Form.Control.Feedback>
						</Form.Group>
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="light" onClick={handleClose}>
						Close
					</Button>
					<Button variant="dark" type="submit" form="starterForm">
						Submit
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
}

export default AddTemplateModal;
