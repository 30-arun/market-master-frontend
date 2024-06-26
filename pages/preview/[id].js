import Head from "next/head";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import AuthContext from "../../context/AuthContext";
import ContactUs from "../../components/ContactUs";
const swal = require("sweetalert2");

export default function Preview() {
	const { user } = useContext(AuthContext);
	const router = useRouter();
	const [section, setSection] = useState({});
	const [loading, setLoading] = useState(true);
	const userId = user?.user_id || 1;
	const { id } = router.query;

	useEffect(() => {
		if (!router.isReady || !id) return;

		const fetchData = async () => {
			try {
				const response = await axios.get(
					`${process.env.NEXT_PUBLIC_API_URL}/store/templates/${id}/`
				);
				setSection(response.data);
			} catch (error) {
				console.error("There was an error!", error);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [router.isReady, id, userId]);

	if (loading) {
		return (
			<div class="d-flex justify-content-center">
				<div class="spinner-grow" role="status">
					<span class="visually-hidden">Loading...</span>
				</div>
			</div>
		);
	}

	if (!id) {
		return <div>Error: Template ID is missing.</div>;
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
			<div dangerouslySetInnerHTML={{ __html: section.html_content }} />
			{!section.deleted && <ContactUs id={false} />}

			<div dangerouslySetInnerHTML={{ __html: section.html_content2 }} />
		</div>
	);
}
