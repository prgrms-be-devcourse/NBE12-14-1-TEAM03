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

export interface RsData<T> {
  resultCode: string;
  msg: string;
  data: T;
}
