import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Skinet';
  products: any[] = [];

  constructor( private http: HttpClient ) {}

  ngOnInit(): void {
    this.http.get('https://localhost:5001/api/products?Pagesize=50').subscribe({
      next: (response: any) => this.products = response.data,
      error: error => console.log(error)
    });
  }


}
