import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import axios from "axios";
import AddCustomDomainModal from "./CustomDomain";
const swal = require("sweetalert2");

const PublishModal = ({ show, handleClose, templateId }) => {
  // State to control visibility of the AddCustomDomainModal
  const [showAddDomainModal, setShowAddDomainModal] = useState(false);
  const [domain, setDomain] = useState({});
  const [slug, setSlug] = useState("");

  const fetchDomainDetails = () => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/store/domain/${templateId}/`)
      .then((response) => {
        setDomain(response.data);
        setSlug(response.data.slug);
      })
      .catch((error) => {
        console.error("Error fetching domain details: ", error);
      });
  };

  useEffect(() => {
    fetchDomainDetails();
  }, [templateId, show]);

  const handleSave = () => {
    if (slug.includes(" ") || slug.length < 5) {
      swal.fire(
        "Error",
        "Slug must be at least 5 characters long and should not contain spaces",
        "error"
      );
      return;
    }
    // Save the slug to the domain
    axios
      .put(`${process.env.NEXT_PUBLIC_API_URL}/store/domain/${templateId}/`, {
        user_template: templateId,
        slug: slug,
        domain_name: domain.domain_name,
      })
      .then((response) => {
        swal.fire("Success", "Slug saved successfully", "success");
        fetchDomainDetails();
      })
      .catch((error) => {
        swal.fire("Error", "Slug already taken!", "error");
      });
  };

  const handleOpenAddDomainModal = () => {
    setShowAddDomainModal(true);
    handleClose();
  };

  const handleCloseAddDomainModal = () => {
    setShowAddDomainModal(false);
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Site address (URL)</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {domain.domain_name ? (
            <>
              <h6>Enter the address where you want to publish your site.</h6>
              <p>Your subdomain:</p>
              <div className="bg-light p-3 rounded d-flex">
                {process.env.NEXT_PUBLIC_API_PROTOCOL}://
                <input
                  type="text"
                  className="w-100 py-0 px-2 m-0 rounded"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                />
                .{process.env.NEXT_PUBLIC_API_SUB_DOMAIN_NAME}/
              </div>
              <Button className="btn btn-secondary mt-3" onClick={handleSave}>
                Save
              </Button>
            </>
          ) : (
            <>
              <p>Domain name not found!</p>
            </>
          )}

          {domain.custom_domain && (
            <div className="mt-3">
              <p>Your custom domain:</p>
              <div className="p-3 bg-light rounded">
                <a href="https://{domain.custom_domain}/">
                  {process.env.NEXT_PUBLIC_API_PROTOCOL}://
                  {domain.custom_domain}/
                </a>
              </div>
            </div>
          )}

          <div className="bg-light p-4 rounded my-3 text-center">
            <p className="m-0 p-0">Connect your own branded domain.</p>
            <a href="#" onClick={handleOpenAddDomainModal}>
              Upgrade Now
            </a>
          </div>
        </Modal.Body>
      </Modal>

      {/* Add Custom Domain Modal */}
      <AddCustomDomainModal
        show={showAddDomainModal}
        handleClose={handleCloseAddDomainModal}
        templateId={templateId}
      />
    </>
  );
};

export default PublishModal;
