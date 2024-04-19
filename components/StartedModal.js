import React, { useState, useContext } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import axios from "axios";
import AuthContext from "../context/AuthContext";
import { useRouter } from "next/router";
const swal = require("sweetalert2");

function StartedModal({ show, handleClose }) {
	const [formData, setFormData] = useState({
		business_name: "",
		template_type: "Template1",
		font_type: "Roboto",
		color_theme_pr: "#1abc9c",
		color_theme_sc: "#2c3e50",
		business_logo: null, // Modified to hold file object
		additional_field: "",
	});
	const [errors, setErrors] = useState({});
	const { user } = useContext(AuthContext);
	const userId = user?.user_id || 1;
	const router = useRouter();

	const handleChange = (e) => {
		const { name, value, files } = e.target;
		// If the input type is file, set the value to the file object
		const newValue = name === "business_logo" ? files[0] : value;
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
			formDataToSend.append("user", userId);
			const response = await axios.post(
				`${process.env.NEXT_PUBLIC_API_URL}/store/get-started/`,
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
				business_name: "",
				template_type: "Template1",
				font_type: "Roboto",
				color_theme_pr: "#1abc9c",
				color_theme_sc: "#2c3e50",
				business_logo: null,
				additional_field: "",
			});
			handleClose(); // Close the modal after successful submission
			swal.fire({
				title: "Success!",
				text: "Your site has been created.",
				icon: "success",
				timer: 2000,
				showConfirmButton: false,
			});
			router.push("/mysite"); // Redirect to mysite page
		} catch (error) {
			console.error("Error submitting form:", error);
			// Handle validation errors from the server
			if (error.response && error.response.data) {
				setErrors(error.response.data);
			}
		}
	};

	return (
		<>
			<Modal
				show={show}
				onHide={handleClose}
				backdrop="static"
				keyboard={false}
			>
				<Modal.Header closeButton>
					<Modal.Title>Get Started</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form
						onSubmit={handleSubmit}
						id="starterForm"
						encType="multipart/form-data"
					>
						<Form.Group controlId="business_name" className="mb-2">
							<Form.Label>Business Name</Form.Label>
							<Form.Control
								type="text"
								placeholder="Enter business name"
								name="business_name"
								value={formData.business_name}
								onChange={handleChange}
								required
							/>
							<Form.Control.Feedback type="invalid">
								{errors.business_name}
							</Form.Control.Feedback>
						</Form.Group>

						<Form.Group controlId="template_type" className="mb-2">
							<Form.Label>Template Type</Form.Label>
							<Form.Control
								as="select"
								name="template_type"
								value={formData.template_type}
								onChange={handleChange}
								required
							>
								<option value="Template1">Business</option>
								<option value="Template2">Portfolio</option>
								<option value="Template3">CleanIt</option>
								<option value="Template4">Barber Shop</option>
								<option value="Template5">
									Tech Inovations
								</option>
								{/* Add more options as needed */}
							</Form.Control>
							<Form.Control.Feedback type="invalid">
								{errors.template_type}
							</Form.Control.Feedback>
						</Form.Group>

						<Form.Group controlId="font_type" className="mb-2">
							<Form.Label>Font Type</Form.Label>
							<Form.Control
								as="select"
								name="font_type"
								value={formData.font_type}
								onChange={handleChange}
								required
							>
								<option value="Roboto">Roboto</option>
								<option value="Open Sans">Open Sans</option>
								<option value="Lato">Lato</option>
								<option value="Montserrat">Montserrat</option>
								<option value="Reddit Mono">Reddit Mono</option>
								<option value="Edu NSW">Edu NSW</option>
							</Form.Control>
							<Form.Control.Feedback type="invalid">
								{errors.font_type}
							</Form.Control.Feedback>
						</Form.Group>

						<Form.Group controlId="color_theme_pr" className="mb-2">
							<Form.Label>Color Theme Primary</Form.Label>
							<Form.Control
								type="color"
								name="color_theme_pr"
								value={formData.color_theme_pr}
								onChange={handleChange}
								required
							/>

							<Form.Control.Feedback type="invalid">
								{errors.color_theme_pr}
							</Form.Control.Feedback>
						</Form.Group>
						<Form.Group controlId="color_theme_sc" className="mb-2">
							<Form.Label>Color Theme Secondary</Form.Label>
							<Form.Control
								type="color"
								name="color_theme_sc"
								value={formData.color_theme_sc}
								onChange={handleChange}
								required
							/>
							<Form.Control.Feedback type="invalid">
								{errors.color_theme_sc}
							</Form.Control.Feedback>
						</Form.Group>

						<Form.Group controlId="business_logo" className="mb-2">
							<Form.Label>Business Logo</Form.Label>
							<Form.Control
								type="file"
								name="business_logo"
								onChange={handleChange}
								accept="image/*"
								required
							/>
							<Form.Control.Feedback type="invalid">
								{errors.business_logo}
							</Form.Control.Feedback>
						</Form.Group>

						<Form.Group
							controlId="additional_field"
							className="mb-2"
						>
							<Form.Label>Description</Form.Label>
							<Form.Control
								type="text"
								placeholder="Enter additional field"
								name="additional_field"
								value={formData.additional_field}
								onChange={handleChange}
							/>
							<Form.Control.Feedback type="invalid">
								{errors.additional_field}
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

export default StartedModal;
