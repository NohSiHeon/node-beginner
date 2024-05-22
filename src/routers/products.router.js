import express from "express";
import { Product } from "../schemas/product.schemas.js";

const productRouter = express.Router();

// 상품 생성 (CREATE)
productRouter.post('/products', async (req, res) => {
	// 상품 정보 파싱하기
	// request Body 정보를 구조 분해 할당
	const { name, description, manager, password } = req.body;

	// DB에 저장하기
	const product = new Product({ name, description, manager, password });
	let data = await product.save();

	data = { ...data.toJSON(), password: undefined };

	// 완료 메시지 반환하기
	return res.status(201).json({ status: 201, message: "상품 생성에 성공했습니다.", data });
});

// 상품 목록 조회 (READ)
productRouter.get('/products', async (req, res) => {
	// DB에서 조회하기(생성일시 기준 내림차순 정렬)
	const data = await Product.find().sort({ createdAt: 'desc' }).exec();

	// 완료 메시지 반환하기
	return res
		.status(200)
		.json({ status: 200, message: "상품 목록 조회에 성공했습니다.", data });
});

// 상품 상세 조회 (READ)
productRouter.get('/products/:id', async (req, res) => {
	// 상품 ID 파싱하기
	const { id } = req.params;

	// DB에서 조회하기
	const data = await Product.findById(id).exec();

	// 완료 메시지 반환하기
	return res
		.status(200)
		.json({ status: 200, message: '상품 상제 조회에 성공했습니다.', data });
});
// 상품 수정 (UPDATE)
productRouter.put('/products/:id', async (req, res) => {
	// 상품 ID 파싱하기
	const { id } = req.params;

	// 상품 수정 정보 파싱하기
	const { name, description, manager, status, password } = req.body;

	// DB에서 조회하기 (패스워드 포함)
	const existedProduct = await Product.findById(id, { password: true });

	// 비밀번호 일치 여부 확인
	const isPasswordMatched = password === existedProduct.password;

	if (!isPasswordMatched) {
		return res.status(401).json({
			status: 401,
			mesaage: "비밀번호가 일치하지 않습니다."
		});
	}
	const productInfo = {
		...(name && { name }),
		...(description && { description }),
		...(manager && { manager }),
		...(status && { status }),
	};

	// DB에 갱신하기
	const data = await Product.findByIdAndUpdate(id, productInfo, { new: true });

	// 완료 메시지 반환하기
	return res.status(200).json({
		status: 200,
		message: '상품 수정에 성공했습니다.',
		data
	});


});
// 상품 삭제 (DELETE)
productRouter.delete('/products/:id', async (req, res) => {
	// 상품 ID 파싱하기
	const { id } = req.params;

	// 패스워드파싱하기
	const { password } = req.body;

	// DB에서 조회하기 (패스워드 포함)
	const existedProduct = await Product.findById(id, { password: true });

	// 비밀번호 일치 여부 확인
	const isPasswordMatched = password === existedProduct.password;

	if (!isPasswordMatched) {
		return res.status(401).json({
			status: 401,
			mesaage: "비밀번호가 일치하지 않습니다."
		});
	}

	// DB에서 삭제하기
	const data = await Product.findByIdAndDelete(id);

	// 완료 메시지 반환하기
	return res.status(200).json({
		status: 200,
		message: '상품 삭제에 성공했습니다.',
		data
	});
});

export { productRouter };