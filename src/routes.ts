import auth from './middlewares/auth';
import validations from './middlewares/validations';
import { Router } from 'express';
import { UserController } from './controllers/User';
import { BookController } from './controllers/books';
import { CollectionController } from './controllers/Collection';
const routes = Router();

const users = new UserController();
const books = new BookController();
const collections = new CollectionController();

const { validateBase64Data, validateParams } = validations;
const { isAuthenticated } = auth;
routes.get('/', (req, res) => {
  return res.status(200).send();
});

//User
routes.get('/users', users.index);
routes.post(
  '/users',
  isAuthenticated,
  [validateBase64Data],
  validateParams,
  users.create,
);
routes.put('/users', isAuthenticated, users.update);
routes.put('/users/:id', isAuthenticated, users.update);
routes.delete('/users/:id', isAuthenticated, users.delete);
routes.post('/auth', [validateBase64Data], validateParams, users.login);

//collections
routes.get('/collections', isAuthenticated, collections.getCollections);
routes.post('/collections', isAuthenticated, collections.create);

//Books
routes.get('/books', books.index);
routes.post('/books', isAuthenticated, books.create);
routes.get('/books/:id', books.getBook);
routes.put('/books/:id', isAuthenticated, books.update);
routes.delete('/books/:id', isAuthenticated, books.delete);

export default routes;
