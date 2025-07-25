import { IPaymentMethod } from "../../../types/types.ts";

export interface ICreateOrderDto {
  address: string;
  phone: string;
  note?: string;
  couponCode?: string;
  paymentMethod: IPaymentMethod;
  discount: number;
}
