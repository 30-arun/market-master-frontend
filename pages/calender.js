import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";

const BookingSystem = () => {
	const [date, setDate] = useState(new Date());
	const [time, setTime] = useState("");
	const [availableTimes, setAvailableTimes] = useState([]);
	const [userData, setUserData] = useState({ name: "", email: "" });

	const [adminData, setAdminData] = useState({
		selectedDate: new Date(),
		times: "",
		availableDates: {},
	});

	const isAdminDateAvailable = (selectedDate) => {
		const formattedDate = selectedDate.toISOString().split("T")[0];
		return adminData.availableDates.hasOwnProperty(formattedDate);
	};

	useEffect(() => {
		if (isAdminDateAvailable(date)) {
			const formattedDate = date.toISOString().split("T")[0];
			setAvailableTimes(adminData.availableDates[formattedDate]);
		} else {
			setAvailableTimes([]);
		}
	}, [date, adminData]);

	const handleDateChange = (newDate) => {
		setDate(newDate);
	};

	const handleTimeChange = (e) => {
		setTime(e.target.value);
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setUserData({ ...userData, [name]: value });
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		const bookingDateTime = `${date.toDateString()} at ${time}`;
		alert(`Booking confirmed for ${userData.name} on ${bookingDateTime}`);
		// Normally, send booking data to the backend here
	};

	// Admin Handlers
	const handleAdminDateChange = (newDate) => {
		setAdminData({ ...adminData, selectedDate: newDate });
	};

	const handleAdminTimeChange = (e) => {
		setAdminData({ ...adminData, times: e.target.value });
	};

	const handleAdminSubmit = async (e) => {
		e.preventDefault();
		try {
			const formattedDate = adminData.selectedDate
				.toISOString()
				.split("T")[0];
			const timesArray = adminData.times
				.split(",")
				.map((time) => time.trim());

			await axios.post("http://127.0.0.1:8000/store/available-time/", {
				user_template: 134,
				date: formattedDate,
				time: timesArray,
			});

			alert("Availability updated successfully");
			// Update the state to reflect new availability
		} catch (error) {
			console.error("Error updating availability:", error);
			alert("Error updating availability. Please try again.");
		}
	};

	useEffect(() => {
		axios
			.get("http://127.0.0.1:8000/store/available-time/?template_id=134")
			.then((response) => {
				const availableDates = response.data.reduce((acc, curr) => {
					acc[curr.date] = curr.time;
					return acc;
				}, {});
				setAdminData({ ...adminData, availableDates });
			})
			.catch((error) =>
				console.error("Error fetching availability data:", error)
			);
	}, []);

	return (
		<div style={{ margin: "20px" }}>
			<div className="container my-4">
				<div className="row justify-content-center">
					<div className="col-md-4">
						<h1 className="text-center mb-4">Admin Settings</h1>
						<form onSubmit={handleAdminSubmit}>
							<div className="mb-3 d-flex justify-content-center">
								<Calendar
									onChange={handleAdminDateChange}
									value={adminData.selectedDate}
									className="form-control"
								/>
							</div>
							<div className="mb-3">
								<input
									type="text"
									id="timesInput"
									className="form-control"
									placeholder="Enter times separated by commas (e.g., 09:00, 10:00)"
									value={adminData.times}
									onChange={handleAdminTimeChange}
								/>
							</div>
							<div className="text-center">
								<button type="submit" className="btn btn-light">
									Set Availability
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>

			<div>
				<h1>Booking System</h1>
				<Calendar
					onChange={handleDateChange}
					value={date}
					tileDisabled={({ date, view }) =>
						view === "month" && !isAdminDateAvailable(date)
					}
				/>

				<form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
					<label>
						Name:
						<input
							type="text"
							name="name"
							value={userData.name}
							onChange={handleInputChange}
							required
						/>
					</label>
					<br />
					<label>
						Email:
						<input
							type="email"
							name="email"
							value={userData.email}
							onChange={handleInputChange}
							required
						/>
					</label>
					<br />
					<label>
						Time:
						<select
							name="time"
							value={time}
							onChange={handleTimeChange}
							required
							disabled={availableTimes.length === 0}
						>
							<option value="">Select a time</option>
							{availableTimes.map((t) => (
								<option key={t} value={t}>
									{t}
								</option>
							))}
						</select>
					</label>
					<br />
					<button type="submit">Book Appointment</button>
				</form>
			</div>
		</div>
	);
};

export default BookingSystem;
