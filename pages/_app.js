import "../styles/globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Head from "next/head";
import Layout from "../components/Layout";
import SSRProvider from "react-bootstrap/SSRProvider";
import { AuthProvider } from "../context/AuthContext";
import { Provider } from "react-redux";
import store from "../utils/store";
import { SidebarProvider } from "../context/SidebarContext";
import { QueryClient, QueryClientProvider } from "react-query";
import { useRouter } from "next/router";

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }) {
    //   const router = useRouter();
    //   useEffect(() => {
    //     try {
    //       // get pathname and location
    //       let pathname = router.pathname;
    //       let location = window.location.pathname;

    //       // ensure paths have trailing '/'
    //       const lastLocation = location.charAt(location.length - 1);
    //       if (lastLocation != "/") {
    //         location = `${location}/`;
    //       }
    //       const lastPath = pathname.charAt(pathname.length - 1);
    //       if (lastPath != "/") {
    //         pathname = `${pathname}/`;
    //       }

    //       // redirect to page in actual url
    //       if (pathname != location) {
    //         router.replace(location).then((success) => {
    //           if (!success) {
    //             const newPath = "/404";
    //             // window.location.pathname = newPath;
    //             // let res = router.replace(newPath);
    //           }
    //         });
    //       }
    //     } catch (e) {
    //       console.error(e);
    //     }
    //   });

    return (
        <SSRProvider>
            <Provider store={store}>
                <QueryClientProvider client={queryClient}>
                    <SidebarProvider>
                        <AuthProvider>
                            <Layout>
                                <Head>
                                    <title>Market Master</title>
                                    <link
                                        rel="shortcut icon"
                                        href="/logos/favicon.ico"
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
                </QueryClientProvider>
            </Provider>
        </SSRProvider>
    );
}

export default MyApp;
