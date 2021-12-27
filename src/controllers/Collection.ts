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
}

export { CollectionController };
