import { useEffect, useState } from "react";
import Home from "../components/Home";
import UserWebsite from "../components/UserWebsite";
import axios from "axios";
import Ecommerce from "../components/EcommerceUser";

const hostName = process.env.NEXT_PUBLIC_HOST_NAME;

export default function Index() {
  const [ecommerce, setEcommerce] = useState(false);
  const [loading, setLoading] = useState(false);
  const domain = window.location.hostname.replace("www.", "");
  let subdomain = window.location.hostname.split(".")[0];

  if (!domain.endsWith(hostName)) {
    subdomain = domain;
  }

  useEffect(() => {
    // Avoid fetchData call on localhost
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/store/slug_id/${subdomain}/`
        );
        console.log(response.data);
        setEcommerce(response.data.ecommerce);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [subdomain]);

  if (loading) {
    return (
      <div class="d-flex justify-content-center">
        <div class="spinner-grow" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (ecommerce) return <Ecommerce />;
  if (!domain.endsWith(hostName)) return <UserWebsite />;

  if (subdomain === hostName.split('.')[0])
    return <Home />;
  return <UserWebsite />;
}
