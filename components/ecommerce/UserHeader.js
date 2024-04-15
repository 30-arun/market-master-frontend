import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navbar, Dropdown } from "flowbite-react";
import { userLogoutAction } from "../../actions/userLoginAction";
import { useEffect, useState } from "react";
import Link from "next/link";

function Header() {
	const userLogin = useSelector((state) => state.userLoginReducer);
	const { userInfo } = userLogin;

	const dispatch = useDispatch();
	// const history = useNavigate()

	const userCart = useSelector((state) => state.cartReducerKey);
	const { cartItems } = userCart;
	const [sumItmes, setSumItmes] = useState(0);

	useEffect(() => {
		setSumItmes(cartItems.reduce((acc, item) => acc + item.qty, 0));
	}, [userCart, cartItems]);

	const handleLogout = () => {
		dispatch(userLogoutAction());
		dispatch({ type: "PROFILE_DETAILS_REST" });
		// history('/login')
	};

	return (
		<Navbar fluid rounded className="text-xl">
			<Navbar className="container">
				<Link href={`/`}>
					<span className="cursor-pointer text-cyan-700 self-center whitespace-nowrap text-xl font-semibold dark:text-white">
						Gadget <span className="text-orange-500">Hub</span>
					</span>
				</Link>
				<div className="flex md:order-3 text-cyan-700">
					<Link href={`/e/cart/open`}>
						<p className="mt-1 mr-3 cursor-pointer">
							<i className="fa-solid fa-cart-shopping mr-1 text-cyan-700"></i>
							Cart ({sumItmes})
						</p>
					</Link>

					<Navbar.Toggle />
				</div>
				<Navbar.Collapse>
					<Link href={`/`}>
						<p className="cursor-pointer">Home</p>
					</Link>
					<Link href={`/e/contact`}>
						<p className="cursor-pointer">Contact</p>
					</Link>
				</Navbar.Collapse>
			</Navbar>
		</Navbar>
	);
}

export default Header;
