import React from "react";
import { Avatar, Select, Button } from "flowbite-react";
import { useDispatch } from "react-redux";
import { addToCart, removeFromCart } from "../../actions/cartAction";
import Link from "next/link";

function TableRow(props) {
	const product = props.product;
	const dispatch = useDispatch();

	const removeProductFromCart = (slug) => {
		dispatch(removeFromCart(slug));
	};

	return (
		<tr className="bg-white border-b dark:bg-gray-900 dark:border-gray-700">
			<th
				scope="row"
				className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
			>
				<Avatar
					img={`${process.env.NEXT_PUBLIC_BASE_URL}${product.image}`}
					size="lg"
					// className='float-left'
				/>
			</th>
			<th
				scope="row"
				className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
			>
				<Link href={`/e/product-details/${product.slug}`}>
					<span className="text-cyan-800 underline">
						{product.name}
					</span>
				</Link>
			</th>
			<td className="px-6 py-4 text-black">${product.price}</td>
			<td className="px-6 py-4">
				<Select
					id={`qty-${product.slug}`}
					onChange={(e) =>
						dispatch(
							addToCart(product.slug, Number(e.target.value))
						)
					}
				>
					<option>{product.qty}</option>
					{[...Array(product.countinStock).keys()]
						.filter((x) => x + 1 !== product.qty)
						.map((x) => (
							<option key={x + 1}>{x + 1}</option>
						))}
				</Select>
			</td>
			<td className="px-6 py-4 text-black">
				${(product.price * product.qty).toFixed(2)}
			</td>
			<td className="px-6 py-4">
				<Button
					color="light"
					onClick={() => removeProductFromCart(product.slug)}
				>
					<i className="fa-solid fa-trash"></i>
				</Button>
			</td>
		</tr>
	);
}

export default TableRow;
