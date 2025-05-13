import { HttpStatus, Injectable } from '@nestjs/common';
import { envs } from 'src/config/envs';
import Stripe from 'stripe';
import { PaymentSessionDto } from './dto/payment-session.dto';
import { Request, Response } from 'express';

@Injectable()
export class PaymentsService {
  private readonly stripe = new Stripe(envs.stripeSecretKey);

  async createPaymentSession(paymentSessionDto: PaymentSessionDto) {
    const { items, currency, orderId } = paymentSessionDto;

    const session = await this.stripe.checkout.sessions.create({
      payment_intent_data: {
        metadata: {
          orderId,
        },
      },
      line_items: items.map((item) => ({
        price_data: {
          currency: currency,
          product_data: {
            name: item.name,
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: envs.successUrl,
      cancel_url: envs.cancelUrl,
    });

    return session;
  }

  stripeWebhook(request: Request, response: Response) {
    const signature = request.headers['stripe-signature'];

    let event: Stripe.Event;

    try {
      if (!signature)
        return response.status(HttpStatus.BAD_REQUEST).json({
          message: 'Something went wrong with stripe signature',
        });

      event = this.stripe.webhooks.constructEvent(
        request['rawBody'],
        signature,
        envs.stripeSigningSecret,
      );
    } catch (err) {
      console.log(err);
      return response
        .status(HttpStatus.BAD_REQUEST)
        .send(`Webhook Error: ${(err as Error).message}`);
    }

    switch (event.type) {
      case 'charge.succeeded':
        console.log({ event });
        console.log({ metadata: event.data.object.metadata });
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    response.status(HttpStatus.ACCEPTED).json(signature);
  }
}

// line_items: [
//   {
//     price_data: {
//       currency: 'usd',
//       product_data: {
//         name: 'T-Shirt',
//       },
//       unit_amount: 2000,
//     },
//     quantity: 2,
//   },
// ],
