import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BasketService } from 'src/app/basket/basket.service';
import { deliveryMethod } from 'src/app/shared/models/deliveryMethod';
import { CheckoutService } from '../checkout.service';

@Component({
  selector: 'app-checkout-delivery',
  templateUrl: './checkout-delivery.component.html',
  styleUrls: ['./checkout-delivery.component.scss']
})
export class CheckoutDeliveryComponent implements OnInit {

  @Input() checkoutForm?: FormGroup;
  deliveryMethods: deliveryMethod[] = [];

  constructor( private checkoutService: CheckoutService, private basketService: BasketService) {}


  ngOnInit(): void {
     this.checkoutService.getDeliveryMethods().subscribe({
      next: dm => this.deliveryMethods = dm
    });
  }

  setShipping(deliveryMethod: deliveryMethod) {
    this.basketService.setShippingPrice(deliveryMethod);
  }


}
