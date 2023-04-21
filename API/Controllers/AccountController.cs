using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using API.Dtos;
using API.Errors;
using API.Extensions;
using AutoMapper;
using Core.Entities.Identity;
using Core.Interfaces;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly UserManager<AppUser> userManager;
        private readonly SignInManager<AppUser> signInManager;
        private readonly ITokenService tokenService;
        private readonly IMapper mapper;
        public AccountController( UserManager<AppUser> userManager, SignInManager<AppUser> signInManager,
                                    ITokenService tokenService, IMapper mapper )
        {
            this.mapper = mapper;
            this.tokenService = tokenService;
            this.signInManager = signInManager;
            this.userManager = userManager;
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            var email = User.FindFirstValue(ClaimTypes.Email);
            //var email = HttpContext.User?.Claims?.FirstOrDefault(x => x.Type == ClaimTypes.Email)?.Value;

            var user = await userManager.FindByEmailAsync(email);

             return new UserDto
            {
                Email = user.Email,
                Displayname = user.DisplayName,
                Token = tokenService.CreateToken(user)
            };

        } 

        [HttpGet("emailexists")]
        public async Task<ActionResult<bool>> CheckEmailExistsAsync([FromQuery] string email)
        {
            return await userManager.FindByEmailAsync(email) != null;
        }

        [Authorize]
        [HttpGet("address")]
        public async Task<ActionResult<AddressDto>> GetUserAddressAsync()
        {
            // var email = User.FindFirstValue(ClaimTypes.Email);
            // var user = await userManager.Users.Include(x => x.Address).FirstOrDefaultAsync(x => x.Email == email);
            var user = await userManager.FindUserByClaimsPrincipalWithAddress(User);

            return mapper.Map<Address, AddressDto>(user.Address);

        }

        [Authorize]
        [HttpPut("address")]
        public async Task<ActionResult<AddressDto>> UpdateUserAddressAsync(AddressDto address)
        {
            var user = await userManager.FindUserByClaimsPrincipalWithAddress(User);

            user.Address = mapper.Map<AddressDto, Address>(address);

            var result = await userManager.UpdateAsync(user);

            if (!result.Succeeded) return BadRequest("Problem updating the user/address");

            return Ok(mapper.Map<Address, AddressDto>(user.Address));
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await userManager.FindByEmailAsync(loginDto.Email);

            if (user == null) return Unauthorized(new ApiException(401));

            var result = await signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);

            if (!result.Succeeded) return Unauthorized(new ApiException(401));

            var token = tokenService.CreateToken(user);

            return new UserDto
            {
                Email = user.Email,
                Displayname = user.DisplayName,
                Token = token
            };
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            if (CheckEmailExistsAsync(registerDto.Email).Result.Value)
            {
                return new BadRequestObjectResult(new ApiValidationErrorResponse{Errors = new []{"Email address is in use"}});
            } 

            var user = new AppUser
            {
                DisplayName = registerDto.DisplayName,
                Email = registerDto.Email,
                UserName = registerDto.Email
            };

            var result = await userManager.CreateAsync(user, registerDto.Password);

            if (!result.Succeeded) return BadRequest(new ApiException(400));

            var token = tokenService.CreateToken(user);

            return new UserDto
            {
                Email = user.Email,
                Displayname = user.DisplayName,
                Token = token
            };
        }

        // Login to Google - call from client app
        [HttpPost("logingoogle")]
         public async Task<ActionResult<UserDto>> LoginWithGoogle(SocialUserDto socialUser)
        {
            if (CheckEmailExistsAsync(socialUser.email).Result.Value)
            {
                var usertoReturn = await userManager.FindByEmailAsync(socialUser.email);
                
                var tokentoReturn = tokenService.CreateToken(usertoReturn);

                return new UserDto
                {
                    Email = usertoReturn.Email,
                    Displayname = usertoReturn.DisplayName,
                    Token = tokentoReturn
                };

            }

            var user = new AppUser
            {
                DisplayName = socialUser.name,
                Email = socialUser.email,
                UserName = socialUser.email
            };

            var result = await userManager.CreateAsync(user);

            if (!result.Succeeded) return BadRequest(new ApiException(400));

            var token = tokenService.CreateToken(user);

            return new UserDto
            {
                Email = user.Email,
                Displayname = user.DisplayName,
                Token = token
            };
        }

        /// Google Login from API

        [AllowAnonymous]
        [HttpGet("GoogleLogin")]
        public IActionResult GoogleLogin()
        {
            string redirectUrl = Url.Action("GoogleResponse", "Account");
            var properties = signInManager.ConfigureExternalAuthenticationProperties("Google", redirectUrl);
            return new ChallengeResult("Google", properties);
        }
 
        [AllowAnonymous]
        [HttpGet("GoogleResponse")]
        public async Task<ActionResult<UserDto>> GoogleResponse()
        {
            ExternalLoginInfo info = await signInManager.GetExternalLoginInfoAsync();
            if (info == null)
                return RedirectToAction(nameof(Login));
 
           
            var result = await signInManager.ExternalLoginSignInAsync(info.LoginProvider, info.ProviderKey, false);
            
            string[] userInfo = { info.Principal.FindFirst(ClaimTypes.Name).Value, info.Principal.FindFirst(ClaimTypes.Email).Value };
            
            //if (!result.Succeeded) return BadRequest(new ApiException(400));

            
                var user = new AppUser
                {
                DisplayName = info.Principal.FindFirst(ClaimTypes.Name).Value,
                Email = info.Principal.FindFirst(ClaimTypes.Email).Value,
                UserName = info.Principal.FindFirst(ClaimTypes.Email).Value
                };
                
                IdentityResult identResult = await userManager.CreateAsync(user);
                if (identResult.Succeeded)
                {
                    identResult = await userManager.AddLoginAsync(user, info);
                    if (identResult.Succeeded)
                    {
                        await signInManager.SignInAsync(user, isPersistent: false);
                        await HttpContext.SignOutAsync(IdentityConstants.ExternalScheme);
                        var token = tokenService.CreateToken(user);

                        // return new UserDto
                        // {
                        //     Email = user.Email,
                        //     Displayname = user.DisplayName,
                        //     Token = token
                        // };

                        return Redirect("https://localhost:4200/shop"); 
                    }
                }
                else 
                {
                     var token = tokenService.CreateToken(user);

                        // return new UserDto
                        // {
                        //     Email = user.Email,
                        //     Displayname = user.DisplayName,
                        //     Token = token
                        // };

                        return Redirect("https://localhost:4200/shop"); 
                }
                return BadRequest( new ApiException(400,"Unknow error"));
            
        }


    }

}