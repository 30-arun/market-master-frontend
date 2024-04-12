import Head from "next/head";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import AuthContext from "../../context/AuthContext";
import { Form, Button } from "react-bootstrap";
import ContactUs from "../../components/ContactUs";
import BookApp from "../../components/BookApp";
const swal = require("sweetalert2");
const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

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
					`${baseURL}/store/editor-template/${userId}/${id}/`
				);
				setSection(response.data);
				console.log(response.data);
			} catch (error) {
				console.error("There was an error!", error);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [router.isReady, id, userId]);

	function hexToRgb(hex) {
		// Check if the input is a valid hexadecimal color code
		if (!hex || !/^#[0-9A-F]{6}$/i.test(hex)) {
			console.error("Invalid or missing hexadecimal color code.");
			// Returning a default value (black color)
			return { r: 0, g: 0, b: 0 };
		}

		// Remove the '#' character
		hex = hex.replace(/^#/, "");

		try {
			// Parse the hexadecimal string into three separate values for R, G, and B
			var r = parseInt(hex.substring(0, 2), 16);
			var g = parseInt(hex.substring(2, 4), 16);
			var b = parseInt(hex.substring(4, 6), 16);

			// Return the RGB values as an object
			return { r: r, g: g, b: b };
		} catch (error) {
			console.error("Error while converting hexadecimal to RGB:", error);
			// Returning a default value (black color)
			return { r: 0, g: 0, b: 0 };
		}
	}
	// Test the function with your hexadecimal color code
	const rgbColorPr = hexToRgb(section.color_theme_pr);
	const rgbColorSc = hexToRgb(section.color_theme_sc);

	if (loading) {
		return <div>Loading...</div>;
	}

	if (!id) {
		return <div>Error: Template ID is missing.</div>;
	}

	return (
		<>
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
				<link
					href="https://fonts.googleapis.com/css2?family=Edu+NSW+ACT+Foundation:wght@400..700&family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&family=Montserrat:ital,wght@0,100..900;1,100..900&family=Open+Sans:ital,wght@0,300..800;1,300..800&family=Reddit+Mono:wght@200..900&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap"
					rel="stylesheet"
				/>
				{section.font_family && (
					<style>
						{`
              .bgColor {
                font-family: ${section.font_family} !important;
				background-color: ${section.color_theme_sc} !important;
              }
              
              :root {
				--bs-primary-rgb: ${rgbColorPr.r}, ${rgbColorPr.g}, ${rgbColorPr.b} !important;
				--bs-secondary-rgb: ${rgbColorSc.r}, ${rgbColorSc.g}, ${rgbColorSc.b} !important;
			}
            `}
					</style>
				)}
				<style>{section.css_cotent}</style>
			</Head>
			<div className="bgColor">
				<div
					dangerouslySetInnerHTML={{ __html: section.html_content }}
				/>
				{section.barber && <BookApp id={id}/>}
				<ContactUs id={id} />
				<div
					dangerouslySetInnerHTML={{ __html: section.html_content2 }}
				/>
			</div>
		</>
	);
}
