import React, { useEffect, useState } from "react";
import GrapesJSEditor from "../../components/ecommerce/Editor";
import { useRouter } from "next/router";

const HomePage = () => {
	const router = useRouter();
	const [isRouterReady, setIsRouterReady] = useState(false);

	useEffect(() => {
		if (router.isReady) {
			setIsRouterReady(true);
		}
	}, [router.isReady]);


	// Wait for the router to be ready before rendering the GrapesJSEditor
	if (!isRouterReady) {
		return (
			<div class="d-flex justify-content-center">
				<div class="spinner-grow" role="status">
					<span class="visually-hidden">Loading...</span>
				</div>
			</div>
		);
	}

	// Now you can safely access router.query
	const { id } = router.query;

	// Handle the case where id is still not available
	if (!id) {
		return <div>Error: Template ID is missing.</div>;
	}

	return (
		<div>
			<GrapesJSEditor templateId={id} userId="admin" />
		</div>
	);
};

export default HomePage;
