import axios from "axios";
import {
	CART_ADD_ITEM,
	CART_REMOVE_ITEM,
	CART_SAVE_SHIPPING,
} from "../constants/cartConstants";

const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

export const addToCart = (slug, qty, id) => async (dispatch, getState) => {
	const { data } = await axios.get(
		`${baseURL}/product/${slug}/${id}/`
	);
	dispatch({
		type: CART_ADD_ITEM,
		payload: {
			slug: data.slug,
			name: data.name,
			image: data.image,
			price: data.price,
			countinStock: data.countinStock,
			qty,
		},
	});

	localStorage.setItem(
		"cartItemsStorage",
		JSON.stringify(getState().cartReducerKey.cartItems)
	);
};

export const removeFromCart = (slug) => (dispatch, getState) => {
	dispatch({
		type: CART_REMOVE_ITEM,
		payload: slug,
	});

	localStorage.setItem(
		"cartItemsStorage",
		JSON.stringify(getState().cartReducerKey.cartItems)
	);
};

export const saveShippingData = (data) => (dispatch) => {
	dispatch({
		type: CART_SAVE_SHIPPING,
		payload: data,
	});

	localStorage.setItem("shippingData", JSON.stringify(data));
};
