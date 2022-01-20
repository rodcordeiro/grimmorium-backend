import { Request, Response } from 'express';
import { iCollection, CollectionServices } from '../services/Collection';

class CollectionController {
  async getCollections(req: Request, res: Response) {
    const id = req.headers.id;
    const services = new CollectionServices(String(id));
    await services
      .getAllCollections()
      .then((response: iCollection[]) => {
        return res.status(200).json(response);
      })
      .catch((err) => {
        return res.status(400).json([err]);
      });
  }
  async create(req: Request, res: Response) {
    const id = req.headers.id;
    const { name } = req.body;
    const services = new CollectionServices(String(id));
    await services
      .create(name)
      .then((response: iCollection) => {
        return res.status(201).json(response);
      })
      .catch((err) => {
        return res.status(400).json([err]);
      });
  }
  async update(req: Request, res: Response) {
    const userId = req.headers.id;
    const { id } = req.params;
    const collection = req.body;
    const services = new CollectionServices(String(userId));
    await services
      .update({ id, ...collection })
      .then((response: iCollection) => {
        return res.status(200).json(response);
      })
      .catch((err) => {
        return res.status(400).json(err);
      });
  }
  async delete(req: Request, res: Response) {
    const userId = req.headers.id;
    const { id } = req.params;
    const services = new CollectionServices(String(userId));
    await services
      .delete(id)
      .then((response: unknown) => {
        return res.status(204).json();
      })
      .catch((err) => {
        return res.status(400).json(err);
      });
  }
  async share(req: Request, res: Response) {
    const userID = req.headers.id;
    const data = req.body;
    const services = new CollectionServices(String(userID));
    await services
      .share(data)
      .then((response: any) => {
        return res.status(204).json();
      })
      .catch((err: any) => {
        return res.status(400).json(err);
      });
  }
}

export { CollectionController };
