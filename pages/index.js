import { useState, useContext } from "react";
import TempNavbar from "../components/TempNavbar";
import TempFooter from "../components/TempFooter";
import Templates from "../components/Templates";
import Head from "next/head";
import Link from "next/link";
import StartedModal from "../components/StartedModal";
import AuthContext from "../context/AuthContext";

export default function Index() {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const { user } = useContext(AuthContext);

  return (
    <>
      <Head>
        <title>Market Master</title>
        <meta
          name="description"
          content="Market Master is a user-friendly online platform that allows you to create, design, and publish your own website without needing any coding skills. With our intuitive drag-and-drop interface, you can easily customize your website to suit your personal or business needs."
        />
        <meta
          name="keywords"
          content="website builder, drag and drop, no coding, easy to use, templates, seo tools"
        />
        <meta name="author" content="Market Master" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/logos/favicon.ico" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
        />
        <link
          rel="stylesheet"
          href="https://stackpath.bootstrapcdn.com/bootstrap/5.0.0-alpha1/css/bootstrap.min.css"
        />
        <style>
          {`
            #faqse .collapse {
              visibility: visible !important;
            }
            
            .btn-primary {
							background-image: linear-gradient(315deg, #2a2a72 0%, #009ffd 74%);
							border: none;
							transition: transform 0.2s ease-in-out, box-shadow 0.3s ease-in-out;
						}

						.btn-primary:hover {
							transform: translateY(-2px);
							box-shadow: 0 10px 20px rgba(0, 123, 255, 0.25);
						}

						.btn-primary:active {
							transform: translateY(1px);
						}

						.button-text {
							display: inline-block;
							position: relative;
							transition: all 0.3s ease;
						}

						.button-text::after {
							content: '';
							position: absolute;
							height: 2px;
							background-color: #fff;
							width: 0;
							bottom: -3px;
							left: 0;
							transition: width 0.3s ease;
						}

						.btn-primary:hover .button-text::after {
							width: 100%;
						}
                    
                    `}
        </style>
      </Head>
      <TempNavbar />
      <section class="hero-section mt-4">
        <div class="container">
          <div class="row align-items-center justify-content-md-between">
            <div class="col-md-6">
              <h1 class="display-3 fw-bold">Build Your Dream Website Easily</h1>
              <p class="lead my-4">
                Create stunning websites with our easy-to-use, drag-and-drop
                website builder. No coding required!
              </p>
              {user ? (
                <a
                  onClick={handleShow}
                  class="btn btn-lg btn-primary px-4 me-md-2"
                >
                  <span class="button-text">Get Started</span>
                </a>
              ) : (
                <Link href="/login">
                  <a class="btn btn-lg btn-primary px-4 me-md-2">
                    <span class="button-text">Get Started</span>
                  </a>
                </Link>
              )}
            </div>
            <div class="col-md-6">
              <img
                src="https://www.hostaway.net.au/wp-content/uploads/2017/03/web-design.png"
                class="img-fluid float-end"
                alt="Website Builder Image"
              />
            </div>
          </div>
        </div>
      </section>
      <section id="features" class="py-5">
        <div class="container">
          <div class="row text-center">
            <div class="col-12">
              <h2 class="mb-4">Amazing Features</h2>
              <p class="lead mb-5">
                Discover the incredible functionalities that make our website
                builder stand out.
              </p>
            </div>
          </div>

          <div class="row text-center">
            <div class="col-md-4 mb-4">
              <div class="card h-100">
                <div class="card-body">
                  <i
                    class="fa-solid fa-laptop mb-3"
                    style={{ fontSize: "2rem" }}
                  ></i>
                  <h5 class="card-title">Drag & Drop Editor</h5>
                  <p class="card-text">
                    Effortlessly create stunning websites with our intuitive
                    drag and drop interface.
                  </p>
                </div>
              </div>
            </div>

            <div class="col-md-4 mb-4">
              <div class="card h-100">
                <div class="card-body">
                  <i
                    class="fa-solid fa-palette mb-3"
                    style={{ fontSize: "2rem" }}
                  ></i>
                  <h5 class="card-title">Customizable Templates</h5>
                  <p class="card-text">
                    Choose from a vast collection of professionally designed
                    templates.
                  </p>
                </div>
              </div>
            </div>

            <div class="col-md-4 mb-4">
              <div class="card h-100">
                <div class="card-body">
                  <i
                    class="fa-solid fa-gear mb-3"
                    style={{ fontSize: "2rem" }}
                  ></i>
                  <h5 class="card-title">Advanced SEO Tools</h5>
                  <p class="card-text">
                    Optimize your site with advanced SEO tools for higher search
                    engine rankings.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="templates" class="py-3 bg-light">
        <Templates loggedIn={false} />
      </section>
      <section class="container my-5" id="faqse">
        <h2 class="text-center mb-4">Frequently Asked Questions</h2>
        <div class="accordion" id="faqAccordion">
          <div class="accordion-item">
            <h2 class="accordion-header" id="headingOne">
              <button
                class="accordion-button"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseOne"
                aria-controls="collapseOne"
              >
                What is Market Master?
              </button>
            </h2>
            <div
              id="collapseOne"
              class="accordion-collapse collapse show"
              aria-labelledby="headingOne"
              data-bs-parent="#faqAccordion"
            >
              <div class="accordion-body">
                <p>
                  Market Master is a user-friendly online platform that allows
                  you to create, design, and publish your own website without
                  needing any coding skills. With our intuitive drag-and-drop
                  interface, you can easily customize your website to suit your
                  personal or business needs.
                </p>
              </div>
            </div>
          </div>
          <div class="accordion-item">
            <h2 class="accordion-header" id="headingTwo">
              <button
                class="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseTwo"
                aria-expanded="false"
                aria-controls="collapseTwo"
              >
                How much does it cost to use Market Master?
              </button>
            </h2>
            <div
              id="collapseTwo"
              class="accordion-collapse collapse"
              aria-labelledby="headingTwo"
              data-bs-parent="#faqAccordion"
            >
              <div class="accordion-body">
                <p>
                  We offer various pricing plans to fit your needs, including a
                  free plan with basic features. Our premium plans offer
                  additional features like custom domain hosting, advanced SEO
                  tools, and e-commerce capabilities. Please visit our pricing
                  page for detailed information on each plan.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <StartedModal show={show} handleClose={handleClose} />
      <TempFooter />
    </>
  );
}
