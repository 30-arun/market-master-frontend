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

				const htmlSection1 =
					editor.DomComponents.getWrapper().find(".html-section1")[0];
				const htmlSection3 =
					editor.DomComponents.getWrapper().find(".html-section3")[0];
				const jsSection =
					editor.DomComponents.getWrapper().find(".js-section")[0];

				// axios put request
				const putData = async (e) => {
					try {
						if (htmlSection1) {
							if (userId === "admin") {
								const response = await axios.put(
									`${process.env.NEXT_PUBLIC_API_URL}/store/templates/${templateId}/`,
									{
										html_content1: htmlSection1.toHTML(),
										html_content3: htmlSection3.toHTML(),
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
										html_content1: htmlSection1.toHTML(),
										html_content3: htmlSection3.toHTML(),
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
		editor.addStyle(`${section.css_cotent}`);

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
            <div class=".html-section3">
            ${section.html_content3}
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
