import connection from '../database';
import { v4 as uuid } from 'uuid';
import { Encrypt } from '../tools/crypto';
import { CollectionServices, iCollection } from './Collection';
import jwt from '../middlewares/auth';

interface iUser {
  id?: string;
  username: string;
  email?: string;
  picture?: string;
  defaultCollection?: string;
  password: string;
  created_at?: Date;
  updated_at?: Date;
}

class UserService {
  async create_user(data: iUser) {
    const { username, email, password: pwd }: iUser = data;
    const id = uuid();
    const cript = new Encrypt();
    return new Promise(async (resolve, reject) => {
      try {
        const user = await connection('users')
          .select('*')
          .where('email', email)
          .orWhere('username', username)
          .first()
          .then((response) => {
            return response;
          });
        if (user) {
          reject({ msg: 'usuário já cadastrado' });
          throw new Error('Invalid user');
        }
        const password: string = await cript
          .cript(pwd)
          .then((response) => response);

        await connection('users')
          .insert({
            id,
            username,
            email,
            password,
          })
          .then(async (response) => {
            const cservices = new CollectionServices(id);
            const defaultCollection = await cservices.createDefault();
            await connection('users')
              .update({
                defaultCollection: defaultCollection.id,
              })
              .where({ id });
            const collections = await cservices.getAllCollections();
            resolve({
              id,
              username,
              email,
              collections,
            });
          });
      } catch (err) {
        reject(err);
      }
    });
  }

  async list_users(): Promise<Array<iUser>> {
    return new Promise(async (resolve, reject) => {
      await connection('users')
        .select('id', ' username', ' email', ' created_at', ' updated_at')
        .then((response: Array<iUser>) => {
          resolve(response);
        })
        .catch((err) => {
          console.log(err);
          reject(err);
        });
    });
  }
  async update_user(data: iUser) {
    const cript = new Encrypt();

    let { id, username, email, password }: iUser = data;
    if (password)
      password = await cript.cript(password).then((response) => response);

    const updated_at = new Date().toISOString();
    return new Promise(async (resolve, reject) => {
      await connection('users')
        .update({ username, email, password, updated_at })
        .where('id', id)
        .then(async (response) => {
          const user = await this.findUserById(String(id)).then(
            (response) => response,
          );
          resolve(user);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  async login_email(email: string, password: string) {
    return new Promise(async (resolve, reject) => {
      const { compare } = new Encrypt();
      try {
        const user = await connection('users')
          .select('*')
          .where('email', email)
          .first()
          .then((response) => {
            return response;
          })
          .catch((err) => {
            return false;
          });
        const isValid: boolean = await compare(password, user.password).then(
          (response) => response,
        );
        if (!user || user.email !== email || !isValid) {
          reject('Invalid email or password');
        }
        let token = jwt.signin(user.id);
        resolve({
          id: user.id,
          token,
        });
      } catch (e) {
        reject(e);
      }
    });
  }
  async login_username(username: string, password: string) {
    return new Promise(async (resolve, reject) => {
      const { compare } = new Encrypt();
      try {
        const user = await connection('users')
          .select('*')
          .where('username', username)
          .first()
          .then((response) => {
            return response;
          })
          .catch((err) => {
            return false;
          });
        const isValid: boolean = await compare(password, user.password).then(
          (response) => response,
        );
        if (!user || user.username !== username || !isValid) {
          reject('Invalid username or password');
        }
        let token = jwt.signin(user.id);
        resolve({
          id: user.id,
          token,
        });
      } catch (e) {
        reject(e);
      }
    });
  }
  async delete_user(id: string) {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await connection('users')
          .where('id', id)
          .delete()
          .then((response) => {
            resolve('');
          })
          .catch((error) => {
            reject({
              error,
            });
          });
      } catch (e) {
        reject(e);
      }
    });
  }

  async findUserByEmail(email: string) {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await connection('users')
          .select('id', ' username', ' email', ' created_at', ' updated_at')
          .where('email', email)
          .first()
          .then((response) => {
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      } catch (err) {
        reject(err);
      }
    });
  }
  async findUserById(id: string) {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await connection('users')
          .select('id', ' username', ' email', ' created_at', ' updated_at')
          .where('id', id)
          .first()
          .then((response) => {
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      } catch (err) {
        reject(err);
      }
    });
  }
  async listCollections(id: string): Promise<iCollection[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await connection('users')
          .select('id', ' username', ' email', ' created_at', ' updated_at')
          .where('id', id)
          .first()
          .then(async (response) => {
            const cservices = new CollectionServices(response.id);
            const collections = await cservices.getAllCollections();
            resolve(collections);
          })
          .catch((error) => {
            reject(error);
          });
      } catch (err) {
        reject(err);
      }
    });
  }
}

export { UserService, iUser };
