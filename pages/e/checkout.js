import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Avatar, Button } from "flowbite-react";
import CheckoutSteps from "../../components/ecommerce/CheckoutSteps";
import Loader from "../../components/ecommerce/Loader";
import { createOrderAction } from "../../actions/orderActions";
import AlertMessage from "../../components/ecommerce/Alert";
import { ORDER_CREATE_RESET } from "../../constants/ordersConstants";
import Link from "next/link";
import { useRouter } from "next/router";
import Header from "../../components/ecommerce/UserHeader";
import Hero from "../../components/ecommerce/UserHero";
import Footer from "../../components/ecommerce/UserFooter";

function Checkout() {
	const dispatch = useDispatch();
	const router = useRouter();

	const orderCreate = useSelector((state) => state.orderCreateReducer);
	const { loading_request, order, error, success } = orderCreate;

	const getCartData = useSelector((state) => state.cartReducerKey);
	const { loading, cartItems, shippingData } = getCartData;

	const totalItemsPrice = cartItems
		.reduce((acc, item) => acc + item.price * item.qty, 0)
		.toFixed(2);
	const shippingPrice = totalItemsPrice > 100 ? 0 : 10;
	const tax = Number(0.082 * totalItemsPrice).toFixed(2);
	const totalPrice = (
		Number(totalItemsPrice) +
		Number(shippingPrice) +
		Number(tax)
	).toFixed(2);

	useEffect(() => {
		if (success) {
			router.push(`/order/${order._id}`);
			dispatch({ type: ORDER_CREATE_RESET });
		}
	}, [success, router]);

	const placeOrder = () => {
		dispatch(
			createOrderAction({
				orderItems: cartItems,
				shippingAddress: shippingData,
				itemsPrice: totalItemsPrice,
				shippingPrice: shippingPrice,
				taxPrice: tax,
				totalPrice: totalPrice,
			})
		);
	};
	return (
		<>
			<Header />
			<Hero />

			<div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-10 lg:max-w-7xl">
				{/* <CheckoutSteps step2 step3 active3 /> */}
				<div className="sm:grid max-w-screen-xl  mx-auto lg:gap-8 xl:gap-0 lg:py-8 lg:grid-cols-12">
					<div className="md:col-span-8">
						<div className="border-b pb-5">
							<h2 className="text-2xl font-bold tracking-tight text-cyan-800 mb-3">
								SHIPPING:
							</h2>
							{loading ? (
								<Loader />
							) : (
								<div className="text-xl">
									<span className="font-bold mt-4 ">
										Address:
									</span>{" "}
									{shippingData.address},{" "}
									{shippingData.country}, {shippingData.city},{" "}
									{shippingData.postalCode}
								</div>
							)}
						</div>
						<div className="border-b pb-5">
							<h2 className="text-2xl font-bold tracking-tight text-cyan-800 mt-8 mb-3">
								PAYMENY METHOD:
							</h2>
							{loading ? (
								<Loader />
							) : (
								<div className="text-xl">
									<span className="font-bold mt-5 ">
										Method:
									</span>{" "}
									{shippingData.payment}
								</div>
							)}
						</div>
						<div>
							<h2 className="text-2xl font-bold tracking-tight text-cyan-800 mt-8 mb-3">
								ORDER ITEMS:
							</h2>
							{loading ? (
								<Loader />
							) : (
								<div className="text-xl">
									<div className="relative overflow-x-auto shadow-md sm:rounded-lg mr-10">
										<table className="w-full text-sm text-center text-gray-500 dark:text-gray-400">
											<thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
												<tr>
													<th
														scope="col"
														className="px-4 py-3"
													>
														Product Image
													</th>
													<th
														scope="col"
														className="px-4 py-3"
													>
														name
													</th>
													<th
														scope="col"
														className="px-4 py-3"
													>
														quantity
													</th>
													<th
														scope="col"
														className="px-4 py-3"
													>
														total price
													</th>
												</tr>
											</thead>
											<tbody>
												{cartItems.map((product) => (
													<tr
														key={product.slug}
														className="bg-white border-b dark:bg-gray-900 dark:border-gray-700"
													>
														<th
															scope="row"
															className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
														>
															<Link
																href={`/e/product-details/${product.slug}`}
															>
																<Avatar
																	img={`${process.env.NEXT_PUBLIC_BASE_URL}${product.image}`}
																	size="lg"
																/>
															</Link>
														</th>
														<td className="px-6 py-4 text-black text-center">
															<Link
																href={`/e/product-details/${product.slug}`}
															>
																<span className="underline">
																	{
																		product.name
																	}
																</span>
															</Link>
														</td>

														<td className="px-6 py-4 text-black text-center">
															{product.qty} X $
															{product.price}
														</td>

														<td className="px-6 py-4 text-black">
															$
															{(
																product.price *
																product.qty
															).toFixed(2)}
														</td>
													</tr>
												))}
											</tbody>
										</table>
									</div>
								</div>
							)}
						</div>
					</div>
					<div className="mt-10 lg:mt-0 md:col-span-4 border sm:ml-5">
						<div className="relative overflow-x-auto">
							<h1 className="px-6 py-4 text-center text-xl font-bold border-b text-cyan-800">
								ORDER SUMMARY
							</h1>
							<table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
								<tbody className="text-center">
									<tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 text-lg ">
										<th
											scope="row"
											className="px-6 py-4 text-gray-900"
										>
											Items
										</th>
										<th
											scope="row"
											className="px-6 py-4 text-gray-900"
										>
											${totalItemsPrice}
										</th>
									</tr>
									<tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 text-lg ">
										<th
											scope="row"
											className="px-6 py-4 text-gray-900"
										>
											Shipping
										</th>
										<th
											scope="row"
											className="px-6 py-4 text-gray-900"
										>
											${shippingPrice}
										</th>
									</tr>
									<tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 text-lg ">
										<th
											scope="row"
											className="px-6 py-4 text-gray-900"
										>
											Tax
										</th>
										<th
											scope="row"
											className="px-6 py-4 text-gray-900"
										>
											${tax}
										</th>
									</tr>
									<tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 text-lg ">
										<th
											scope="row"
											className="px-6 py-4 text-gray-900"
										>
											Total
										</th>
										<th
											scope="row"
											className="px-6 py-4 text-gray-900"
										>
											${totalPrice}
										</th>
									</tr>

									{loading_request && <Loader />}
									{error && (
										<AlertMessage
											message={error}
											color={"failure"}
										/>
									)}
								</tbody>
							</table>

							<Button className="mt-7 w-full bg-cyan-700">
								PLACE ORDER
							</Button>
						</div>
					</div>
				</div>
			</div>
			<Footer />
		</>
	);
}

export default Checkout;
