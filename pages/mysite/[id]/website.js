import { useState } from "react";
import MySite from "../../../components/MySite";
import DashboardInfo from "../../../components/DashboardInfo";
import Sidebar from "../../../components/Sidebar";
import MySiteDetail from "../../../components/MySiteDetail";

export default function WebsiteMySites() {
	const [isSidebarActive, setIsSidebarActive] = useState(false);

	const toggleSidebar = () => {
		setIsSidebarActive(!isSidebarActive);
	};

	return (
		<>
			<div className="main-container d-flex">
				<Sidebar
					isSidebarActive={isSidebarActive}
					toggleSidebar={toggleSidebar}
				/>
				<div class="content">
					<DashboardInfo toggleSidebar={toggleSidebar} />
					<div class="dashboard-content px-3 pb-3">
						<MySiteDetail />
					</div>
				</div>
			</div>
		</>
	);
}
