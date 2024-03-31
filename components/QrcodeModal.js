import React from "react";
import { Modal, Button } from "react-bootstrap";
import QRCode from "qrcode.react";

const QrcodeModal = ({ showModal, setShowModal, qrCodeData }) => {
	return (
		<Modal show={showModal} onHide={() => setShowModal(false)} centered>
			<Modal.Header closeButton>
				<Modal.Title>Preview Link</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<div className="text-center">
					<h6>Scan QR Code to get link</h6>
					<a
						href={qrCodeData}
						target="_blank"
						rel="noopener noreferrer"
					>
						{qrCodeData}
					</a>
				</div>
				<div className="d-flex justify-content-center align-items-center pt-3">
					<div
						style={{
							padding: "10px",
							backgroundColor: "#f8f9fa",
							borderRadius: "5px",
							boxShadow: "0 4px 8px rgba(0,0,0,.1)",
						}}
						title="scan qr code to get link"
					>
						{/* Assuming QRCode is a component you have defined or imported */}
						<QRCode value={qrCodeData} />
					</div>
				</div>
			</Modal.Body>
		</Modal>
	);
};

export default QrcodeModal;
