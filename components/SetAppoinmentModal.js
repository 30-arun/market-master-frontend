import React, { useState, useEffect } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";
import ListGroup from "react-bootstrap/ListGroup";
const swal = require("sweetalert2");
const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

const SetAppointmentModal = ({ show, handleClose, templateId }) => {
	const [adminData, setAdminData] = useState({
		selectedDate: new Date(),
		startTime: "09:00", // Default start time
		endTime: "18:00", // Default end time
		availableDates: {},
	});
	const [fetchedDates, setFetchedDates] = useState([]); // New state to store fetched dates
	const [appointments, setAppointments] = useState([]); // State to hold appointments
	const [key, setKey] = useState("setAppointment");

	useEffect(() => {
		fetchSubmittedDates(); // Fetch dates when component mounts
	}, [show, templateId]);

	const fetchSubmittedDates = async () => {
		try {
			const response = await axios.get(
				`${baseURL}/store/available-time/?template_id=${templateId}`
			); // Replace with your API endpoint
			const dates = response.data.map((item) =>
				new Date(item.date).toDateString()
			);
			setFetchedDates(dates);
			setAppointments(response.data);
		} catch (error) {
			console.error("Error fetching submitted dates:", error);
			// Handle error appropriately
		}
	};

	const today = new Date();
	today.setHours(0, 0, 0, 0);

	if (adminData.selectedDate < today) {
		setAdminData({ ...adminData, selectedDate: today });
	}

	const formatTimeForBackend = (timeStr) => {
		// Function to convert time from "04:00" format to "4 AM"
		let [hours, minutes] = timeStr.split(":");
		const modifier = hours >= 12 ? "PM" : "AM";
		hours = hours % 12 || 12;
		return `${parseInt(hours, 10)} ${modifier}`;
	};

	const handleAdminDateChange = (newDate) => {
		if (newDate >= today) {
			setAdminData({ ...adminData, selectedDate: newDate });
		}
	};

	const handleTimeChange = (e) => {
		setAdminData({ ...adminData, [e.target.name]: e.target.value });
	};

	const handleAdminSubmit = async (e) => {
		e.preventDefault();
		try {
			const formattedDate = formatDateForBackend(adminData.selectedDate);
			const startTimeFormatted = formatTimeForBackend(
				adminData.startTime
			);
			const endTimeFormatted = formatTimeForBackend(adminData.endTime);

			await axios.post(baseURL + "/store/available-time/", {
				user_template: templateId, // Use the passed templateId
				date: formattedDate,
				startTime: startTimeFormatted,
				endTime: endTimeFormatted,
			});

			swal.fire({
				title: "Success!",
				text: "Availability set successfully",
				icon: "success",
				confirmButtonText: "Ok",
			});
			await fetchSubmittedDates();
		} catch (error) {
			console.error("Error updating availability:", error);
			swal.fire({
				title: "Error!",
				text: "Error updating availability. Please try again.",
				icon: "error",
				confirmButtonText: "Ok",
			});
		}
	};

	const formatDateForBackend = (date) => {
		const d = new Date(date);
		let month = "" + (d.getMonth() + 1);
		let day = "" + d.getDate();
		const year = d.getFullYear();

		if (month.length < 2) month = "0" + month;
		if (day.length < 2) day = "0" + day;

		return [year, month, day].join("-");
	};

	const handleDelete = async (id) => {
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
					`${baseURL}/store/available-time/?template_id=${templateId}&available_time_id=${id}`
				);
				const newAppointments = appointments.filter(
					(appointment) => appointment.id !== id
				);
				setAppointments(newAppointments);
				swal.fire({
					title: "Success!",
					text: "appointment deleted successfully",
					icon: "success",
					timer: 2000,
				});
				await fetchSubmittedDates();
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

	return (
		<Modal show={show} onHide={handleClose} keyboard={false}>
			<Modal.Header closeButton>
				<Modal.Title>Set Appointments</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Tab.Container
					id="appointment-tabs"
					defaultActiveKey="setAppointment"
					activeKey={key}
					onSelect={(k) => setKey(k)}
				>
					<Nav variant="tabs" className="mb-3 justify-content-center">
						<Nav.Item>
							<Nav.Link eventKey="setAppointment">
								Set Appointment
							</Nav.Link>
						</Nav.Item>
						<Nav.Item>
							<Nav.Link eventKey="manageAppointment">
								Manage Appointments
							</Nav.Link>
						</Nav.Item>
					</Nav>
					<Tab.Content>
						<Tab.Pane eventKey="setAppointment">
							<div className="container">
								<div className="row justify-content-center">
									<div className="col-12">
										<form
											onSubmit={handleAdminSubmit}
											id="setAppoinenForm"
										>
											<div className="mb-3 d-flex justify-content-center">
												<Calendar
													id="selectedDate"
													onChange={
														handleAdminDateChange
													}
													value={
														adminData.selectedDate
													}
													minDate={today}
													tileClassName={({
														date,
														view,
													}) => {
														if (
															view === "month" &&
															fetchedDates.includes(
																date.toDateString()
															)
														) {
															return "submittedDate";
														}
													}}
													className="form-control"
												/>
											</div>
											<div className="mb-3">
												<label htmlFor="startTime">
													Start Time:
												</label>
												<input
													type="time"
													id="startTime"
													name="startTime"
													className="form-control mb-2"
													value={adminData.startTime}
													onChange={handleTimeChange}
												/>
												<label htmlFor="endTime">
													End Time:
												</label>
												<input
													type="time"
													id="endTime"
													name="endTime"
													className="form-control"
													value={adminData.endTime}
													onChange={handleTimeChange}
												/>
											</div>
										</form>
									</div>
								</div>
							</div>
						</Tab.Pane>
						<Tab.Pane eventKey="manageAppointment">
							<ListGroup
								style={{
									maxHeight: "400px",
									overflowY: "auto",
								}}
							>
								{appointments.map((appointment) => {
									const options = {
										weekday: "long",
										year: "numeric",
										month: "long",
										day: "numeric",
									};
									const formattedDate = new Date(
										appointment.date
									).toLocaleDateString("en-US", options);

									return (
										<ListGroup.Item
											key={appointment.id}
											className="d-flex justify-content-between align-items-start"
										>
											<div className="ms-2 me-auto">
												<div className="fw-bold">
													{formattedDate}{" "}
												</div>
											</div>
											<Button
												variant="danger"
												size="sm"
												onClick={() =>
													handleDelete(appointment.id)
												}
											>
												Delete
											</Button>
										</ListGroup.Item>
									);
								})}
							</ListGroup>
						</Tab.Pane>
					</Tab.Content>
				</Tab.Container>
			</Modal.Body>
			<Modal.Footer>
				<Button variant="light" onClick={handleClose}>
					Close
				</Button>
				{key === "setAppointment" && (
					<button
						type="submit"
						className="btn btn-dark"
						form="setAppoinenForm"
					>
						Set Availability
					</button>
				)}
			</Modal.Footer>
		</Modal>
	);
};

export default SetAppointmentModal;
