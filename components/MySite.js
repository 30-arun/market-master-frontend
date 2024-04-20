import { useEffect, useContext, useState } from "react";
import QRCode from "qrcode.react";
import AuthContext from "../context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/router";
import axios from "axios";
import MessagesModal from "./MessagesModal";
const swal = require("sweetalert2");

export default function MySite() {
	const [templates, setTemplates] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [showModal, setShowModal] = useState(false);
	const [qrCodeData, setQrCodeData] = useState("");
	const [showMModal, setShowMModal] = useState(false);
	const [templateId, setTemplateId] = useState(null);
	const handleMClose = () => setShowMModal(false);
	const handleMShow = (id) => {
		setTemplateId(id); // Set the template id in state
		setShowMModal(true);
	};
	const [error, setError] = useState(null);
	const router = useRouter();
	const { user } = useContext(AuthContext);
	const userId = user?.user_id || 1;

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await axios.get(
					`${process.env.NEXT_PUBLIC_API_URL}/store/user-template/${userId}/`
				);
				setTemplates(response.data);
				setIsLoading(false);
			} catch (error) {
				console.error("There was an error!", error);
				setError(error);
				setIsLoading(false);
			}
		};
		fetchData();
	}, [userId]);

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
				setTemplates(
					templates.filter((template) => template.id !== id)
				);
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

	if (isLoading) {
		return (
			<div class="d-flex justify-content-center">
				<div class="spinner-grow" role="status">
					<span class="visually-hidden">Loading...</span>
				</div>
			</div>
		);
	}

	if (error) {
		return <p>Error loading templates!</p>;
	}

	if (templates.length === 0) {
		return (
			<div className="text-center mt-5">
				<h3>No Templates Found</h3>
				<p>It looks like you haven't added any templates yet.</p>
				<Link href="/templates">
					<a className="btn btn-light">Add Your First Template</a>
				</Link>
			</div>
		);
	}

	return (
		<>
			<div className="container">
				<div className="text-center my-5">
					<h1 className="text-center">Dashboard</h1>
				</div>
				<div className="row mb-5">
					{templates.map((template) => (
						<div
							className="col-lg-3 col-md-6 col-sm-6 mb-4"
							key={template.id}
						>
							<div className="card h-100 template-card">
								<Link href={`/mysite/${template.id}/website`}>
									<img
										src={
											template.image
												? `${process.env.NEXT_PUBLIC_BASE_URL}${template.image}`
												: "https://via.placeholder.com/150"
										}
										className="card-img-top cursor-pointer"
										alt={`Template ${template.title}`}
										style={{
											height: "150px",
											objectFit: "cover",
										}}
									/>
								</Link>
								<div className="card-body">
									<h5 className="card-title">
										{template.title}
									</h5>
									<p className="card-text">
										{template.description}
									</p>
									<div className="d-flex justify-content-between flex-wrap">
										{template.ecommerce ? (
											<Link
												href={`/ecommerce-editor/${template.id}`}
											>
												<a className="btn btn-dark btn-sm">
													Edit
												</a>
											</Link>
										) : (
											<Link
												href={`/editor/${template.id}`}
											>
												<a className="btn btn-dark btn-sm">
													Edit {template.ecommerce}
												</a>
											</Link>
										)}
										{template.ecommerce && (
											<span className="badge bg-info pt-2">
												Ecommerce
											</span>
										)}
										{template.ecommerce ? (
											<Link
												href={`${process.env.NEXT_PUBLIC_API_PROTOCOL}://${template.slug}.${process.env.NEXT_PUBLIC_API_SUB_DOMAIN_NAME}/`}
											>
												<a className="btn btn-light btn-sm">
													Preview
												</a>
											</Link>
										) : (
											<Link
												href={`${process.env.NEXT_PUBLIC_API_PROTOCOL}://${template.slug}.${process.env.NEXT_PUBLIC_API_SUB_DOMAIN_NAME}/`}
											>
												<a className="btn btn-light btn-sm">
													Preview
												</a>
											</Link>
										)}
									</div>
								</div>
								<div className="card-footer d-flex justify-content-between align-items-center">
									<small className="text-muted text-truncate">
										{template.time_since_updated} ago
									</small>
									<span>
										<span
											title="Messages"
											className="text-info mx-2"
											style={{ cursor: "pointer" }}
											onClick={() =>
												handleMShow(template.id)
											}
										>
											<i className="fa-solid fa-envelope"></i>
										</span>
										{template.ecommerce ? (
											<>
												<span
													title="Qrcode preview link"
													className="text-primary me-2"
													style={{
														cursor: "pointer",
													}}
													onClick={() =>
														handleQrCode(
															`${process.env.NEXT_PUBLIC_API_PROTOCOL}://${template.slug}.${process.env.NEXT_PUBLIC_FRONTEND_URL}/`
														)
													}
												>
													<i className="fa-solid fa-qrcode"></i>
												</span>
											</>
										) : (
											<>
												<span
													title="Qrcode preview link"
													className="text-primary me-2"
													style={{
														cursor: "pointer",
													}}
													onClick={() =>
														handleQrCode(
															`${process.env.NEXT_PUBLIC_API_PROTOCOL}://${template.slug}.${process.env.NEXT_PUBLIC_FRONTEND_URL}/`
														)
													}
												>
													<i className="fa-solid fa-qrcode"></i>
												</span>
											</>
										)}

										<span
											title="Delete"
											className="text-danger"
											style={{ cursor: "pointer" }}
											onClick={() =>
												handleDeleteTemp(template.id)
											}
										>
											<i className="fa-solid fa-trash"></i>
										</span>
									</span>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
			{showModal && (
				<div className="modal fade show" style={{ display: "block" }}>
					<div className="modal-dialog modal-dialog-centered">
						<div
							className="modal-content"
							style={{
								border: "1px solid #dee2e6",
								borderRadius: "10px",
								boxShadow: "0 5px 15px rgba(0,0,0,.5)",
							}}
						>
							<div
								className="modal-header d-flex justify-content-between align-items-center"
								style={{
									borderBottom: "1px solid #dee2e6",
									backgroundColor: "#f8f9fa",
								}}
							>
								<h5
									className="modal-title text-truncate"
									style={{
										fontSize: "1.25rem",
										fontWeight: "500",
										color: "#495057",
									}}
								>
									Preview Link
								</h5>
								<button
									type="button"
									className="btn-close"
									onClick={() => setShowModal(false)}
								></button>
							</div>
							<div
								className="modal-body"
								style={{ backgroundColor: "#fff" }}
							>
								<div className="text-center">
									<h6
										className="text-truncate"
										style={{
											fontSize: "1.1rem",
											color: "#495057",
										}}
									>
										Scan QR Code to get link
									</h6>
									<a href={qrCodeData} target="_blank">
										<span
											className="text-truncate"
											style={{
												fontSize: "1rem",
												color: "#495057",
											}}
										>
											{qrCodeData}
										</span>
									</a>
								</div>
								<div className="d-flex justify-content-center align-items-center">
									<div className="text-center pt-3">
										<div
											style={{
												padding: "10px",
												backgroundColor: "#f8f9fa",
												borderRadius: "5px",
												boxShadow:
													"0 4px 8px rgba(0,0,0,.1)",
											}}
											title="scan qr code to get link"
										>
											<QRCode value={qrCodeData} />
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}

			<MessagesModal
				show={showMModal}
				handleClose={handleMClose}
				templateId={templateId}
			/>
		</>
	);
}
