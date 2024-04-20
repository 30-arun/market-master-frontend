import { useEffect, useState, useContext } from "react";
import axios from "axios";

export default function Footer() {
	const [section, setSection] = useState({});
	const [loading, setLoading] = useState(true);
	const domain = window.location.hostname.replace("www.", "");
	let subdomain = window.location.hostname.replace("www.", "").split(".")[0];

	if (!domain.endsWith(process.env.NEXT_PUBLIC_HOST_NAME)) {
		subdomain = domain;
	}

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await axios.get(
					`${process.env.NEXT_PUBLIC_API_URL}/store/slug/${subdomain}/`
				);
				setSection(response.data);
			} catch (error) {
				console.error("There was an error!", error);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	if (loading) {
		return (
			<div class="d-flex justify-content-center">
				<div class="spinner-grow" role="status">
					<span class="visually-hidden">Loading...</span>
				</div>
			</div>
		);
	}

	return (
		<div>
			<div dangerouslySetInnerHTML={{ __html: section.html_content3 }} />
		</div>
	);
}
