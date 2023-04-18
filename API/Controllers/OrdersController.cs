using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Core.Entities.OrderAggregate;
using API.Dtos;
using AutoMapper;
using System.Security.Claims;
using API.Extensions;
using API.Errors;

namespace API.Controllers
{
    [Authorize]
    public class OrdersController : BaseApiController
    {
        private readonly IOrderService orderService;
        private readonly IMapper mapper;
        public OrdersController( IOrderService orderService, IMapper mapper)
        {
            this.mapper = mapper;
            this.orderService = orderService;
        }

        [HttpPost]
        public async Task<ActionResult<Order>> CreateOrder(OrderDto orderDto) {

            var email = HttpContext.User.GetUserEmail();

            var address = mapper.Map<AddressDto, Address>(orderDto.ShipToAddress);

            var order = await orderService.CreateOrderAsync(email, orderDto.DeliveryMethodId, orderDto.BasketId, address );

            if (order == null) return BadRequest(new ApiException(400, "Problem creating order"));

            return Ok(order);

        }

        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<Order>>> GetOrdersForUser() {
            
            var email = HttpContext.User.GetUserEmail();

            var orders = await orderService.GetOrdersForUserAsync(email);

            return Ok(orders);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Order>> GetOrderById(int id) {

            var email = HttpContext.User.GetUserEmail();
            var order = await orderService.GetOrderByIdAsync(id, email);

            if (order == null) return NotFound(new ApiException(404));
            return order;
        }

        [HttpGet("deliveryMethods")]
        public async Task<ActionResult<IReadOnlyList<DeliveryMethod>>> GetDeliveryMethods() {

            return Ok(await orderService.GetDeliveryMethodsAsync());
        }
    }
}