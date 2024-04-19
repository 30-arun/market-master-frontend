import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import axios from "axios";
const swal = require("sweetalert2");

const AddCustomDomainModal = ({ show, handleClose, templateId }) => {
	const [domain, setDomain] = useState("");
	const [dnsRecord, setDnsRecord] = useState(null);

	const handleDomainChange = (event) => {
		setDomain(event.target.value);
	};

	const ARecords = [
		{
			id: 1,
			type: "A",
			name: "@",
			value: process.env.NEXT_PUBLIC_SERVER_IP,
		},
		{
			id: 2,
			type: "A",
			name: "www",
			value: process.env.NEXT_PUBLIC_SERVER_IP,
		},
	];

	const domainRegex =
		/^(?:(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9])$/i;

	const handleAddDomain = () => {
		if (!domain) {
			swal.fire("Error", "Domain name is required", "error");
			return;
		}

		if (!domainRegex.test(domain)) {
			swal.fire(
				"Error",
				"Invalid domain format. Please enter a valid domain.",
				"error"
			);
			return;
		}

		if (domain.startsWith("www.")) {
			domain = domain.replace("www.", "");
		}
		domain = domain.toLowerCase();

		axios
			.put(
				`${process.env.NEXT_PUBLIC_API_URL}/store/domain/${templateId}/`,
				{
					user_template: templateId,
					custom_domain: domain,
				}
			)
			.then((response) => {
				swal.fire("Success", "Copy and paste these dns records to your domain provider.", "success");
				setDnsRecord(ARecords);
			})
			.catch((error) => {
				swak.fire("Error", "An error occurred", "error");
			});
	};

	return (
		<Modal show={show} onHide={handleClose}>
			<Modal.Header closeButton>
				<Modal.Title>Add Custom Domain</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<p>Set up your custom domain by entering your domain name.</p>
				<input
					type="text"
					value={domain}
					onChange={handleDomainChange}
					className="form-control"
					placeholder="YourDomain.com"
				/>

				<Button
					onClick={handleAddDomain}
					className="mt-3"
					variant="secondary"
				>
					Add Domain
				</Button>
				{dnsRecord && (
					<div className="mt-3">
						<h5 className="my-3">DNS A Records</h5>
						<p>
							Copy and paste these dns records to your domain
							provider.
						</p>
						<table className="table">
							<thead>
								<tr>
									<th>#</th>
									<th>Type</th>
									<th>Name/Host</th>
									<th>Value</th>
								</tr>
							</thead>
							<tbody>
								{ARecords.map((record, index) => (
									<tr key={record.id}>
										<th>{index + 1}</th>
										<td>{record.type}</td>
										<td>{record.name}</td>
										<td>{record.value}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</Modal.Body>
		</Modal>
	);
};

export default AddCustomDomainModal;
