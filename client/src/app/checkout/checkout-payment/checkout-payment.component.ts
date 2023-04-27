import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BasketService } from 'src/app/basket/basket.service';
import { Basket } from 'src/app/shared/models/basket';
import { Address } from 'src/app/shared/models/user';
import { CheckoutService } from '../checkout.service';
import { Stripe, StripeCardCvcElement, StripeCardExpiryElement, StripeCardNumberElement, loadStripe } from '@stripe/stripe-js';

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

  submitOrder() {
    const basket = this.basketService.getCurrentBasketValue();
    if (!basket) return;
    const orderToCreate = this.getOrderToCreate(basket);
    if (!orderToCreate) return;
    this.checkoutService.createOrder(orderToCreate).subscribe({
      next: order => {
        this.toastr.success("Order created successfully");

        this.stripe?.confirmCardPayment(basket.clientSecret!, {
          payment_method : {
            card: this.cardNumber!,
            billing_details: {
              name: this.checkoutForm?.get('paymentForm')?.get('nameOnCard')?.value
            }
          }
        }).then(result => {
          console.log(result);
          if (result.paymentIntent) {

            this.basketService.deleteLocalBasket();
            console.log(order);
            const navigationExtras: NavigationExtras = {state: order};
            this.router.navigate(['checkout/success'], navigationExtras);
          }
          else {
            this.toastr.error(result.error.message);
          }
        })
      }
    })
  }

  private getOrderToCreate(basket: Basket) {
    const deliveryMethodId = this.checkoutForm?.get('deliveryForm')?.get('deliveryMethod')?.value;
    const shipToAddress = this.checkoutForm?.get('addressForm')?.value as Address;
    if (!deliveryMethodId || !shipToAddress) return;
    return {
      basketId: basket.id,
      deliveryMethodId: deliveryMethodId,
      shipToAddress: shipToAddress
    }
  }

  submitOrderBancontact() {
    const basket = this.basketService.getCurrentBasketValue();
    if (!basket) return;
    const orderToCreate = this.getOrderToCreate(basket);
    if (!orderToCreate) return;
    this.checkoutService.createOrder(orderToCreate).subscribe({
      next: order => {
        this.toastr.success("Order created successfully");

        this.stripe?.confirmBancontactPayment(basket.clientSecret!, {
          payment_method : {
            billing_details: {
              name: this.checkoutForm?.get('paymentForm')?.get('nameOnCard')?.value
            }
          },
          return_url: 'https://localhost:4200/checkout'
        }).then(result => {
          console.log(result);
          if (result.paymentIntent?.status === 'succeeded') {

            this.basketService.deleteLocalBasket();
            console.log(order);
            const navigationExtras: NavigationExtras = {state: order};
            this.router.navigate(['checkout/success'], navigationExtras);
          }
        })
      }
    })
  }

}
