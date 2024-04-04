import React, { useState, useEffect } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
const swal = require("sweetalert2");
import moment from "moment";

const BookApp = () => {
	const [apiData, setApiData] = useState([]);
	const [selectedDate, setSelectedDate] = useState(new Date());
	const [availableDates, setAvailableDates] = useState(new Set());
	const [availableTimes, setAvailableTimes] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [time, setTime] = useState("");
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchData = async () => {
			setIsLoading(true);
			try {
				const response = await axios.get(
					"http://127.0.0.1:8000/store/available-time/?template_id=136"
				);
				const dataWithUTCDate = response.data.map((item) => ({
					...item,
					date: moment(item.date).utc().format("YYYY-MM-DD"),
				}));
				setApiData(dataWithUTCDate);
				const dates = new Set(dataWithUTCDate.map((item) => item.date));
				setAvailableDates(dates);
			} catch (error) {
				setError(error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
	}, []);

	const onDateChange = (date) => {
		setSelectedDate(date);
		const formattedDate = date.toISOString().split("T")[0];
		const timesForDate =
			apiData.find((d) => d.date === formattedDate)?.time || [];
		setAvailableTimes(timesForDate);
	};

	const isDateAvailable = (date) => {
		const formattedDate = date.toISOString().split("T")[0];
		return availableDates.has(formattedDate);
	};

	const handleSubmit = async (event) => {
		event.preventDefault();

		const formattedDate = selectedDate.toISOString().split("T")[0];
		const postData = async () => {
			try {
				const response = await axios.post(
					"http://127.0.0.1:8000/store/booking/",
					{
						user_template: 136,
						name,
						email,
						date: formattedDate,
						time,
					}
				);
				swal.fire({
					icon: "success",
					title: "Success",
					text: "Booking successful!",
				});
				console.log(response.data);
			} catch (error) {
				swal.fire({
					icon: "error",
					title: "Oops...",
					text: "Something went wrong!",
				});
			}
		};
		postData();
	};

	if (isLoading) return <p>Loading...</p>;
	if (error) return <p>Error loading data</p>;

	return (
		<div className="d-flex justify-content-center align-items-center my-5 mx-2">
			<form
				onSubmit={handleSubmit}
				className="card p-4 bg-light"
				style={{ width: "400px" }}
			>
				<h2 className="my-3 text-center">Book Appointment</h2>

				<div className="mb-3">
					<Calendar
						onChange={onDateChange}
						value={selectedDate}
						tileDisabled={({ date, view }) =>
							view === "month" && !isDateAvailable(date)
						}
						className="mb-3"
					/>
				</div>
				<div className="mb-3">
					<input
						type="text"
						className="form-control"
						placeholder="Name"
						value={name}
						onChange={(e) => setName(e.target.value)}
						required
					/>
				</div>
				<div className="mb-3">
					<input
						type="email"
						className="form-control"
						placeholder="Email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
				</div>
				<div className="mb-3">
					<select
						className="form-select"
						onChange={(e) => setTime(e.target.value)}
						required
					>
						<option value="">Select a time</option>
						{availableTimes.map((time, index) => (
							<option key={index} value={time}>
								{time}
							</option>
						))}
					</select>
				</div>
				<button type="submit" className="btn btn-dark w-100">
					Submit
				</button>
			</form>
		</div>
	);
};

export default BookApp;
