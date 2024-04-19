// components/GrapesJSEditor.js
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import "grapesjs/dist/css/grapes.min.css";
import gjsPresetWebpage from "grapesjs-preset-webpage";
import grapesjsBlocksBasic from "grapesjs-blocks-basic";
import axios from "axios";
const swal = require("sweetalert2");

const GrapesJSEditor = ({ templateId, userId }) => {
	const [section, setSection] = useState({});

	const editorRef = useRef(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				if (userId === "admin") {
					const response = await axios.get(
						`${process.env.NEXT_PUBLIC_API_URL}/store/templates/${templateId}/`
					);
					// setsection section 1
					setSection(response.data);
					console.log(response.data);
				} else {
					const response = await axios.get(
						`${process.env.NEXT_PUBLIC_API_URL}/store/editor-template/${userId}/${templateId}/`
					);
					// setsection section 1
					setSection(response.data);
					console.log(response.data);
				}
			} catch (error) {
				console.error("There was an error!", error);
			}
		};

		fetchData();
	}, []);

	useEffect(() => {
		const grapesjs = require("grapesjs");
		const editor = grapesjs.init({
			container: "#gjs",
			fromElement: true,
			width: "auto",
			height: "100vh",
			storageManager: false,
			plugins: [gjsPresetWebpage, grapesjsBlocksBasic],
			pluginsOpts: {
				gjsPresetWebpage: {
					/* options for the plugin */
				},
				grapesjsBlocksBasic: {},
			},

			canvas: {
				scripts: [
					"https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js",
				],
				// The same would be for external styles
				styles: [
					"https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css",
					"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css",
					"https://fonts.googleapis.com/css2?family=Edu+NSW+ACT+Foundation:wght@400..700&family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&family=Montserrat:ital,wght@0,100..900;1,100..900&family=Open+Sans:ital,wght@0,300..800;1,300..800&family=Reddit+Mono:wght@200..900&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap",
				],
			},

			// Add more configurations here
		});

		// Set the editor to the state
		editorRef.current = editor;

		editor.BlockManager.add("offers-block", {
			label: "Offers Section",
			content: `
        <section class="container mt-5">
            <h2 class="text-center">Offers</h2>
            <p class="text-center">Welcome to our store! We specialize in offering the best products for your needs. Our commitment to quality and customer service sets us apart.</p>
        </section>
    `,
			category: "Basic",
		});

		console.log(editor.getProjectData());

		editor.Panels.addButton("options", {
			id: "save-btn",
			className: "fa fa-save",
			command: "save-db",
			attributes: { title: "Save" },
		});

		// add back button
		editor.Panels.addButton("options", {
			id: "back-btn",
			className: "fa fa-arrow-left",
			command: "go-back",
			attributes: { title: "Go back" },
		});

		editor.Commands.add("go-back", {
			run: function (editor, sender) {
				sender && sender.set("active", 0); // deactivate the button
				window.history.back();
			},
		});

		editor.Commands.add("save-db", {
			run: function (editor, sender) {
				sender && sender.set("active", 0); // deactivate the button

				const htmlSection =
					editor.DomComponents.getWrapper().find(".html-section")[0];
				const htmlSection2 =
					editor.DomComponents.getWrapper().find(".html-section2")[0];
				const jsSection =
					editor.DomComponents.getWrapper().find(".js-section")[0];

				// axios put request
				const putData = async (e) => {
					try {
						if (htmlSection) {
							if (userId === "admin") {
								const response = await axios.put(
									`${process.env.NEXT_PUBLIC_API_URL}/store/templates/${templateId}/`,
									{
										html_content: htmlSection.toHTML(),
										html_content2: htmlSection2.toHTML(),
										js_content: jsSection.toHTML(),
										css_cotent: editor.getCss(),
									}
								);

								console.log(response.data);
								swal.fire({
									title: "Success!",
									text: "Template updated successfully!",
									icon: "success",
									confirmButtonText: "Cool",
								});
							} else {
								const response = await axios.put(
									`${process.env.NEXT_PUBLIC_API_URL}/store/editor-template/${userId}/${templateId}/`,
									{
										html_content: htmlSection.toHTML(),
										html_content2: htmlSection2.toHTML(),
										js_content: jsSection.toHTML(),
										css_cotent: editor.getCss(),
									}
								);

								console.log(response.data);
								swal.fire({
									title: "Success!",
									text: "Template updated successfully!",
									icon: "success",
									confirmButtonText: "Cool",
								});
							}
						} else {
							swal.fire({
								title: "Error!",
								text: "Please add all sections to the template!",
								icon: "error",
								confirmButtonText: "Ok",
							});
						}

						// Handle success (e.g., show a message)
					} catch (error) {
						console.error("Error updating template:", error);
						// Handle error (e.g., show error message)
					}
				};

				putData();

				// Add your code here to handle the saving process
				// For example, sending the HTML/CSS to a server
			},
		});

		function hexToRgb(hex) {
			// Check if the input is a valid hexadecimal color code
			if (!hex || !/^#[0-9A-F]{6}$/i.test(hex)) {
				console.error("Invalid or missing hexadecimal color code.");
				// Returning a default value (black color)
				return { r: 0, g: 0, b: 0 };
			}

			// Remove the '#' character
			hex = hex.replace(/^#/, "");

			try {
				// Parse the hexadecimal string into three separate values for R, G, and B
				var r = parseInt(hex.substring(0, 2), 16);
				var g = parseInt(hex.substring(2, 4), 16);
				var b = parseInt(hex.substring(4, 6), 16);

				// Return the RGB values as an object
				return { r: r, g: g, b: b };
			} catch (error) {
				console.error(
					"Error while converting hexadecimal to RGB:",
					error
				);
				// Returning a default value (black color)
				return { r: 0, g: 0, b: 0 };
			}
		}

		// Test the function with your hexadecimal color code
		if (section.color_theme_pr) {
			const rgbColorPr = hexToRgb(section.color_theme_pr);
			const rgbColorSc = hexToRgb(section.color_theme_sc);

			editor.setStyle(`
		.html-section {
                font-family: ${section.font_family} !important;

		}
			:root {
				--bs-primary-rgb: ${rgbColorPr.r}, ${rgbColorPr.g}, ${rgbColorPr.b} !important;
				--bs-secondary-rgb: ${rgbColorSc.r}, ${rgbColorSc.g}, ${rgbColorSc.b} !important;
			}

		`);
		}

		editor.addStyle(`${section.css_cotent}`);
		editor.addComponents(`
        <div class=".html-section">
        ${section.html_content}
        </div>
        `);
		editor.addComponents(`
        <div class=".html-section1">
        ${section.html_content1}
        </div>
        `);
		editor.addComponents(`
        <div class=".html-section2">
        ${section.html_content2}
        </div>
        `);
		editor.addComponents(`
        <div class=".js-section">
        <script>
        ${section.js_content}
        </script>
        </div>
        `);

		// Clean up
		return () => {
			editorRef.current && editorRef.current.destroy();
		};
	}, [section]);

	return (
		<>
			<div id="gjs"></div>
		</>
	);
};

export default dynamic(() => Promise.resolve(GrapesJSEditor), {
	ssr: false,
});
