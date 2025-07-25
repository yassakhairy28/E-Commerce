import Stripe from "stripe";
import { config } from "dotenv";
import { Request } from "express";
import { ApiError } from "../../middlewares/error.handler.middleware.ts";
import DatabaseServices from "../../DB/DBservices.ts";
import { IOrder, IOrderStatus } from "../../types/types.ts";
import orderModel from "../../DB/models/order.model.ts";
import { decrypt, encrypt } from "../encryption/encryption.ts";

config({ path: "../../config/.env" });
export class PaymentService {
  private stripe: Stripe;
  private Order = new DatabaseServices<IOrder>(orderModel);

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
  }

  async checkOutSession({
    customer_email,
    mode = "payment",
    cancel_url = process.env.CANCEL_URL,
    success_url = process.env.SUCCESS_URL,
    metadata = {},
    line_items,
    discounts = [],
  }: Stripe.Checkout.SessionCreateParams): Promise<
    Stripe.Response<Stripe.Checkout.Session>
  > {
    const session = await this.stripe.checkout.sessions.create({
      customer_email,
      mode,
      cancel_url,
      success_url,
      metadata,
      line_items,
      discounts,
    });

    if (!session) throw new ApiError("Failed to create checkout session", 400);

    return session;
  }

  async webhook(req: Request) {
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET as string;
    let event = req.body;

    const signature: any = req.headers["stripe-signature"];

    event = this.stripe.webhooks.constructEvent(
      req.body,
      signature,
      endpointSecret
    );

    // if (event.Type !== "checkout.session.completed") {
    //   throw new ApiError("Fail to Pay", 400);
    // }

    const intentId = encrypt({
      payload: event.data.object["payment_intent"],
      signature: process.env.INTENT_ID as string,
    });

    const orderId = event.data.object["metadata"].orderId;
    await this.Order.updateOne({
      filter: { _id: orderId, status: IOrderStatus.panding },
      data: {
        status: IOrderStatus.placed,
        paidAt: Date.now(),
        intentId,
      },
    });
  }

  async refund(id: string): Promise<Stripe.Response<Stripe.Refund>> {
    const intentId = decrypt({
      payload: id,
      signature: process.env.INTENT_ID as string,
    });
    const refund = await this.stripe.refunds.create({
      payment_intent: intentId,
    });
    return refund;
  }
}
