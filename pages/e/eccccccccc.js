import React, { useEffect, useState, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProductList from "../../components/ecommerce/UserProductList";
import { userListProducts } from "../../actions/productActions";
import AlertMessage from "../../components/ecommerce/Alert";
import Loader from "../../components/ecommerce/Loader";
import Header from "../../components/ecommerce/UserHeader";
import Hero from "../../components/ecommerce/UserHero";
import Footer from "../../components/ecommerce/UserFooter";
import axios from "axios";

function Ecommerce() {
	const [ploading, setpLoading] = useState(true);
	const [slugData, setSlugData] = useState({});
	const dispatch = useDispatch();
	const productsList = useSelector((state) => state.productsListReducer);
	const subdomain = window.location.hostname
		.replace("www.", "")
		.split(".")[0];
	const { error, loading, products } = productsList;

	useEffect(() => {
		axios
			.get(
				`${process.env.NEXT_PUBLIC_API_URL}/store/slug_id/${subdomain}/`
			)
			.then((response) => {
				dispatch(userListProducts(response.data.id));
				setpLoading(false);
				setSlugData(response.data);
			})
			.catch((error) => {
				console.log(error);
			});
	}, [dispatch]);

	if (ploading) {
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
			<Header />
			<Hero />
			<div className="bg-white">
				<div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-10 lg:max-w-7xl lg:px-8">
					<h2 className="text-2xl font-bold tracking-tight text-cyan-800 mb-8">
						LATEST PRODUCTS
					</h2>
					{loading ? (
						<h2>
							<Loader />
						</h2>
					) : error ? (
						<div>
							<AlertMessage message={error} color="warning" />
						</div>
					) : (
						<div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
							{products.map((product) => (
								<ProductList
									product={product}
									key={product._id}
									pageId={slugData.id}
								/>
							))}
						</div>
					)}
				</div>
			</div>

			<Footer />
		</div>
	);
}

export default Ecommerce;
