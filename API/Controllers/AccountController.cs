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


    }

}