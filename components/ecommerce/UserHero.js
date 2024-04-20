import Head from "next/head";
import { useEffect, useState, useContext } from "react";
import axios from "axios";

export default function Hero() {
	const [section, setSection] = useState({});
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const domain = window.location.hostname.replace("www.", "");
		let subdomain = window.location.hostname
			.replace("www.", "")
			.split(".")[0];

		if (!domain.endsWith(process.env.NEXT_PUBLIC_HOST_NAME)) {
			subdomain = domain;
		}

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
			<Head>
				<title>Market Master</title>
				<meta
					name="description"
					content="Market Master is an e-commerce that sells high quality linen and cotton clothing, and that specializes in Caribbean guayaberas and guayamisas"
				/>
				<link rel="icon" href="/favicon.ico" />
				<meta property="og:title" content="Market Master" />
				<meta
					property="og:description"
					content="Market Master is an e-commerce that sells high quality linen and cotton clothing, and that specializes in Caribbean guayaberas and guayamisas"
				/>
				<meta
					property="og:url"
					content="https://habanerasdelino.com/"
				/>
				<meta property="og:type" content="website" />
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1"
				/>
				<meta charSet="utf-8" />
				<style>{section.css_cotent}</style>
			</Head>
			<div dangerouslySetInnerHTML={{ __html: section.html_content1 }} />
		</div>
	);
}
