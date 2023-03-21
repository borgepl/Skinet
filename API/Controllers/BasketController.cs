using API.Dtos;
using AutoMapper;
using Core.Entities;
using Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class BasketController : BaseApiController
    {
        private readonly IBasketRepository basketRepository;
        private readonly IMapper mapper;
        public BasketController( IBasketRepository basketRepository, IMapper mapper)
        {
            this.mapper = mapper;
            this.basketRepository = basketRepository;
        }

        [HttpGet]
        public async Task<ActionResult<CustomerBasket>> GetBasketById(string id)
        {
            var basket = await basketRepository.GetBasketAsync(id);

            return Ok(basket ?? new CustomerBasket(id));
        }

        [HttpPost]
        public async Task<ActionResult<CustomerBasket>> UpdateBasket(CustomerBasketDto basketDto)
        {
            var basket = mapper.Map<CustomerBasketDto, CustomerBasket>(basketDto);
            var UpdatedBasket = await basketRepository.UpdateBasketAsync(basket);

            return Ok(UpdatedBasket);
        }

        [HttpDelete]
        public async Task DeleteBasket(string id)
        {
             await basketRepository.DeleteBasketAsync(id);
        }
    }
}