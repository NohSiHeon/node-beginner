import express from 'express';
import { SERVER_PORT } from './constants/env.constant.js';
import { productRouter } from './routers/products.router.js';
import { connect } from './schemas/index.js';

connect();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', productRouter);

app.listen(SERVER_PORT, () => {
	console.log(`Server is listening on ${SERVER_PORT}`);
});