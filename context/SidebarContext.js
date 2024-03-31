// sidebarContext.js
import React, { createContext, useContext, useState } from "react";

const SidebarContext = createContext();

export const useSidebar = () => useContext(SidebarContext);

export const SidebarProvider = ({ children }) => {
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);

	return (
		<SidebarContext.Provider value={{ isDropdownOpen, setIsDropdownOpen }}>
			{children}
		</SidebarContext.Provider>
	);
};
