export interface OrderItemResponse {
  productId: number;
  productName: string;
  photoUrl?: string;
  orderPrice: number;
  quantity: number;
  totalPrice: number;
}

export interface OrderResultResponse {
  id: number;
  createDate: string;
  modifyDate?: string;
  email: string;
  shippingAddress: string;
  zipCode: string;
  totalPrice: number;
  shippingDate: string;
  orderItemList: OrderItemResponse[];
}

export interface OrderModifyItemRequest {
  productId: number;
  quantity: number;
}

export interface OrderModifyRequest {
  shippingAddress: string;
  zipCode: string;
  orderItemList: OrderModifyItemRequest[];
}

export interface ProductResponse {
  id: number;
  name: string;
  category?: string;
  price: number;
  photoUrl?: string;
}

export interface OrderCreateItemRequest {
  productId: number;
  quantity: number;
}

export interface OrderCreateRequest {
  email: string;
  items: OrderCreateItemRequest[];
  shippingAddress: string;
  zipCode: string;
}

export interface OrderCreateResponse {
  orderId: number;
  email: string;
  totalPrice: number;
  shippingDate: string;
}

export interface RsData<T> {
  resultCode: string;
  msg: string;
  data: T;
}

export interface MergedItem {
  productId: number;
  productName: string;
  photoUrl: string;
  quantity: number;
  totalPrice: number;
}

export interface MergedShipment {
  email: string;
  shippingDate: string;
  shippingAddress: string;
  zipCode: string;
  orderCount: number;
  mergedOrderIds: number[];
  totalPrice: number;
  orderItemList: MergedItem[];
}