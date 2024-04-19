import React, { useEffect, useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { useRouter } from "next/router";
import axios from "axios";
import Link from "next/link";
import MessagesModal from "./MessagesModal";
import QrcodeModal from "./QrcodeModal";
import ProductModal from "./ecommerce/ProductModal";
import SeeProducts from "./SeeProducts";
import AppointmentModal from "./AppoinmentModal";
import SetAppointmentModal from "./SetAppoinmentModal";
import PublishModal from "./PublishModal";
const swal = require("sweetalert2");

const MySiteDetail = () => {
	const { user } = useContext(AuthContext);
	const router = useRouter();
	const [section, setSection] = useState({});
	const [loading, setLoading] = useState(true);
	const [showModal, setShowModal] = useState(false);
	const [showMModal, setShowMModal] = useState(false);
	const [showAModal, setShowAModal] = useState(false);
	const [showSModal, setShowSModal] = useState(false);
	const [showPModal, setPShowModal] = useState(false);
	const [showPSModal, setPSShowModal] = useState(false);
	const [showPublishModal, setShowPublishModal] = useState(false);
	const [qrCodeData, setQrCodeData] = useState("");
	const handleMClose = () => setShowMModal(false);
	const handleAClose = () => setShowAModal(false);
	const handleSClose = () => setShowSModal(false);
	const handlePSClose = () => setPSShowModal(false);
	const handlePublishClose = () => setShowPublishModal(false);
	const handleMShow = (id) => {
		setShowMModal(true);
	};
	const handlePSShow = (id) => {
		setPSShowModal(true);
	};
	const handleAShow = (id) => {
		setShowAModal(true);
	};
	const handleSShow = (id) => {
		setShowSModal(true);
	};
	const userId = user?.user_id || 1;
	const { id } = router.query;

	useEffect(() => {
		if (!router.isReady || !id) return;

		const fetchData = async () => {
			try {
				const response = await axios.get(
					`${process.env.NEXT_PUBLIC_API_URL}/store/editor-template/${userId}/${id}/`
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

	const handleDeleteTemp = async (id) => {
		try {
			const result = await swal.fire({
				title: "Are you sure?",
				text: "You won't be able to revert this!",
				icon: "warning",
				showCancelButton: true,
				confirmButtonColor: "#3085d6",
				cancelButtonColor: "#d33",
				confirmButtonText: "Yes, delete it!",
			});

			if (result.isConfirmed) {
				const response = await axios.delete(
					`${process.env.NEXT_PUBLIC_API_URL}/store/user-template-detail/${userId}/${id}/`
				);
				console.log(response.data);
				router.push("/mysite");
				swal.fire({
					title: "Deleted!",
					text: "Your file has been deleted.",
					icon: "success",
					timer: 2000,
					showConfirmButton: false,
				});
			}
		} catch (error) {
			console.error("There was an error!", error);
			swal.fire(
				"Error!",
				"There was a problem deleting your template.",
				"error"
			);
		}
	};

	const handleQrCode = (previewLink) => {
		setQrCodeData(previewLink);
		setShowModal(true);
	};

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
		<>
			{section && (
				<>
					<div class="container d-flex my-4">
						<div class="card mb-3 w-100">
							<div class="row g-0">
								<div class="col-md-4 p-3">
									<div className="bg-light p-3 rounded d-flex justify-content-center align-items-center position-relative">
										<img
											src={
												section.image
													? `${process.env.NEXT_PUBLIC_BASE_URL}${section.image}`
													: "https://via.placeholder.com/150"
											}
											class="img-fluid rounded"
											style={{
												width: "300px",
												height: "220px",
												objectFit: "cover",
											}}
											alt="..."
										/>
										<span
											class="badge bg-secondary position-absolute top-0 start-0"
											style={{ margin: "-8px 0 0 -8px" }}
										>
											YOUR SITE
										</span>
									</div>
								</div>
								<div class="col-md-8">
									<div class="card-body">
										<div className="mb-5">
											<h5 class="card-title">
												{section.title}
											</h5>
											<p class="card-text">
												{section.description}
											</p>
											<h6>
												Site URL :{" "}
												<a
													href={
														section.ecommerce
															? `${process.env.NEXT_PUBLIC_API_PROTOCOL}://${section.slug}.${process.env.NEXT_PUBLIC_API_SUB_DOMAIN_NAME}/`
															: `${process.env.NEXT_PUBLIC_API_PROTOCOL}://${section.slug}.${process.env.NEXT_PUBLIC_API_SUB_DOMAIN_NAME}/`
													}
													target="_blank"
												>
													{section.ecommerce
														? `${process.env.NEXT_PUBLIC_API_PROTOCOL}://${section.slug}.${process.env.NEXT_PUBLIC_API_SUB_DOMAIN_NAME}/`
														: `${process.env.NEXT_PUBLIC_API_PROTOCOL}://${section.slug}.${process.env.NEXT_PUBLIC_API_SUB_DOMAIN_NAME}/`}
													<i class="fa-solid fa-arrow-up-right-from-square ms-1"></i>
												</a>
											</h6>
											<p class="card-text mt-auto">
												<small class="text-muted mt-auto">
													Last updated:{" "}
													{section.time_since_updated}{" "}
													ago
												</small>
											</p>
											{section.ecommerce && (
												<span class="badge bg-info me-2">
													Ecommerce
												</span>
											)}
										</div>
										<div class="row align-items-center">
											<div class="col-3">
												<Link
													href={
														section.ecommerce
															? `/ecommerce-editor/${section.id}`
															: `/editor/${section.id}`
													}
												>
													<button class="btn btn-dark w-100">
														<i class="fa-solid fa-pencil me-2"></i>
														Edit Site
													</button>
												</Link>
											</div>
											|
											<div class="col-3">
												<Link
													href={`${process.env.NEXT_PUBLIC_API_PROTOCOL}://${section.slug}.${process.env.NEXT_PUBLIC_API_SUB_DOMAIN_NAME}/`}
												>
													<button class="btn btn-light w-100">
														<i class="fa-solid fa-eye me-2"></i>
														View Live Site
													</button>
												</Link>
											</div>
											|
											<div class="col-3">
												<button
													class="btn btn-danger w-100"
													onClick={() =>
														handleDeleteTemp(
															section.id
														)
													}
												>
													<i class="fa-solid fa-trash me-2"></i>
													Delete Site
												</button>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="container">
						<div class="row g-4">
							<div class="col-sm-4">
								<div class="card h-100">
									<div class="card-body d-flex flex-column align-items-start">
										<h5 class="card-title">
											Personal Inbox
										</h5>
										<p class="card-text">
											Dive into your personalized message
											center. Here, you'll find all your
											notifications, updates, and direct
											messages tailored just for you.
										</p>
										<a
											href="#"
											class="btn btn-light mt-auto"
											onClick={() =>
												handleMShow(section.id)
											}
										>
											<i class="fa-solid fa-message me-2"></i>
											Site Messages
										</a>
									</div>
								</div>
							</div>
							<div class="col-sm-4">
								<div class="card h-100">
									<div class="card-body d-flex flex-column align-items-start">
										<h5 class="card-title">
											Secure Access
										</h5>
										<p class="card-text">
											Effortlessly connect to our services
											using the QR code link. A secure and
											quick way to access all your
											necessary tools and resources.
										</p>
										<a
											href="#"
											class="btn btn-light mt-auto"
											onClick={() =>
												handleQrCode(
													`${process.env.NEXT_PUBLIC_API_PROTOCOL}://${section.slug}.${process.env.NEXT_PUBLIC_API_SUB_DOMAIN_NAME}/`
												)
											}
										>
											<i class="fa-solid fa-qrcode me-2"></i>
											Qrcode Link
										</a>
									</div>
								</div>
							</div>
							<div class="col-sm-4">
								<div class="card h-100">
									<div class="card-body d-flex flex-column align-items-start">
										<h5 class="card-title">Publish Site</h5>
										<p class="card-text">
											Share your site with the world.
											Click here to publish your site and
											make it available to everyone.
										</p>
										<a
											href="#"
											class="btn btn-light mt-auto"
											onClick={() =>
												setShowPublishModal(true)
											}
										>
											<i class="fa-solid fa-gear me-2"></i>
											Domain Settings
										</a>
									</div>
								</div>
							</div>
							{section.ecommerce && (
								<>
									<div class="col-sm-4">
										<div class="card h-100">
											<div class="card-body d-flex flex-column align-items-start">
												<h5 class="card-title">
													Product Catalogue
												</h5>
												<p class="card-text">
													Explore our extensive range
													of products. Click here to
													add new items to your list,
													discover new arrivals, and
													find exactly what you need.
												</p>
												<a
													href="#"
													class="btn btn-light mt-auto"
													onClick={() =>
														setPShowModal(true)
													}
												>
													<i class="fa-solid fa-circle-plus me-2"></i>
													Add Product
												</a>
											</div>
										</div>
									</div>
									<div class="col-sm-4">
										<div class="card">
											<div class="card-body d-flex flex-column align-items-start">
												<h5 class="card-title">
													Manage Products
												</h5>
												<p class="card-text">
													See all your products here.
													Manage your products, and
													keep track of your
													inventory, all in one place.
												</p>
												<a
													href="#"
													class="btn btn-light mt-auto"
													onClick={() =>
														handlePSShow(section.id)
													}
												>
													<i class="fa-solid fa-eye me-2"></i>
													See Products
												</a>
											</div>
										</div>
									</div>
								</>
							)}
							{section.barber && (
								<>
									<div class="col-sm-4">
										<div class="card h-100">
											<div class="card-body d-flex flex-column align-items-start">
												<h5 class="card-title">
													Set Appointments
												</h5>
												<p class="card-text">
													Manage your appointments
													here. view upcoming
													appointments, and manage
													your schedule, all in one
													place.
												</p>
												<a
													href="#"
													class="btn btn-light mt-auto"
													onClick={() =>
														handleSShow(section.id)
													}
												>
													<i class="fa-solid fa-wrench me-2"></i>
													Set Appointments
												</a>
											</div>
										</div>
									</div>
									<div class="col-sm-4">
										<div class="card h-100">
											<div class="card-body d-flex flex-column align-items-start">
												<h5 class="card-title">
													Appointments
												</h5>
												<p class="card-text">
													Manage your appointments
													here. view upcoming
													appointments, and manage
													your schedule, all in one
													place.
												</p>
												<a
													href="#"
													class="btn btn-light mt-auto"
													onClick={() =>
														handleAShow(section.id)
													}
												>
													<i class="fa-solid fa-calendar me-2"></i>
													See Appointments
												</a>
											</div>
										</div>
									</div>
								</>
							)}
						</div>
					</div>
				</>
			)}
			<ProductModal
				showPModal={showPModal}
				setPShowModal={setPShowModal}
				templateId={id}
			/>
			<QrcodeModal
				showModal={showModal}
				setShowModal={() => setShowModal(false)}
				qrCodeData={qrCodeData}
			/>
			<PublishModal
				show={showPublishModal}
				handleClose={handlePublishClose}
				templateId={id}
			/>
			<MessagesModal
				show={showMModal}
				handleClose={handleMClose}
				templateId={id}
			/>

			<AppointmentModal
				show={showAModal}
				handleClose={handleAClose}
				templateId={id}
			/>

			<SetAppointmentModal
				show={showSModal}
				handleClose={handleSClose}
				templateId={id}
			/>

			<SeeProducts
				show={showPSModal}
				handleClose={handlePSClose}
				templateId={id}
			/>
		</>
	);
};

export default MySiteDetail;
