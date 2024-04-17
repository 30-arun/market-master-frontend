import { useState, useEffect } from "react";
import ContactUs from "../../components/ContactUs";
import Header from "../../components/ecommerce/UserHeader";
import Hero from "../../components/ecommerce/UserHero";
import Footer from "../../components/ecommerce/UserFooter";
import axios from "axios";

const Contact = () => {
	const [slug, setSlug] = useState("");

	const subdomain = window.location.host.split(".")[0];
	useEffect(() => {
		axios
			.get(
				`${process.env.NEXT_PUBLIC_API_ROUTE_NAME}/store/slug_id/${subdomain}/`
			)
			.then((response) => {
				setSlug(response.data);
			})
			.catch((error) => {
				console.log(error);
			});
	}, []);

	return (
		<>
			<Header />
			<Hero />
			<ContactUs id={slug.id} />
			<Footer />
		</>
	);
};

export default Contact;
