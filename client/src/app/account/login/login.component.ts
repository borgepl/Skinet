import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../account.service';

import { SocialAuthService } from "@abacritt/angularx-social-login";
import { SocialUser } from "@abacritt/angularx-social-login";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  user?: SocialUser;
  loggedIn: boolean = false;

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
    rememberMe: new FormControl(false)
  });

  returnUrl: string;

  constructor( private accountService: AccountService, private router: Router,
    private authService: SocialAuthService, private activatedRoute: ActivatedRoute) {
      this.returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl'] || '/shop'
    }

  ngOnInit(): void {
    //console.log("test");
  }

  onSubmit() {
    console.log(this.loginForm.value);
    this.accountService.login(this.loginForm.value).subscribe({
      next: () => this.router.navigateByUrl(this.returnUrl)

    });

  }

  loginToGoogle() {
    this.authService.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = (user != null);
      console.log(this.user.name + ' ' + this.user.email + ' - ' + this.loggedIn);

    });
  }

  CallApiGoogle() {
    this.accountService.loginToGoogle();
  }

  toApiGoogle() {
    this.accountService.googlelogin().subscribe({
      next: () => this.router.navigateByUrl('/shop')
    })
  }
}
