import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterState } from '@angular/router';
import { Order } from 'src/app/shared/models/order';
import { BreadcrumbService } from 'xng-breadcrumb';
import { OrderService } from '../order.service';

@Component({
  selector: 'app-order-detailed',
  templateUrl: './order-detailed.component.html',
  styleUrls: ['./order-detailed.component.scss']
})
export class OrderDetailedComponent implements OnInit {

  order?: Order;

  constructor( private orderService: OrderService, private route: ActivatedRoute, private bcService: BreadcrumbService) {}

  ngOnInit(): void {
    this.getOrderDetailed();
  }


  getOrderDetailed() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.orderService.getOrder(+id).subscribe({
      next: order =>{
        this.order = order;
        this.bcService.set('@OrderDetailed', `Order# ${order.id} - ${order.orderStatus}`);
      }
    })
  }
}
