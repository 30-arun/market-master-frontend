import "../styles/globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Head from "next/head";
import Layout from "../components/Layout";
import SSRProvider from "react-bootstrap/SSRProvider";
import { AuthProvider } from "../context/AuthContext";
import { Provider } from "react-redux";
import store from "../utils/store";
import { SidebarProvider } from "../context/SidebarContext";

function MyApp({ Component, pageProps }) {
	return (
		<SSRProvider>
			<Provider store={store}>
				<SidebarProvider>
					<AuthProvider>
						<Layout>
							<Head>
								<title>Market Master</title>
								<link
									rel="shortcut icon"
									href="/logos/favicon.ico"
									type="image/x-icon"
								/>
								<link
									rel="stylesheet"
									href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
								/>

								<script
									src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0/dist/js/bootstrap.bundle.min.js"
									defer
								></script>
							</Head>
							<Component {...pageProps} />
						</Layout>
					</AuthProvider>
				</SidebarProvider>
			</Provider>
		</SSRProvider>
	);
}

export default MyApp;
