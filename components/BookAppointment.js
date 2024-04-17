import { useState } from "react";
import axios from "axios";
import { Form, Button } from "react-bootstrap";
const swal = require("sweetalert2");

const BookAppointment = ({id}) => {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		date: "",
		time: "",
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
		formData["user_template"] = id;
		try {
			const response = axios.post(
				`${process.env.NEXT_PUBLIC_API_ROUTE_NAME}/store/appointment/`,
				formData
			);
			console.log(response);
			setFormData({
				name: "",
				email: "",
				date: "",
				time: "",
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
	};

	return (
		<>
			<div className="contact-form-container my-5" id="appoinment">
				{/* Added container for centering */}
				<h2>Book Your Appointment</h2>
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

					<Form.Group controlId="formDate" className="mb-2">
						<Form.Label>Date</Form.Label>
						<Form.Control
							type="date"
							name="date"
							value={formData.date}
							onChange={handleChange}
							required
						/>
					</Form.Group>

					<Form.Group controlId="formTime" className="mb-2">
						<Form.Label>Time</Form.Label>
						<Form.Control
							type="time"
							name="time"
							value={formData.time}
							onChange={handleChange}
							required
						/>
					</Form.Group>

					<Button variant="dark" type="submit">
						Book Appointment
					</Button>
				</Form>
			</div>
		</>
	);
};

export default BookAppointment;
