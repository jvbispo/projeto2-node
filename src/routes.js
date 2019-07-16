import { Router } from 'express';
import UserController from './app/controllers/UserCotroller';
import SessionController from './app/controllers/SessionController';
import authHeader from './app/middlewares/auth';

const routes = new Router();

routes.post('/users', UserController.store);

routes.post('/session', SessionController.store);

routes.use(authHeader);

routes.put('/users', UserController.update);

export default routes;
