import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Pagination } from '../shared/models/pagination';
import { Product } from '../shared/models/product';

@Injectable({
  providedIn: 'root'
})
export class ShopService {

  baseUrl = environment.apiUrl;

  constructor( private http: HttpClient) { }

  getProducts() {
    return this.http.get<Pagination<Product[]>>(this.baseUrl + 'products');
  }
}
