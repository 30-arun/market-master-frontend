import Link from "next/link";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSidebar } from "../context/SidebarContext";
import { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";
import axios from "axios";

const Sidebar = ({ isSidebarActive, toggleSidebar }) => {
	const router = useRouter();
	const { isDropdownOpen, setIsDropdownOpen } = useSidebar();
	const [dropdownLinks, setDropdownLinks] = useState([]);
	const { user } = useContext(AuthContext);
	const userId = user?.user_id;
	const [loading, setLoading] = useState(true);


	useEffect(() => {
		if (!router.isReady) return;

		const fetchData = async () => {
			try {
				const response = await axios.get(
					`http://127.0.0.1:8000/store/user-template/${userId}/`
				); // Replace with your API endpoint
				setDropdownLinks(response.data);
				console.log(response.data);
			} catch (err) {
				console.error("Error fetching data:", err);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [router.isReady, userId]);

	const isActive = (pathname) => {
		return router.pathname === pathname;
	};

	const dropdownLinksActive = (pathname) => {
		const { id } = router.query;
		if (pathname === `/mysite/${id}/website/`) {
			return true;
		} else {
			return false;
		}
	};
	const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

	if (loading) {
		return <div>Loading...</div>;
	}

	return (
		<>
			<Head>
				<style>
					{`
                    #navbarSupportedContent {
                        visibility: visible;
                    }

                    .navb-text {
                        display: flex;
                        align-items: center;

                        
                    }

					.dropdown-content {
							transition: max-height 0.3s ease-out;
							overflow: hidden;
							max-height: 0;
						}
					.dropdown-content.open {
						max-height: 500px; /* Adjust as needed */
						transition: max-height 0.5s ease-in;
					}

				
                        .dropdown-link.active {
                           background: #eee;
							border-radius: 8px;
							color: #000;
                        }

					.dropdown-arrow {
							transition: transform 0.3s ease;

						}
					
                    @media (max-width: 768px) {
                        #navbarSupportedContent {
                            visibility: hidden;
                        }
                    }
                    `}
				</style>
			</Head>
			<div
				className={`sidebar ${isSidebarActive ? "active" : ""}`}
				id="side_nav"
			>
				<div class="header-box px-2 pt-3 pb-4 d-flex justify-content-between">
					<Link href="/">
						<h1 class="fs-4 navb-text cursor-pointer">
							<span class="bg-white text-dark rounded shadow px-2 me-2">
								<img
									className="img-fluid"
									width="50px"
									style={{ cursor: "pointer" }}
									src="/logos/mylogo.png"
									alt="..."
								/>
							</span>{" "}
							<span class="text-white">Market Master</span>
						</h1>
					</Link>
					<button
						class="btn d-md-none d-block close-btn px-1 py-0 text-white"
						onClick={toggleSidebar}
					>
						<i class="fa-solid fa-stream"></i>
					</button>
				</div>

				<ul class="list-unstyled px-2" style={{maxHeight: "550px", overflow: "auto"}}>
					<Link href="/mysite">
						<li className={isActive("/mysite") ? "active" : ""}>
							<a
								href="#"
								class="text-decoration-none px-3 py-2 d-block mb-2"
							>
								<i class="fa-solid fa-home me-1"></i> Dashboard
							</a>
						</li>
					</Link>
					<li className="mb-2">
						<a
							href="#"
							class={`text-decoration-none px-3 py-2 d-flex justify-content-between align-items-center dropdown-link ${
								isDropdownOpen ? "active" : ""
							}`}
							onClick={toggleDropdown}
						>
							<span>
								<i class="fa-solid fa-table-cells-large me-1"></i>{" "}
								My Sites
							</span>
							<i
								class={`fa-solid ${
									isDropdownOpen
										? "fa-chevron-up"
										: "fa-chevron-down"
								} dropdown-arrow ${
									isDropdownOpen ? "open" : ""
								}`}
							></i>
						</a>

						<div
							className={`dropdown-content  ${
								isDropdownOpen ? "open" : ""
							}`}
						>
							<ul
								className="ms-4 px-2"
								style={{ borderLeft: "2px solid #eee" }}
							>
								{dropdownLinks.map((link) => (
									<Link
										href={`/mysite/${link.id}/website/`}
										key={link.id}
									>
										<li
											className={
												dropdownLinksActive(
													`/mysite/${link.id}/website/`
												)
													? "active my-2"
													: "my-2"
											}
										>
											<a class="text-decoration-none px-3 py-2 d-block cursor-pointer text-truncate">
												<i class="fa-solid fa-file me-2"></i>
												{link.title}
											</a>
										</li>
									</Link>
								))}

								{/* Add more links as needed */}
							</ul>
						</div>
					</li>
					<Link href="/templates">
						<li className={isActive("/templates") ? "active" : ""}>
							<a
								href="#"
								class="text-decoration-none px-3 py-2 d-block mb-2"
							>
								<i class="fa-solid fa-boxes-stacked me-1"></i>{" "}
								Templates
							</a>
						</li>
					</Link>
					<Link href="/qrcode">
						<li className={isActive("/qrcode") ? "active" : ""}>
							<a
								href="#"
								class="text-decoration-none px-3 py-2 d-block mb-2"
							>
								<i class="fa-solid fa-qrcode me-1"></i> QR code
							</a>
						</li>
					</Link>
					<Link href="/qrcode-history">
						<li
							className={
								isActive("/qrcode-history") ? "active" : ""
							}
						>
							<a
								href="#"
								class="text-decoration-none px-3 py-2 d-block mb-2"
							>
								<i class="fa-solid fa-database me-1"></i> QR
								Code History
							</a>
						</li>
					</Link>

					<hr class="text-white bg-white" />
				</ul>
				<div className="text-center position-absolute bottom-0 mx-5">
					<p>&copy; 2024 Market Master.</p>
				</div>
			</div>
		</>
	);
};

export default Sidebar;
