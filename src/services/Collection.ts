import connection from '../database';
import { v4 as uuid } from 'uuid';

interface iCollection {
  id?: string;
  name: string;
  owner?: string;
  created_at?: Date;
  updated_at?: Date;
}

class CollectionServices {
  public userId: string;

  constructor(owner: string) {
    if (!owner) {
      throw new Error('Empty owner not allowed.');
    }
    this.userId = owner;
  }
  async createDefault(): Promise<iCollection> {
    return new Promise(async (resolve, reject) => {
      try {
        const id = uuid();
        const owner = this.userId;
        await connection('collection')
          .insert({
            id,
            owner,
            name: 'Todos os livros',
          })
          .then(async (response) => {
            await this.givePermission(id, true)
              .then((response) => resolve({ name: 'Todos os livros', id }))
              .catch((error) => reject(error));
          })
          .catch((error) => resolve(error));
      } catch (err) {
        reject(err);
      }
    });
  }

  async create(name: string): Promise<iCollection> {
    return new Promise(async (resolve, reject) => {
      try {
        const id = uuid();
        const owner = this.userId;
        await connection('collection')
          .insert({
            id,
            owner,
            name,
          })
          .then(async (response) => {
            await this.givePermission(id, true)
              .then((response) => resolve({ name, id }))
              .catch((error) => reject(error));
          })
          .catch((error) => resolve(error));
      } catch (err) {
        reject(err);
      }
    });
  }
  async givePermission(
    collection: string,
    editPermissions: boolean,
    owner?: string,
  ) {
    return new Promise(async (resolve, reject) => {
      try {
        const user = owner ? owner : this.userId;
        await connection('accessControl')
          .insert({
            collection,
            user,
            editPermissions,
          })
          .then((response) => resolve(response))
          .catch((error) => {
            console.log(error);
            reject(error);
          });
      } catch (err) {
        reject(err);
      }
    });
  }
  async getAllCollections(): Promise<iCollection[]> {
    return new Promise(async (resolve, reject) => {
      try {
        await connection('accessControl')
          .select(
            'collection.id',
            'collection.name',
            'accessControl.editPermissions',
            'collection.created_at',
            'collection.updated_at',
          )
          .where({
            user: this.userId,
          })
          .join('collection', 'accessControl.collection', '=', 'collection.id')
          .then((response) => resolve(response))
          .catch((error) => {
            console.log(error);
            reject(error);
          });
      } catch (err) {
        reject(err);
      }
    });
  }
}

export { iCollection, CollectionServices };
