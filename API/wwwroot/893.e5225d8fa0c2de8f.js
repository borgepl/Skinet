"use strict";(self.webpackChunkclient=self.webpackChunkclient||[]).push([[893],{5893:(H,I,u)=>{u.r(I),u.d(I,{AccountModule:()=>m});var O=u(6895),c=u(433),t=u(1571),y=u(740),g=u(9838),T=u(5861),k=u(1135),b=u(7579),N=u(6063);class z extends b.x{constructor(s=1/0,e=1/0,o=N.l){super(),this._bufferSize=s,this._windowTime=e,this._timestampProvider=o,this._buffer=[],this._infiniteTimeWindow=!0,this._infiniteTimeWindow=e===1/0,this._bufferSize=Math.max(1,s),this._windowTime=Math.max(1,e)}next(s){const{isStopped:e,_buffer:o,_infiniteTimeWindow:n,_timestampProvider:r,_windowTime:a}=this;e||(o.push(s),!n&&o.push(r.now()+a)),this._trimBuffer(),super.next(s)}_subscribe(s){this._throwIfClosed(),this._trimBuffer();const e=this._innerSubscribe(s),{_infiniteTimeWindow:o,_buffer:n}=this,r=n.slice();for(let a=0;a<r.length&&!s.closed;a+=o?1:2)s.next(r[a]);return this._checkFinalizedStatuses(s),e}_trimBuffer(){const{_bufferSize:s,_timestampProvider:e,_buffer:o,_infiniteTimeWindow:n}=this,r=(n?1:2)*s;if(s<1/0&&r<o.length&&o.splice(0,o.length-r),!n){const a=e.now();let l=0;for(let p=1;p<o.length&&o[p]<=a;p+=2)l=p;l&&o.splice(0,l+1)}}}class F extends b.x{constructor(){super(...arguments),this._value=null,this._hasValue=!1,this._isComplete=!1}_checkFinalizedStatuses(s){const{hasError:e,_hasValue:o,_value:n,thrownError:r,isStopped:a,_isComplete:l}=this;e?s.error(r):(a||l)&&(o&&s.next(n),s.complete())}next(s){this.isStopped||(this._value=s,this._hasValue=!0)}complete(){const{_hasValue:s,_value:e,_isComplete:o}=this;o||(this._isComplete=!0,s&&super.next(e),super.complete())}}var Z=u(9751),w=u(576),E=u(9300);function S(i){return(0,E.h)((s,e)=>i<=e)}var C=u(5698);class M{constructor(){}loadScript(s,e,o,n=null){if(typeof document<"u"&&!document.getElementById(s)){let r=document.createElement("script");r.async=!0,r.src=e,r.onload=o,n||(n=document.head),n.appendChild(r)}}}class R{}const j={oneTapEnabled:!0};let f=(()=>{class i extends M{constructor(e,o){super(),this.clientId=e,this.initOptions=o,this.changeUser=new t.vpe,this._socialUser=new k.X(null),this._accessToken=new k.X(null),this._receivedAccessToken=new t.vpe,this.initOptions={...j,...this.initOptions},this._socialUser.pipe(S(1)).subscribe(this.changeUser),this._accessToken.pipe(S(1)).subscribe(this._receivedAccessToken)}initialize(e){return new Promise((o,n)=>{try{this.loadScript(i.PROVIDER_ID,"https://accounts.google.com/gsi/client",()=>{if(google.accounts.id.initialize({client_id:this.clientId,auto_select:e,callback:({credential:r})=>{const a=this.createSocialUser(r);this._socialUser.next(a)},prompt_parent_id:this.initOptions?.prompt_parent_id,itp_support:this.initOptions.oneTapEnabled}),this.initOptions.oneTapEnabled&&this._socialUser.pipe((0,E.h)(r=>null===r)).subscribe(()=>google.accounts.id.prompt(console.debug)),this.initOptions.scopes){const r=this.initOptions.scopes instanceof Array?this.initOptions.scopes.filter(a=>a).join(" "):this.initOptions.scopes;this._tokenClient=google.accounts.oauth2.initTokenClient({client_id:this.clientId,scope:r,prompt:this.initOptions.prompt,callback:a=>{a.error?this._accessToken.error({code:a.error,description:a.error_description,uri:a.error_uri}):this._accessToken.next(a.access_token)}})}o()})}catch(r){n(r)}})}getLoginStatus(){return new Promise((e,o)=>{this._socialUser.value?e(this._socialUser.value):o(`No user is currently logged in with ${i.PROVIDER_ID}`)})}refreshToken(){return new Promise((e,o)=>{google.accounts.id.revoke(this._socialUser.value.id,n=>{n.error?o(n.error):e(this._socialUser.value)})})}getAccessToken(){return new Promise((e,o)=>{this._tokenClient?(this._tokenClient.requestAccessToken({hint:this._socialUser.value?.email}),this._receivedAccessToken.pipe((0,C.q)(1)).subscribe(e)):o(this._socialUser.value?"No token client was instantiated, you should specify some scopes.":"You should be logged-in first.")})}revokeAccessToken(){return new Promise((e,o)=>{this._tokenClient?this._accessToken.value?google.accounts.oauth2.revoke(this._accessToken.value,()=>{this._accessToken.next(null),e()}):o("No access token to revoke"):o("No token client was instantiated, you should specify some scopes.")})}signIn(){return Promise.reject('You should not call this method directly for Google, use "<asl-google-signin-button>" wrapper or generate the button yourself with "google.accounts.id.renderButton()" (https://developers.google.com/identity/gsi/web/guides/display-button#javascript)')}signOut(){var e=this;return(0,T.Z)(function*(){google.accounts.id.disableAutoSelect(),e._socialUser.next(null)})()}createSocialUser(e){const o=new R;o.idToken=e;const n=this.decodeJwt(e);return o.id=n.sub,o.name=n.name,o.email=n.email,o.photoUrl=n.picture,o.firstName=n.given_name,o.lastName=n.family_name,o}decodeJwt(e){const n=e.split(".")[1].replace(/-/g,"+").replace(/_/g,"/"),r=decodeURIComponent(window.atob(n).split("").map(function(a){return"%"+("00"+a.charCodeAt(0).toString(16)).slice(-2)}).join(""));return JSON.parse(r)}}return i.PROVIDER_ID="GOOGLE",i})(),P=(()=>{class i{get authState(){return this._authState.asObservable()}get initState(){return this._initState.asObservable()}constructor(e,o,n){this._ngZone=o,this._injector=n,this.providers=new Map,this.autoLogin=!1,this._user=null,this._authState=new z(1),this.initialized=!1,this._initState=new F,e instanceof Promise?e.then(r=>{this.initialize(r)}):this.initialize(e)}initialize(e){this.autoLogin=void 0!==e.autoLogin&&e.autoLogin;const{onError:o=console.error}=e;e.providers.forEach(n=>{this.providers.set(n.id,"prototype"in n.provider?this._injector.get(n.provider):n.provider)}),Promise.all(Array.from(this.providers.values()).map(n=>n.initialize(this.autoLogin))).then(()=>{if(this.autoLogin){const n=[];let r=!1;this.providers.forEach((a,l)=>{const p=a.getLoginStatus();n.push(p),p.then(d=>{this.setUser(d,l),r=!0}).catch(console.debug)}),Promise.all(n).catch(()=>{r||(this._user=null,this._authState.next(null))})}this.providers.forEach((n,r)=>{(function V(i){return!!i&&(i instanceof Z.y||(0,w.m)(i.lift)&&(0,w.m)(i.subscribe))})(n.changeUser)&&n.changeUser.subscribe(a=>{this._ngZone.run(()=>{this.setUser(a,r)})})})}).catch(n=>{o(n)}).finally(()=>{this.initialized=!0,this._initState.next(this.initialized),this._initState.complete()})}getAccessToken(e){var o=this;return(0,T.Z)(function*(){const n=o.providers.get(e);if(!o.initialized)throw i.ERR_NOT_INITIALIZED;if(!n)throw i.ERR_LOGIN_PROVIDER_NOT_FOUND;if(!(n instanceof f))throw i.ERR_NOT_SUPPORTED_FOR_ACCESS_TOKEN;return yield n.getAccessToken()})()}refreshAuthToken(e){return new Promise((o,n)=>{if(this.initialized){const r=this.providers.get(e);r?"function"!=typeof r.refreshToken?n(i.ERR_NOT_SUPPORTED_FOR_REFRESH_TOKEN):r.refreshToken().then(a=>{this.setUser(a,e),o()}).catch(a=>{n(a)}):n(i.ERR_LOGIN_PROVIDER_NOT_FOUND)}else n(i.ERR_NOT_INITIALIZED)})}refreshAccessToken(e){return new Promise((o,n)=>{if(this.initialized)if(e!==f.PROVIDER_ID)n(i.ERR_NOT_SUPPORTED_FOR_REFRESH_TOKEN);else{const r=this.providers.get(e);r instanceof f?r.revokeAccessToken().then(o).catch(n):n(i.ERR_LOGIN_PROVIDER_NOT_FOUND)}else n(i.ERR_NOT_INITIALIZED)})}signIn(e,o){return new Promise((n,r)=>{if(this.initialized){let a=this.providers.get(e);a?a.signIn(o).then(l=>{this.setUser(l,e),n(l)}).catch(l=>{r(l)}):r(i.ERR_LOGIN_PROVIDER_NOT_FOUND)}else r(i.ERR_NOT_INITIALIZED)})}signOut(e=!1){return new Promise((o,n)=>{if(this.initialized)if(this._user){let a=this.providers.get(this._user.provider);a?a.signOut(e).then(()=>{o(),this.setUser(null)}).catch(l=>{n(l)}):n(i.ERR_LOGIN_PROVIDER_NOT_FOUND)}else n(i.ERR_NOT_LOGGED_IN);else n(i.ERR_NOT_INITIALIZED)})}setUser(e,o){e&&o&&(e.provider=o),this._user=e,this._authState.next(e)}}return i.ERR_LOGIN_PROVIDER_NOT_FOUND="Login provider not found",i.ERR_NOT_LOGGED_IN="Not logged in",i.ERR_NOT_INITIALIZED="Login providers not ready yet. Are there errors on your console?",i.ERR_NOT_SUPPORTED_FOR_REFRESH_TOKEN="Chosen login provider is not supported for refreshing a token",i.ERR_NOT_SUPPORTED_FOR_ACCESS_TOKEN="Chosen login provider is not supported for getting an access token",i.\u0275fac=function(e){return new(e||i)(t.LFG("SocialAuthServiceConfig"),t.LFG(t.R0b),t.LFG(t.zs3))},i.\u0275prov=t.Yz7({token:i,factory:i.\u0275fac,providedIn:"root"}),i})(),x=(()=>{class i{static initialize(e){return{ngModule:i,providers:[P,{provide:"SocialAuthServiceConfig",useValue:e}]}}constructor(e){if(e)throw new Error("SocialLoginModule is already loaded. Import it in the AppModule only")}}return i.\u0275fac=function(e){return new(e||i)(t.LFG(i,12))},i.\u0275mod=t.oAB({type:i}),i.\u0275inj=t.cJS({providers:[P],imports:[O.ez]}),i})(),D=(()=>{class i extends M{constructor(e,o={}){super(),this.clientId=e,this.requestOptions={scope:"email,public_profile",locale:"en_US",fields:"name,email,picture,first_name,last_name",version:"v10.0"},this.requestOptions={...this.requestOptions,...o}}initialize(){return new Promise((e,o)=>{try{this.loadScript(i.PROVIDER_ID,`//connect.facebook.net/${this.requestOptions.locale}/sdk.js`,()=>{FB.init({appId:this.clientId,autoLogAppEvents:!0,cookie:!0,xfbml:!0,version:this.requestOptions.version}),e()})}catch(n){o(n)}})}getLoginStatus(){return new Promise((e,o)=>{FB.getLoginStatus(n=>{if("connected"===n.status){let r=n.authResponse;FB.api(`/me?fields=${this.requestOptions.fields}`,a=>{let l=new R;l.id=a.id,l.name=a.name,l.email=a.email,l.photoUrl="https://graph.facebook.com/"+a.id+"/picture?type=normal&access_token="+r.accessToken,l.firstName=a.first_name,l.lastName=a.last_name,l.authToken=r.accessToken,l.response=a,e(l)})}else o(`No user is currently logged in with ${i.PROVIDER_ID}`)})})}signIn(e){const o={...this.requestOptions,...e};return new Promise((n,r)=>{FB.login(a=>{if(a.authResponse){let l=a.authResponse;FB.api(`/me?fields=${o.fields}`,p=>{let d=new R;d.id=p.id,d.name=p.name,d.email=p.email,d.photoUrl="https://graph.facebook.com/"+p.id+"/picture?type=normal",d.firstName=p.first_name,d.lastName=p.last_name,d.authToken=l.accessToken,d.response=p,n(d)})}else r("User cancelled login or did not fully authorize.")},o)})}signOut(){return new Promise((e,o)=>{FB.logout(n=>{e()})})}}return i.PROVIDER_ID="FACEBOOK",i})(),G=(()=>{class i{}return i.\u0275fac=function(e){return new(e||i)},i.\u0275mod=t.oAB({type:i}),i.\u0275inj=t.cJS({}),i})();var L=u(4015);const B=function(){return["/account/register"]};class v{constructor(s,e,o,n){this.accountService=s,this.router=e,this.authService=o,this.activatedRoute=n,this.loggedIn=!1,this.loginForm=new c.cw({email:new c.NI("",[c.kI.required,c.kI.email]),password:new c.NI("",c.kI.required),rememberMe:new c.NI(!1)}),this.returnUrl=this.activatedRoute.snapshot.queryParams.returnUrl||"/shop"}ngOnInit(){}onSubmit(){console.log(this.loginForm.value),this.accountService.login(this.loginForm.value).subscribe({next:()=>this.router.navigateByUrl(this.returnUrl)})}loginToGoogle(){this.authService.authState.subscribe(s=>{this.user=s,this.loggedIn=null!=s,console.log(this.user.name+" "+this.user.email+" - "+this.loggedIn),console.log(this.user.authToken+" - "+this.user.idToken+" - "+this.user.provider),this.accountService.loginWithGoogle(s).subscribe({next:()=>this.router.navigateByUrl("/shop")})})}CallApiGoogle(){this.accountService.loginToGoogle()}toApiGoogle(){this.accountService.googlelogin().subscribe({next:()=>this.router.navigateByUrl("/shop")})}}v.\u0275fac=function(s){return new(s||v)(t.Y36(y.B),t.Y36(g.F0),t.Y36(P),t.Y36(g.gz))},v.\u0275cmp=t.Xpm({type:v,selectors:[["app-login"]],decls:30,vars:11,consts:[[1,"container-fluid","m-auto","p-lg-5"],[1,"d-flex","justify-content-center","pb-2"],[1,"card","mt-5","mb-0"],[1,"card-header"],[1,"d-flex","justify-content-end","social_icon"],[1,"fa","fa-facebook-square"],["GoogleSigninButtonDirective","",1,"fa","fa-google-plus-square",3,"click"],[1,"fa","fa-twitter-square"],[1,"card-body"],[3,"formGroup","ngSubmit"],[3,"formControl","type","label"],[3,"formControl","type","label","faicon"],[1,"row","align-items-center","remember"],["type","checkbox","formControlName","rememberMe"],[1,"d-flex","justify-content-end","mt-3","me-3"],["type","submit","value","Login",1,"btn","login_btn",3,"disabled"],[1,"card-footer"],[1,"d-flex","justify-content-center","links"],[1,"footer-text",3,"routerLink"],[1,"d-flex","justify-content-center","mt-2","mb-4"],["href","#",1,"footer-text"]],template:function(s,e){1&s&&(t.TgZ(0,"div",0)(1,"div",1)(2,"div",2)(3,"div",3)(4,"h3"),t._uU(5," - "),t.qZA(),t.TgZ(6,"div",4)(7,"span"),t._UZ(8,"i",5),t.qZA(),t.TgZ(9,"span")(10,"i",6),t.NdJ("click",function(){return e.loginToGoogle()}),t.qZA()(),t.TgZ(11,"span"),t._UZ(12,"i",7),t.qZA()()(),t.TgZ(13,"div",8)(14,"form",9),t.NdJ("ngSubmit",function(){return e.onSubmit()}),t._UZ(15,"app-text-input",10)(16,"app-text-input",11),t.TgZ(17,"div",12),t._UZ(18,"input",13),t._uU(19,"Remember Me "),t.qZA(),t.TgZ(20,"div",14),t._UZ(21,"input",15),t.qZA()()(),t.TgZ(22,"div",16)(23,"div",17),t._uU(24," Don't have an account?"),t.TgZ(25,"a",18),t._uU(26,"Sign Up"),t.qZA()(),t.TgZ(27,"div",19)(28,"a",20),t._uU(29,"Forgot your password?"),t.qZA()()()()()()),2&s&&(t.xp6(14),t.Q6J("formGroup",e.loginForm),t.xp6(1),t.Q6J("formControl",e.loginForm.controls.email)("type","email")("label","Email address"),t.xp6(1),t.Q6J("formControl",e.loginForm.controls.password)("type","password")("label","Password")("faicon","fa-lock"),t.xp6(5),t.Q6J("disabled",e.loginForm.invalid),t.xp6(4),t.Q6J("routerLink",t.DdM(10,B)))},dependencies:[g.rH,c._Y,c.Wl,c.JJ,c.JL,c.oH,c.sg,c.u,L.t],styles:[".container-fluid[_ngcontent-%COMP%]{background-image:url(http://getwallpapers.com/wallpaper/full/a/5/d/544750.jpg);background-size:cover;background-repeat:no-repeat;font-family:Numans,sans-serif;height:100%}.input-group-prepend[_ngcontent-%COMP%]{display:flex}.card[_ngcontent-%COMP%]{height:450px;margin-top:auto;margin-bottom:auto;width:400px;background-color:#00000080}.social_icon[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{font-size:60px;margin-left:10px;color:#e95420}.social_icon[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]:hover{color:#fff;cursor:pointer}.card-header[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]{color:#fff}.social_icon[_ngcontent-%COMP%]{position:absolute;right:20px;top:-45px}.input-group-prepend[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{width:50px;background-color:#e95420;color:#000;border:0}input[_ngcontent-%COMP%]:focus{outline:0 0 0 0;box-shadow:0 0}.remember[_ngcontent-%COMP%]{color:#fff}.remember[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]{width:20px;height:20px;margin-left:15px;margin-right:5px}.login_btn[_ngcontent-%COMP%]{color:#000;background-color:#e95420;width:100px}.login_btn[_ngcontent-%COMP%]:hover{color:#000;background-color:#fff}.footer-text[_ngcontent-%COMP%]{color:#00f}.links[_ngcontent-%COMP%]{color:#fff}.links[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{margin-left:4px}"]});var A=u(4004),U=u(8746),q=u(8372),J=u(3900);function K(i,s){if(1&i&&(t.TgZ(0,"li"),t._uU(1),t.qZA()),2&i){const e=s.$implicit;t.xp6(1),t.Oqu(e)}}function Y(i,s){if(1&i&&(t.TgZ(0,"ul",16),t.YNc(1,K,2,1,"li",17),t.TgZ(2,"li"),t._uU(3,"Error"),t.qZA()()),2&i){const e=t.oxw();t.xp6(1),t.Q6J("ngForOf",e.errors)}}class _{constructor(s,e,o){this.fb=s,this.accountService=e,this.router=o,this.errors=null,this.complexPassword="(?=^.{6,10}$)(?=.*d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&amp;*()_+}{&quot;:;'?/&gt;.&lt;,])(?!.*s).*$",this.registerForm=this.fb.group({displayName:["",c.kI.required],email:["",[c.kI.required,c.kI.email],[this.ValidateEmailNotTaken()]],password:["",[c.kI.required,c.kI.pattern(this.complexPassword)]]})}onSubmit(){this.accountService.register(this.registerForm.value).subscribe({next:()=>this.router.navigateByUrl("/shop"),error:s=>this.errors=s.errors})}ValidateEmailNotTaken(){return s=>this.accountService.checkEmailExists(s.value).pipe((0,A.U)(e=>e?{emailExists:!0}:null),(0,U.x)(()=>s.markAsTouched))}ValidateEmailNotTakenAsync(){return s=>s.valueChanges.pipe((0,q.b)(1e3),(0,C.q)(1),(0,J.w)(()=>this.accountService.checkEmailExists(s.value).pipe((0,A.U)(e=>e?{emailExists:!0}:null),(0,U.x)(()=>s.markAsTouched))))}}_.\u0275fac=function(s){return new(s||_)(t.Y36(c.qu),t.Y36(y.B),t.Y36(g.F0))},_.\u0275cmp=t.Xpm({type:_,selectors:[["app-register"]],decls:21,vars:12,consts:[[1,"container-fluid","m-auto","p-lg-5"],[1,"d-flex","justify-content-center","pb-2"],[1,"card","mt-5","mb-0"],[1,"card-header"],[1,"d-flex","justify-content-end","social_icon"],[1,"fa","fa-facebook-square"],[1,"fa","fa-google-plus-square"],[1,"fa","fa-twitter-square"],[1,"card-body"],[3,"formGroup","ngSubmit"],[3,"formControl","label"],[3,"formControl","type","label"],[3,"formControl","type","label","faicon"],["class","text-danger list-unstyled",4,"ngIf"],[1,"d-flex","justify-content-end","mt-3","me-3"],["type","submit","value","Register",1,"btn","login_btn",3,"disabled"],[1,"text-danger","list-unstyled"],[4,"ngFor","ngForOf"]],template:function(s,e){1&s&&(t.TgZ(0,"div",0)(1,"div",1)(2,"div",2)(3,"div",3)(4,"h3"),t._uU(5," - "),t.qZA(),t.TgZ(6,"div",4)(7,"span"),t._UZ(8,"i",5),t.qZA(),t.TgZ(9,"span"),t._UZ(10,"i",6),t.qZA(),t.TgZ(11,"span"),t._UZ(12,"i",7),t.qZA()()(),t.TgZ(13,"div",8)(14,"form",9),t.NdJ("ngSubmit",function(){return e.onSubmit()}),t._UZ(15,"app-text-input",10)(16,"app-text-input",11)(17,"app-text-input",12),t.YNc(18,Y,4,1,"ul",13),t.TgZ(19,"div",14),t._UZ(20,"input",15),t.qZA()()()()()()),2&s&&(t.xp6(14),t.Q6J("formGroup",e.registerForm),t.xp6(1),t.Q6J("formControl",e.registerForm.controls.displayName)("label","Display Name"),t.xp6(1),t.Q6J("formControl",e.registerForm.controls.email)("type","email")("label","Email address"),t.xp6(1),t.Q6J("formControl",e.registerForm.controls.password)("type","password")("label","Password")("faicon","fa-lock"),t.xp6(1),t.Q6J("ngIf",e.errors),t.xp6(2),t.Q6J("disabled",e.registerForm.invalid))},dependencies:[O.sg,O.O5,c._Y,c.JJ,c.JL,c.oH,c.sg,L.t],styles:[".container-fluid[_ngcontent-%COMP%]{background-image:url(http://getwallpapers.com/wallpaper/full/a/5/d/544750.jpg);background-size:cover;background-repeat:no-repeat;font-family:Numans,sans-serif;height:100%}.input-group-prepend[_ngcontent-%COMP%]{display:flex}.card[_ngcontent-%COMP%]{height:450px;margin-top:auto;margin-bottom:auto;width:400px;background-color:#00000080}.social_icon[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{font-size:60px;margin-left:10px;color:#e95420}.social_icon[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]:hover{color:#fff;cursor:pointer}.card-header[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]{color:#fff}.social_icon[_ngcontent-%COMP%]{position:absolute;right:20px;top:-45px}.input-group-prepend[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{width:50px;background-color:#e95420;color:#000;border:0}input[_ngcontent-%COMP%]:focus{outline:0 0 0 0;box-shadow:0 0}.remember[_ngcontent-%COMP%]{color:#fff}.remember[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]{width:20px;height:20px;margin-left:15px;margin-right:5px}.login_btn[_ngcontent-%COMP%]{color:#000;background-color:#e95420;width:100px}.login_btn[_ngcontent-%COMP%]:hover{color:#000;background-color:#fff}.footer-text[_ngcontent-%COMP%]{color:#00f}.links[_ngcontent-%COMP%]{color:#fff}.links[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{margin-left:4px}"]});const $=[{path:"login",component:v},{path:"register",component:_}];class h{}h.\u0275fac=function(s){return new(s||h)},h.\u0275mod=t.oAB({type:h}),h.\u0275inj=t.cJS({imports:[g.Bz.forChild($),g.Bz]});var Q=u(4466);class m{}m.\u0275fac=function(s){return new(s||m)},m.\u0275mod=t.oAB({type:m}),m.\u0275inj=t.cJS({providers:[{provide:"SocialAuthServiceConfig",useValue:{autoLogin:!1,providers:[{id:f.PROVIDER_ID,provider:new f("343403644695-b0r07v7gdsudou62bhq7b6leunlfb93j.apps.googleusercontent.com")},{id:D.PROVIDER_ID,provider:new D("clientId")}],onError:i=>{console.error(i)}}}],imports:[O.ez,h,Q.m,x,G,x]})}}]);