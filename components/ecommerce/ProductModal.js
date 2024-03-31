import { useState } from "react";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";
const swal = require("sweetalert2");

const ProductModal = ({ showPModal, setPShowModal, templateId }) => {
	const [formData, setFormData] = useState({
		name: "",
		brand: "",
		description: "",
		rating: "",
		numReviews: "",
		price: "",
		countinStock: "",
		slug: "",
		image: null,
	});

	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleFileChange = (e) => {
		setFormData({ ...formData, image: e.target.files[0] });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const data = new FormData();
		Object.keys(formData).forEach((key) => {
			data.append(key, formData[key]);
		});

		// Append the template id to the form data
		data.append("user_template", templateId);
		try {
			const response = await axios.post(
				`http://127.0.0.1:8000/product/new/`,
				data,
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
				}
			);
			console.log(response.data);
			// form reset
			document.getElementById("productForm").reset();
			swal.fire({
				title: "Success",
				text: "Product added successfully",
				icon: "success",
				timer: 2000,
				showConfirmButton: false,
			});
			setPShowModal(false);
			window.location.reload();
		} catch (error) {
			console.log(error);
			swal.fire({
				title: "Error",
				text: "An error occurred. Please try again later",
				icon: "error",
				timer: 2000,
				showConfirmButton: false,
			});
		}
	};

	return (
		<Modal show={showPModal} onHide={() => setPShowModal(false)} centered>
			<Modal.Header closeButton>
				<Modal.Title>Product Form</Modal.Title>
			</Modal.Header>
			<div className="modal-body">
				<form onSubmit={handleSubmit} id="productForm">
					<div className="mb-3">
						<label htmlFor="name" className="form-label">
							Title
						</label>
						<input
							type="text"
							className="form-control"
							placeholder="Enter product title"
							id="name"
							name="name"
							onChange={handleInputChange}
							required
						/>
					</div>
					<div className="mb-3">
						<label htmlFor="image" className="form-label">
							Image
						</label>
						<input
							type="file"
							className="form-control"
							id="image"
							name="image"
							onChange={handleFileChange}
							required
						/>
					</div>
					<div className="mb-3">
						<label htmlFor="brand" className="form-label">
							Brand
						</label>
						<input
							type="text"
							className="form-control"
							placeholder="Enter product brand"
							id="brand"
							name="brand"
							onChange={handleInputChange}
							required
						/>
					</div>
					<div className="mb-3">
						<label htmlFor="description" className="form-label">
							Description
						</label>
						<textarea
							className="form-control"
							placeholder="Enter product description"
							id="description"
							name="description"
							onChange={handleInputChange}
							required
						></textarea>
					</div>
					<div className="mb-3">
						<label htmlFor="rating" className="form-label">
							Rating
						</label>
						<input
							type="number"
							className="form-control"
							placeholder="Enter product rating"
							id="rating"
							name="rating"
							onChange={handleInputChange}
							required
						/>
					</div>
					<div className="mb-3">
						<label htmlFor="numReviews" className="form-label">
							Number of Reviews
						</label>
						<input
							type="number"
							className="form-control"
							placeholder="Enter number of reviews"
							id="numReviews"
							name="numReviews"
							onChange={handleInputChange}
							required
						/>
					</div>
					<div className="mb-3">
						<label htmlFor="price" className="form-label">
							Price
						</label>
						<input
							type="number"
							className="form-control"
							placeholder="Enter product price"
							id="price"
							name="price"
							onChange={handleInputChange}
							required
						/>
					</div>
					<div className="mb-3">
						<label htmlFor="countinStock" className="form-label">
							Count in Stock
						</label>
						<input
							type="number"
							className="form-control"
							placeholder="Enter count in stock"
							id="countinStock"
							name="countinStock"
							onChange={handleInputChange}
							required
						/>
					</div>
					<div className="mb-3">
						<label htmlFor="slug" className="form-label">
							Slug
						</label>
						<input
							type="text"
							className="form-control"
							placeholder="Enter product slug"
							id="slug"
							name="slug"
							onChange={handleInputChange}
							required
						/>
					</div>
				</form>
			</div>
			<div className="modal-footer">
				<button
					type="button"
					className="btn btn-secondary"
					onClick={() => setPShowModal(false)}
				>
					Close
				</button>
				<button
					type="submit"
					className="btn btn-primary"
					form="productForm"
				>
					Save Product
				</button>
			</div>
		</Modal>
	);
};

export default ProductModal;
