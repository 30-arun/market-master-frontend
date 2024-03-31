import ContactUs from "../../../components/ContactUs";
import { useRouter } from "next/router";
import Header from "../../../components/ecommerce/UserHeader";
import Hero from "../../../components/ecommerce/UserHero";
import Footer from "../../../components/ecommerce/UserFooter";

const Contact = () => {
	const router = useRouter();
	const { id } = router.query;

	return (
		<>
			<Header />
			<Hero />
			<ContactUs id={id} />
			<Footer />
		</>
	);
};

export default Contact;
