import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BasketService } from 'src/app/basket/basket.service';
import { Basket } from 'src/app/shared/models/basket';
import { Address } from 'src/app/shared/models/user';
import { CheckoutService } from '../checkout.service';
import { PaymentIntent, Stripe, StripeCardCvcElement, StripeCardExpiryElement, StripeCardNumberElement, loadStripe } from '@stripe/stripe-js';
import { firstValueFrom } from 'rxjs';
import { OrderToCreate } from 'src/app/shared/models/order';

@Component({
  selector: 'app-checkout-payment',
  templateUrl: './checkout-payment.component.html',
  styleUrls: ['./checkout-payment.component.scss']
})
export class CheckoutPaymentComponent implements OnInit {

  @Input() checkoutForm?: FormGroup;

  @ViewChild('cardNumber') cardNumberElement?: ElementRef;
  @ViewChild('cardExpiry') cardExpiryElement?: ElementRef;
  @ViewChild('cardCvc') cardCvcElement?: ElementRef;

  stripe: Stripe | null = null;
  cardNumber?: StripeCardNumberElement;
  cardExpiry?: StripeCardExpiryElement;
  cardCvc?: StripeCardCvcElement;
  cardErrors: any;
  loading = false;


  constructor( private basketService: BasketService, private checkoutService: CheckoutService,
      private toastr: ToastrService, private router: Router) {}

  ngOnInit(): void {
    loadStripe('pk_test_51KM9FiIWqFO89aiGxR7Y4HNLJcqyxqWxBKcVhorekLkPHK2XwAtQIu5AnfjTic1GbzmeineyscZ3OaVBvW4y2Goo00UATT4h3a')
      .then(stripe => {
        this.stripe = stripe;
        const elements = stripe?.elements();
        if (elements) {
          this.cardNumber = elements.create('cardNumber');
          this.cardNumber.mount(this.cardNumberElement?.nativeElement);
          this.cardNumber.on('change', event => {
            if (event.error) this.cardErrors = event.error.message;
            else this.cardErrors = null;
          })

          this.cardExpiry = elements.create('cardExpiry');
          this.cardExpiry.mount(this.cardExpiryElement?.nativeElement);
          this.cardExpiry.on('change', event => {
            if (event.error) this.cardErrors = event.error.message;
            else this.cardErrors = null;
          })

          this.cardCvc = elements.create('cardCvc');
          this.cardCvc.mount(this.cardCvcElement?.nativeElement);
          this.cardCvc.on('change', event => {
            if (event.error) this.cardErrors = event.error.message;
            else this.cardErrors = null;
          })
        }
      })
  }

  async submitOrder() {

    this.loading = true;
    const basket = this.basketService.getCurrentBasketValue();
    try {
      const createdOrder = await this.createOrder(basket);
      const paymentResult = await this.confirmPaymentWithStripe(basket);
      if (paymentResult.paymentIntent) {
        this.basketService.deleteLocalBasket();
        const navigationExtras: NavigationExtras = {state: createdOrder};
        this.router.navigate(['checkout/success'], navigationExtras);
      } else {
        this.toastr.error(paymentResult.error.message);
      }
    } catch (error: any) {
      console.log(error);
      this.toastr.error(error.message);
    } finally {
      this.loading = false;
    }

  }


  private async confirmPaymentWithStripe(basket: Basket | null) {
    if (!basket) throw new Error('Baskeet is null!');
    const result =  this.stripe?.confirmCardPayment(basket.clientSecret!, {
      payment_method : {
        card: this.cardNumber!,
        billing_details: {
          name: this.checkoutForm?.get('paymentForm')?.get('nameOnCard')?.value
        }
      }
    });
    if (!result) throw new Error('Problem attempting payment with stripe');
    return result;

  }

  private async createOrder(basket: Basket | null) {
    if (!basket) throw new Error('Baskeet is null!');
    const orderToCreate = this.getOrderToCreate(basket);
    return firstValueFrom(this.checkoutService.createOrder(orderToCreate));
  }

  private getOrderToCreate(basket: Basket) : OrderToCreate {
    const deliveryMethodId = this.checkoutForm?.get('deliveryForm')?.get('deliveryMethod')?.value;
    const shipToAddress = this.checkoutForm?.get('addressForm')?.value as Address;
    if (!deliveryMethodId || !shipToAddress) throw new Error('Problem with basket');
    return {
      basketId: basket.id,
      deliveryMethodId: deliveryMethodId,
      shipToAddress: shipToAddress
    }
  }

   async submitOrderBancontact() {

    this.loading = true;
    const basket = this.basketService.getCurrentBasketValue();
    try {
      const createdOrder = await this.createOrder(basket);
      const paymentResult = await this.confirmBancontactPaymentWithStripe(basket);
      if (paymentResult.paymentIntent) {
        if (paymentResult.paymentIntent.status == 'succeeded') {
          this.basketService.deleteLocalBasket();
          const navigationExtras: NavigationExtras = {state: createdOrder};
          this.router.navigate(['checkout/success'], navigationExtras);
        }
      } else {
        this.toastr.error(paymentResult.error.message);
      }
    } catch (error: any) {
      console.log(error);
      this.toastr.error(error.message);
    } finally {
      this.loading = false;
    }

  }
  private async confirmBancontactPaymentWithStripe(basket: Basket | null) {
    if (!basket) throw new Error('Basket is null!');
    const paymentIntent = await this.stripe?.retrievePaymentIntent(basket.clientSecret!)
    if (paymentIntent?.paymentIntent?.status == 'requires_action'
      && paymentIntent.paymentIntent.next_action?.redirect_to_url)
    {
      console.log(paymentIntent);

    }

    const result =  this.stripe?.confirmBancontactPayment(basket.clientSecret!, {
      payment_method : {
        billing_details: {
          name: this.checkoutForm?.get('paymentForm')?.get('nameOnCard')?.value
        }
      },
      return_url: 'https://localhost:4200/checkout/success'
    });
    if (!result) throw new Error('Problem attempting payment with stripe');
    return result;
  }

}
