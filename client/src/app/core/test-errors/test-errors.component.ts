import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-test-errors',
  templateUrl: './test-errors.component.html',
  styleUrls: ['./test-errors.component.css']
})
export class TestErrorsComponent implements OnInit {

  baseUrl = environment.apiUrl;
  validationErrors: string[] = [];

  constructor( private http: HttpClient) { }

  ngOnInit(): void {

  }

  get404error() {
    this.http.get(this.baseUrl + 'buggy/notfound').subscribe(
      {
        next: response => console.log(response),
        error: error => console.log(error)
      }
      )
  }

  get400error() {
    this.http.get(this.baseUrl + 'buggy/badrequest').subscribe(
      {
        next: response => console.log(response),
        error: error => console.log(error)
      }
      )
  }

  get500error() {
    this.http.get(this.baseUrl + 'buggy/servererror').subscribe(
      {
        next: response => console.log(response),
        error: error => console.log(error)
      }
      )
  }

  get401error() {
    this.http.get(this.baseUrl + 'buggy/auth').subscribe(
      {
        next: response => console.log(response),
        error: error => console.log(error)
      }
      )
  }

  get400ValidationError() {
    this.http.post(this.baseUrl + 'products/two', {}).subscribe(
      {
        next: response => console.log(response),
        error: error => {
          console.log(error);
          this.validationErrors = error;
          }
      }
      )
  }

}
