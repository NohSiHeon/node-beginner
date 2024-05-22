import mongoose from "mongoose";
import { PRODUCT_STATUS } from "../constants/product.constants.js";

const productSchema = new mongoose.Schema({
	name: {
		type: String,
		requried: true,
		unique: true,
	},
	description: {
		type: String,
		required: true,
	},
	manager: {
		type: String,
		required: true,
	},
	passord: {
		type: String,
		requried: true,
		select: false,
	},
	status: {
		type: String,
		enum: Object.values(PRODUCT_STATUS),
		default: PRODUCT_STATUS.FOR_SALE,
	},
},
	{ timestamps: true, toJSON: { virtuals: true } },
);

export const Product = mongoose.model('Product', productSchema);