import { useEffect, useContext, useState } from "react";
import AuthContext from "../context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/router";
import axios from "axios";
import useAxios from "../utils/useAxios";
import AddTemplateModal from "./AddTemplateModal";

const swal = require("sweetalert2");

export default function Templates({ loggedIn }) {
	const [templates, setTemplates] = useState([]);
	const [loading, setLoading] = useState(true);
	const [isAdmin, setIsAdmin] = useState(false);
	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	const history = useRouter();
	const { user } = useContext(AuthContext);
	const api = useAxios();

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			try {
				const response = await axios.get(
					`${process.env.NEXT_PUBLIC_API_URL}/store/templates/`
				);

				setTemplates(response.data);
			} catch (error) {
				console.error("There was an error!", error);
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, []);

	useEffect(() => {
		if (!user) return;
		const userData = async () => {
			setLoading(true);
			try {
				const response = await api.get("/account/profile/");
				setIsAdmin(response.data.is_admin);
				console.log(response.data.is_admin, 89798);
			} catch (error) {
				console.log(error);
				setIsAdmin("Something went wrong");
			} finally {
				setLoading(false);
			}
		};
		userData();
	}, [user]);

	const handleAddTemp = async (id) => {
		try {
			const response = await axios.post(
				`${process.env.NEXT_PUBLIC_API_URL}/store/post-user-template/`,
				{
					user: user?.user_id || 1,
					template: id,
				}
			);
			console.log(response.data);
			swal.fire({
				title: "Success!",
				text: "Template added to your site.",
				icon: "success",
				timer: 2000,
				showConfirmButton: false,
			});
			history.push("/mysite");
		} catch (error) {
			console.error("There was an error!", error);
			swal.fire({
				title: "Error!",
				text: "Template already added to your site.",
				icon: "error",
				timer: 2000,
				showConfirmButton: false,
			});
		}
	};

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
					`${process.env.NEXT_PUBLIC_API_URL}/store/templates/${id}/`
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

	if (loading) {
		return (
			<div className="text-center mt-5">
				<h1 className="my-5">Templates</h1>
				<div class="d-flex justify-content-center">
					<div class="spinner-grow" role="status">
						<span class="visually-hidden">Loading...</span>
					</div>
				</div>
			</div>
		);
	}

	if (templates.length === 0) {
		return (
			<div className="text-center mt-5">
				<h1 className="my-5">Templates</h1>
				<p>No Templates Found</p>
			</div>
		);
	}

	return (
		<>
			<div className="container w-100">
				<div className="text-center my-5">
					<h1>Templates</h1>
					{isAdmin && (
						<button
							className="btn btn-dark mt-3"
							onClick={handleShow}
						>
							Add Template
						</button>
					)}
				</div>
				<div className="row mb-5">
					{templates.map((template) => (
						<>
							{template.customizable === false && (
								<div
									className="col-lg-3 col-md-6 col-sm-6 mb-4"
									key={template.id}
								>
									<div className="card h-100 template-card">
										{template.image ? (
											<>
												<img
													src={`${process.env.NEXT_PUBLIC_BASE_URL}${template.image}`}
													className="card-img-top"
													alt={`Template ${template.title}`}
													style={{
														height: "150px",
														objectFit: "cover",
													}}
												/>
											</>
										) : (
											<>
												<img
													src="https://via.placeholder.com/150"
													className="card-img-top"
													alt={`Template ${template.title}`}
													style={{
														height: "150px",
														objectFit: "cover",
													}}
												/>
											</>
										)}

										<div className="card-body">
											<h5 className="card-title">
												{template.title}
											</h5>
											<p className="card-text">
												{template.description}
											</p>
											<div className="d-flex justify-content-between flex-wrap">
												{user ? (
													<>
														{loggedIn === true ? (
															<a
																className="btn btn-dark btn-sm"
																onClick={() =>
																	handleAddTemp(
																		template.id
																	)
																}
															>
																Add
															</a>
														) : (
															<a
																className="btn btn-dark btn-sm"
																onClick={() =>
																	handleAddTemp(
																		template.id
																	)
																}
															>
																Add
															</a>
														)}
													</>
												) : (
													<Link href="/login">
														<a className="btn btn-dark btn-sm">
															Use Template
														</a>
													</Link>
												)}

												{template.ecommerce && (
													<span className="badge bg-info pt-2">
														Ecommerce
													</span>
												)}
												{!template.blank && (
													<span>
														{template.ecommerce ? (
															<Link
																href={`/ecommerce/${template.id}`}
															>
																<a className="btn btn-light btn-sm">
																	Preview
																</a>
															</Link>
														) : (
															<Link
																href={`/preview/${template.id}`}
															>
																<a className="btn btn-light btn-sm">
																	Preview
																</a>
															</Link>
														)}
														{isAdmin && (
															<Link
																href={
																	template.ecommerce
																		? `/ecommerce-editor-admin/${template.id}`
																		: `/admin-editor/${template.id}`
																}
															>
																<a className="btn btn-dark btn-sm ms-2">
																	Edit
																</a>
															</Link>
														)}
														{isAdmin &&
															template.deleted && (
																<a
																	className="btn btn-danger btn-sm ms-2"
																	onClick={() =>
																		handleDeleteTemp(
																			template.id
																		)
																	}
																>
																	Delete
																</a>
															)}
													</span>
												)}
											</div>
										</div>
									</div>
								</div>
							)}
						</>
					))}
				</div>
			</div>
			<AddTemplateModal show={show} handleClose={handleClose} />
		</>
	);
}
