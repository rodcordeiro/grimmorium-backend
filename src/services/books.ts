import connection from '../database';
import { v4 as uuid } from 'uuid';

interface iBook {
  id: string;
  title: string;
  author?: string;
  serie?: string;
  serieOrder?: string;
  created_at?: Date;
  updated_at?: Date;
}

class BookService {
  async list_book(): Promise<Array<iBook>> {
    return new Promise(async (resolve, reject) => {
      await connection('books')
        .select('*')
        .orderBy('serie', 'asc')
        .orderBy('serieOrder', 'asc')
        .then((response: Array<iBook>) => {
          resolve(response);
        })
        .catch((err) => {
          console.log(err);
          reject(err);
        });
    });
  }
  async create_book(data: iBook) {
    return new Promise(async (resolve, reject) => {
      const id = uuid();
      const { title, author, serie, serieOrder } = data;
      await connection('books')
        .insert({
          id,
          title,
          author,
          serie,
          serieOrder,
        })
        .then((response) => {
          resolve({
            id,
            title,
            author,
          });
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  async getBook(id: string) {
    return new Promise(async (resolve, reject) => {
      const book = await connection('books')
        .select('*')
        .where('id', id)
        .first()
        .then((response) => {
          if (response) resolve(response);
          reject('Livro não encontrado');
        })
        .catch((err) => reject(err));
    });
  }
  async delete(id: string) {
    return new Promise(async (resolve, reject) => {
      const book = await connection('books')
        .where('id', id)
        .first()
        .delete()
        .then((response) => {
          if (response !== 0) resolve('');
          reject('Livro não encontrado');
        })
        .catch((err) => reject(err));
    });
  }
  async update(data: iBook) {
    return new Promise(async (resolve, reject) => {
      let { id, title, author, serie, serieOrder }: iBook = data;
      const updated_at = new Date().toISOString();
      await connection('books')
        .update({ title, author, serie, serieOrder, updated_at })
        .where('id', id)
        .then((response) => {
          resolve(response);
        })
        .catch((err) => reject(err));
    });
  }
}

export { BookService, iBook };
