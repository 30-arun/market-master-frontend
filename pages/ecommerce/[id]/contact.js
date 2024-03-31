import ContactUs from "../../../components/ContactUs";
import Header from "../../../components/ecommerce/Header";
import Hero from "../../../components/ecommerce/Hero";
import Footer from "../../../components/ecommerce/Footer";

const Contact = () => {

	return (
		<>
			<Header />
			<Hero />
			<ContactUs id={false} />
			<Footer />
		</>
	);
};

export default Contact;
