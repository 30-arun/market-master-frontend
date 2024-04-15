import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
// import Form from "react-bootstrap/Form";
// import axios from "axios";
// import AuthContext from "../context/AuthContext";
// import { useRouter } from "next/router";
const swal = require("sweetalert2");

function SeeProducts({ show, handleClose, templateId }) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/product/new/?template_id=${templateId}`
        );
        setMessages(response.data);
      } catch (error) {
        console.error("There was an error!", error);
      }
    };
    fetchData();
  }, [templateId, show]);

  const handleDeleteMessage = async (id) => {
    try {
      const result = await swal.fire({
        title: "Are you sure?",
        text: "You want to delete this product?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        await axios.delete(
          `${process.env.NEXT_PUBLIC_API_URL}/product/new/?template_id=${templateId}&product_id=${id}`
        );
        const newMessages = messages.filter((message) => message._id !== id);
        setMessages(newMessages);
        swal.fire({
          title: "Success!",
          text: "product deleted successfully",
          icon: "success",
          timer: 2000,
        });
      }
    } catch (error) {
      console.error("There was an error!", error);
      swal.fire({
        title: "Error!",
        text: "There was a problem deleting the message.",
        icon: "error",
      });
    }
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Products</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{ maxHeight: "500px", overflow: "auto" }}>
            {messages.length === 0 ? (
              <div className="alert alert-info" role="alert">
                No products to display.
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className="card mb-3"
                  style={{ maxWidth: "540px" }}
                >
                  <div className="card-header bg-light d-flex justify-content-between align-items-center">
                    <div>
                      <strong>Name: </strong>
                      <span className="text-truncate">{message.name}</span>
                    </div>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteMessage(message._id)}
                    >
                      Delete
                    </button>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-sm-6">
                        <img
                          src={`${process.env.NEXT_PUBLIC_BASE_URL}${message.image}`}
                          className="img-fluid"
                          alt="product"
                          style={{
                            height: "120px",
                            width: "120px",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                      <div className="col-sm-6">
                        <p className="card-text mb-1">
                          <strong>Brand: </strong>
                          {message.brand}
                        </p>
                        <p className="card-text mb-1">
                          <strong>Price: </strong>${message.price}
                        </p>
                        <p className="card-text mb-1">
                          <strong>Rating: </strong>
                          {message.rating} / 5
                        </p>
                        <p className="card-text mb-1">
                          <strong>Stock: </strong>
                          {message.countinStock} / 5
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="light" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default SeeProducts;
