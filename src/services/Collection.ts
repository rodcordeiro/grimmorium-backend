import connection from '../database';
import { v4 as uuid } from 'uuid';
import { iUser, UserService } from './User';

interface iCollection {
  id?: string;
  name: string;
  owner?: string;
  created_at?: Date;
  updated_at?: Date;
}

interface iCollectionAccess {
  collection: string;
  user?: string;
  editPermissions: boolean;
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
        const access = await connection('accessControl')
          .select('*')
          .where({
            collection,
            user,
          })
          .first();

        if (access) {
          reject('User already have access');
          return;
        }
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

  async hasPermission(
    collection: string,
    owner?: string,
  ): Promise<iCollectionAccess> {
    return new Promise(async (resolve, reject) => {
      try {
        const user = owner ? owner : this.userId;
        // console.log('CollectionServices/hasPermission->data', {
        //   collection,
        //   user,
        // });

        const access = await connection('accessControl')
          .select('*')
          .where({
            collection,
            user,
          })
          .first();
        // console.log('CollectionServices/hasPermission->access', access);

        if (!access) {
          reject('');
          return;
        }
        resolve(access);
      } catch (err) {
        reject(err);
      }
    });
  }
  async removePermission(collection: string, owner?: string) {
    return new Promise(async (resolve, reject) => {
      try {
        const user = owner ? owner : this.userId;
        const access = await connection('accessControl')
          .select('*')
          .where({
            collection,
            user,
          })
          .first();
        if (!access) {
          reject("User doesn't have access");
          return;
        }
        await connection('accessControl')
          .where({
            collection,
            user,
          })
          .first()
          .delete()
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
            'users.username',
            'users.picture',
          )
          .where({
            user: this.userId,
          })
          .join('collection', 'accessControl.collection', '=', 'collection.id')
          .join('users', 'users.id', '=', 'collection.owner')
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
  async update(data: iCollection): Promise<iCollection> {
    return new Promise(async (resolve, reject) => {
      // console.log('CollectionServices/update->data', data);
      try {
        const collection = await connection('collection')
          .select('*')
          .where('id', data.id)
          .first();
        if (!collection) {
          reject('Collection not found');
        }
        // console.log('CollectionServices/update->collection', collection);
        const perm = await this.hasPermission(String(data.id), data.owner);
        if (!perm || !Boolean(perm.editPermissions)) {
          reject("Doesn't have access");
        }
        // console.log('CollectionServices/update->perm', perm);
        await connection('collection')
          .update(data)
          .where('id', data.id)
          .then(async (response) => {
            const value = await connection('collection')
              .select('*')
              .where('id', data.id)
              .first();
            resolve(value);
          })
          .catch((err) => {
            // console.log('CollectionServices/update->updateErr', err);
            reject(err);
          });
      } catch (err) {
        console.log('CollectionServices/update->err', err);
        reject(err);
      }
    });
  }
  async delete(id: string) {
    return new Promise(async (resolve, reject) => {
      try {
        const collection = await connection('collection')
          .select('*')
          .where({ id })
          .first();
        if (!collection) {
          reject('Collection not found');
        }
        await connection('collection')
          .where({ id })
          .first()
          .delete()
          .then(async (response) => {
            this.removePermission(id);
            resolve(response);
          })
          .catch((err) => reject(err));
      } catch (err) {
        reject(err);
      }
    });
  }
  async share(data: {
    collection: string;
    editPermissions: boolean;
    user: string;
  }) {
    return new Promise(async (resolve, reject) => {
      try {
        const collection = await connection('collection')
          .select('*')
          .where('id', data.collection)
          .first();
        if (!collection) {
          reject('Collection not found');
          return;
        }
        const userService = new UserService();

        const user = userService.findUserById(data.user);
        if (!user) {
          reject('Invalid user');
          return;
        }
        this.givePermission(data.collection, data.editPermissions, data.user)
          .then((response) => {
            resolve(response);
          })
          .catch((err) => {
            reject(err);
          });
      } catch (err) {
        reject(err);
      }
    });
  }
}

export { iCollection, CollectionServices };
