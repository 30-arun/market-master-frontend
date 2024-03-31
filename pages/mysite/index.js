import { useState } from "react";
import MySite from "../../components/MySite";
import DashboardInfo from "../../components/DashboardInfo";
import Sidebar from "../../components/Sidebar";

export default function DasboardMySites() {
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
						<MySite />
					</div>
				</div>
			</div>
		</>
	);
}
