import { useState } from "react";
import axios from "axios";
import { Form, Button } from "react-bootstrap";
const swal = require("sweetalert2");

const ContactUs = ({ id }) => {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		message: "",
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value,
		});
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		console.log(formData);
		// formData append userId
		if (id !== false) {
			formData["user_template"] = id;
			try {
				const response = axios.post(
					`${process.env.NEXT_PUBLIC_API_URL}/store/contact/`,
					formData
				);
				console.log(response);
				setFormData({
					name: "",
					email: "",
					message: "",
				});
				swal.fire({
					title: "Message sent!",
					text: "We will get back to you as soon as possible.",
					icon: "success",
					timer: 2000,
					showConfirmButton: false,
				});
			} catch (error) {
				console.error("There was an error!", error);
				swal.fire(
					"Error!",
					"There was a problem sending your message.",
					"error"
				);
			}
		} else {
			setFormData({
				name: "",
				email: "",
				message: "",
			});
			swal.fire({
				title: "Message sent!",
				text: "We will get back to you as soon as possible.",
				icon: "success",
				timer: 2000,
			});
		}
	};

	return (
		<>
			<div className="contact-form-container my-5" id="contact">
				{/* Added container for centering */}
				<h2>Contact Us</h2>
				<Form onSubmit={handleSubmit} className="mx-2">
					<Form.Group controlId="formName" className="mb-2">
						<Form.Label>Name</Form.Label>
						<Form.Control
							type="text"
							placeholder="Enter your name"
							name="name"
							value={formData.name}
							onChange={handleChange}
							required
						/>
					</Form.Group>

					<Form.Group controlId="formEmail" className="mb-2">
						<Form.Label>Email address</Form.Label>
						<Form.Control
							type="email"
							placeholder="Enter email"
							name="email"
							value={formData.email}
							onChange={handleChange}
							required
						/>
					</Form.Group>

					<Form.Group controlId="formMessage" className="mb-2">
						<Form.Label>Message</Form.Label>
						<Form.Control
							as="textarea"
							rows={3}
							placeholder="Enter your message"
							name="message"
							value={formData.message}
							onChange={handleChange}
							required
						/>
					</Form.Group>

					<Button variant="dark" type="submit">
						Send
					</Button>
				</Form>
			</div>
		</>
	);
};

export default ContactUs;
