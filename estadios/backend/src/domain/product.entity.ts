export type ProductType = 'FOOD' | 'MERCHANDISE';
export type OrderStatus = 'PENDING' | 'IN_PREPARATION' | 'ON_THE_WAY' | 'DELIVERED' | 'CANCELED';
export type DeliveryMethod = 'SEAT_DELIVERY' | 'PICKUP';

export interface ProductCategoryProps {
  id?: string;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class ProductCategory {
  public id?: string;
  public name: string;
  public createdAt?: Date;
  public updatedAt?: Date;

  constructor(props: ProductCategoryProps) {
    this.id = props.id;
    this.name = props.name;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}

export interface ProductProps {
  id?: string;
  name: string;
  description?: string;
  price: number;
  type: ProductType;
  imageUrl?: string;
  categoryId: string;
  category?: { id?: string; name: string };
  createdAt?: Date;
  updatedAt?: Date;
}

export class Product {
  public id?: string;
  public name: string;
  public description?: string;
  public price: number;
  public type: ProductType;
  public imageUrl?: string;
  public categoryId: string;
  public category?: { id?: string; name: string };
  public createdAt?: Date;
  public updatedAt?: Date;

  constructor(props: ProductProps) {
    this.id = props.id;
    this.name = props.name;
    this.description = props.description;
    this.price = props.price;
    this.type = props.type;
    this.imageUrl = props.imageUrl;
    this.categoryId = props.categoryId;
    this.category = props.category;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}

export interface OrderItemProps {
  id?: string;
  orderId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  product?: { id?: string; name: string };
}

export class OrderItem {
  public id?: string;
  public orderId: string;
  public productId: string;
  public quantity: number;
  public unitPrice: number;
  public product?: { id?: string; name: string };

  constructor(props: OrderItemProps) {
    this.id = props.id;
    this.orderId = props.orderId;
    this.productId = props.productId;
    this.quantity = props.quantity;
    this.unitPrice = props.unitPrice;
    this.product = props.product;
  }
}

export interface OrderProps {
  id?: string;
  userId: string;
  matchId?: string;
  seatId?: string;
  deliveryMethod: DeliveryMethod;
  status?: OrderStatus;
  totalAmount: number;
  items?: OrderItem[];
  createdAt?: Date;
}

export class Order {
  public id?: string;
  public userId: string;
  public matchId?: string;
  public seatId?: string;
  public deliveryMethod: DeliveryMethod;
  public status: OrderStatus;
  public totalAmount: number;
  public items?: OrderItem[];
  public createdAt?: Date;

  constructor(props: OrderProps) {
    this.id = props.id;
    this.userId = props.userId;
    this.matchId = props.matchId;
    this.seatId = props.seatId;
    this.deliveryMethod = props.deliveryMethod;
    this.status = props.status ?? 'PENDING';
    this.totalAmount = props.totalAmount;
    this.items = props.items;
    this.createdAt = props.createdAt;
  }
}
