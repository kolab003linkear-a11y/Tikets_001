import { prisma } from '../infrastructure/db/prisma.client';
import { ProductCategory, Product, Order, OrderProps } from '../domain/product.entity';

export class ProductCategoryService {
  async getAll(): Promise<ProductCategory[]> {
    const categories = await prisma.productCategory.findMany({ orderBy: { name: 'asc' } });
    return categories.map((c) => new ProductCategory(c));
  }

  async create(name: string): Promise<ProductCategory> {
    if (!name) throw new Error('El nombre de la categoría es obligatorio');
    const category = await prisma.productCategory.create({ data: { name } });
    return new ProductCategory(category);
  }

  async update(id: string, name: string): Promise<ProductCategory> {
    const category = await prisma.productCategory.update({ where: { id }, data: { name } });
    return new ProductCategory(category);
  }

  async delete(id: string): Promise<void> {
    await prisma.productCategory.delete({ where: { id } });
  }
}

export class ProductService {
  async getAll(filters?: { categoryId?: string; type?: 'FOOD' | 'MERCHANDISE' }): Promise<Product[]> {
    const products = await prisma.product.findMany({
      where: {
        ...(filters?.categoryId && { categoryId: filters.categoryId }),
        ...(filters?.type && { type: filters.type }),
      },
      include: { category: true },
      orderBy: { name: 'asc' },
    });
    return products.map((p) => new Product(p));
  }

  async getById(id: string): Promise<Product | null> {
    const product = await prisma.product.findUnique({ where: { id }, include: { category: true } });
    if (!product) return null;
    return new Product(product);
  }

  async create(data: {
    name: string;
    description?: string;
    price: number;
    type: 'FOOD' | 'MERCHANDISE';
    imageUrl?: string;
    categoryId: string;
  }): Promise<Product> {
    if (!data.name || !data.categoryId || data.price === undefined) {
      throw new Error('Nombre, precio y categoría del producto son obligatorios');
    }
    if (data.price < 0) {
      throw new Error('El precio no puede ser negativo');
    }

    const product = await prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: Number(data.price),
        type: data.type,
        imageUrl: data.imageUrl,
        categoryId: data.categoryId,
      },
      include: { category: true },
    });

    return new Product(product);
  }

  async update(id: string, data: Partial<{
    name: string;
    description: string;
    price: number;
    type: 'FOOD' | 'MERCHANDISE';
    imageUrl: string;
    categoryId: string;
  }>): Promise<Product> {
    const product = await prisma.product.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.price !== undefined && { price: Number(data.price) }),
        ...(data.type && { type: data.type }),
        ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl }),
        ...(data.categoryId && { categoryId: data.categoryId }),
      },
      include: { category: true },
    });

    return new Product(product);
  }

  async delete(id: string): Promise<void> {
    await prisma.product.delete({ where: { id } });
  }
}

export class OrderService {
  async getByUser(userId: string): Promise<Order[]> {
    const orders = await prisma.order.findMany({
      where: { userId },
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return orders.map((o) => new Order(o));
  }

  async getById(id: string): Promise<Order | null> {
    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: { include: { product: true } } },
    });
    if (!order) return null;
    return new Order(order);
  }

  async create(data: {
    userId: string;
    matchId?: string;
    seatId?: string;
    deliveryMethod: 'SEAT_DELIVERY' | 'PICKUP';
    items: { productId: string; quantity: number }[];
  }): Promise<Order> {
    if (!data.userId || !data.items?.length) {
      throw new Error('Usuario y al menos un producto son obligatorios');
    }
    if (data.deliveryMethod === 'SEAT_DELIVERY' && !data.seatId) {
      throw new Error('Debes indicar el asiento para entrega en sitio');
    }

    const products = await prisma.product.findMany({
      where: { id: { in: data.items.map((i) => i.productId) } },
    });
    if (products.length !== data.items.length) {
      throw new Error('Uno o más productos no existen');
    }

    const priceByProduct = new Map(products.map((p) => [p.id, p.price]));
    let totalAmount = 0;
    for (const item of data.items) {
      if (item.quantity <= 0) throw new Error('La cantidad de cada producto debe ser mayor a 0');
      totalAmount += priceByProduct.get(item.productId)! * item.quantity;
    }

    const order = await prisma.order.create({
      data: {
        userId: data.userId,
        matchId: data.matchId,
        seatId: data.seatId,
        deliveryMethod: data.deliveryMethod,
        totalAmount,
        items: {
          create: data.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: priceByProduct.get(item.productId)!,
          })),
        },
      },
      include: { items: { include: { product: true } } },
    });

    return new Order(order);
  }

  async updateStatus(id: string, status: OrderProps['status']): Promise<Order> {
    const order = await prisma.order.update({
      where: { id },
      data: { status },
      include: { items: { include: { product: true } } },
    });

    return new Order(order);
  }
}
