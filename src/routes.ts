import auth from './middlewares/auth';
import validations from './middlewares/validations';
import { Router } from 'express';
import { UserController } from './controllers/User';
import { BookController } from './controllers/books';

const routes = Router();

const users = new UserController();
const books = new BookController();

routes.get('/', (req, res) => {
  return res.status(200).send();
});

//User
routes.get('/users', users.index);
routes.post(
  '/users/create',
  auth.isAuthenticated,
  [validations.validateBase64Data],
  validations.validateParams,
  users.create,
);
routes.put('/users/update', auth.isAuthenticated, users.update);
routes.put('/users/update/:id', auth.isAuthenticated, users.update);
routes.delete('/users/delete/:id', auth.isAuthenticated, users.delete);
routes.post(
  '/auth',
  [validations.validateBase64Data],
  validations.validateParams,
  users.login,
);

//Books
routes.get('/books', books.index);
routes.post('/books', auth.isAuthenticated, books.create);
routes.get('/books/:id', books.getBook);
routes.put('/books/:id', auth.isAuthenticated, books.update);
routes.delete('/books/:id', auth.isAuthenticated, books.delete);

export default routes;
