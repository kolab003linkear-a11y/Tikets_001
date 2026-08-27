import { Request, Response } from 'express';
import { ProductCategoryService, ProductService, OrderService } from '../../application/product.service';

const productCategoryService = new ProductCategoryService();
const productService = new ProductService();
const orderService = new OrderService();

export class ProductCategoryController {
  static async getAll(_req: Request, res: Response) {
    try {
      const categories = await productCategoryService.getAll();
      return res.status(200).json(categories);
    } catch (error: any) {
      return res.status(500).json({ message: error.message || 'Error al obtener categorías' });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const { name } = req.body;
      const category = await productCategoryService.create(name);
      return res.status(201).json(category);
    } catch (error: any) {
      return res.status(400).json({ message: error.message || 'Error al crear la categoría' });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name } = req.body;
      const category = await productCategoryService.update(id, name);
      return res.status(200).json(category);
    } catch (error: any) {
      return res.status(400).json({ message: error.message || 'Error al actualizar la categoría' });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await productCategoryService.delete(id);
      return res.status(200).json({ message: 'Categoría eliminada correctamente' });
    } catch (error: any) {
      return res.status(400).json({ message: error.message || 'Error al eliminar la categoría' });
    }
  }
}

export class ProductController {
  static async getAll(req: Request, res: Response) {
    try {
      const { categoryId, type } = req.query;
      const products = await productService.getAll({
        categoryId: categoryId as string | undefined,
        type: type as 'FOOD' | 'MERCHANDISE' | undefined,
      });
      return res.status(200).json(products);
    } catch (error: any) {
      return res.status(500).json({ message: error.message || 'Error al obtener productos' });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const product = await productService.getById(id);
      if (!product) return res.status(404).json({ message: 'Producto no encontrado' });
      return res.status(200).json(product);
    } catch (error: any) {
      return res.status(500).json({ message: error.message || 'Error al obtener el producto' });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const product = await productService.create(req.body);
      return res.status(201).json(product);
    } catch (error: any) {
      return res.status(400).json({ message: error.message || 'Error al crear el producto' });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const product = await productService.update(id, req.body);
      return res.status(200).json(product);
    } catch (error: any) {
      return res.status(400).json({ message: error.message || 'Error al actualizar el producto' });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await productService.delete(id);
      return res.status(200).json({ message: 'Producto eliminado correctamente' });
    } catch (error: any) {
      return res.status(400).json({ message: error.message || 'Error al eliminar el producto' });
    }
  }
}

export class OrderController {
  static async getByUser(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const orders = await orderService.getByUser(userId);
      return res.status(200).json(orders);
    } catch (error: any) {
      return res.status(500).json({ message: error.message || 'Error al obtener los pedidos' });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const order = await orderService.getById(id);
      if (!order) return res.status(404).json({ message: 'Pedido no encontrado' });
      return res.status(200).json(order);
    } catch (error: any) {
      return res.status(500).json({ message: error.message || 'Error al obtener el pedido' });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const order = await orderService.create(req.body);
      return res.status(201).json(order);
    } catch (error: any) {
      return res.status(400).json({ message: error.message || 'Error al crear el pedido' });
    }
  }

  static async updateStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const order = await orderService.updateStatus(id, status);
      return res.status(200).json(order);
    } catch (error: any) {
      return res.status(400).json({ message: error.message || 'Error al actualizar el estado del pedido' });
    }
  }
}
