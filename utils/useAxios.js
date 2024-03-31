import { useState, useEffect, useContext } from "react";
import axios from "axios";
import dayjs from "dayjs";
import AuthContext from "../context/AuthContext";
const swal = require("sweetalert2");

const baseURL = "http://127.0.0.1:8000";

const useAxios = () => {
	const { authTokens, setUser, setAuthTokens } = useContext(AuthContext);
	const [activityTimeout, setActivityTimeout] = useState(null);

	const axiosInstance = axios.create({
		baseURL,
		headers: { Authorization: `Bearer ${authTokens?.access}` },
	});

	const decode = (token) => {
		try {
			return JSON.parse(window.atob(token.split(".")[1]));
		} catch (e) {
			console.warn("Error decoding token");
			return null;
		}
	};

	axiosInstance.interceptors.request.use(async (req) => {
		const user = decode(authTokens?.access);
		if (!user) return req;

		const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;
		if (!isExpired) return req;

		const response = await axios.post(`${baseURL}/account/token/refresh/`, {
			refresh: authTokens.refresh,
		});

		localStorage.setItem("authTokens", JSON.stringify(response.data));
		setAuthTokens(response.data);
		setUser(decode(response.data.access));
		req.headers.Authorization = `Bearer ${response.data.access}`;

		return req;
	});

	const logoutUser = () => {
		setAuthTokens(null);
		setUser(null);
		localStorage.removeItem("authTokens");
		window.location.href = "/login";
	};

	const handleSessionTimeout = () => {
		swal.fire({
			title: "Session Timeout",
			icon: "warning",
			toast: true,
			timer: 2000,
			position: "bottom-right",
			timerProgressBar: true,
			showConfirmButton: false,
		});
		logoutUser();
	};

	const resetTimer = () => {
		clearTimeout(activityTimeout);
		setActivityTimeout(setTimeout(handleSessionTimeout, 290000)); // 290000 ms = 4 minutes and 50 seconds
	};

	useEffect(() => {
		// Event listeners for various user actions
		const events = ["mousemove", "keydown", "scroll", "click"];
		events.forEach((event) => window.addEventListener(event, resetTimer));
		console.log("useAxios.js");
		// Set initial timer
		resetTimer();

		// Cleanup function to remove event listeners and clear timeout
		return () => {
			events.forEach((event) =>
				window.removeEventListener(event, resetTimer)
			);
			clearTimeout(activityTimeout);
		};
	}, []);

	return axiosInstance;
};

export default useAxios;
