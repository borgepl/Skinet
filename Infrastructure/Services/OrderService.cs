using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities;
using Core.Entities.OrderAggregate;
using Core.Interfaces;

namespace Infrastructure.Services
{
    public class OrderService : IOrderService
    {
        private readonly IGenericRepository<Order> orderRepo;
        private readonly IGenericRepository<DeliveryMethod> deliveryRepo;
        private readonly IGenericRepository<Product> productRepo;
        private readonly IBasketRepository basketRepo;
        public OrderService( IGenericRepository<Order> orderRepo, 
            IGenericRepository<DeliveryMethod> deliveryRepo, 
            IGenericRepository<Product> productRepo, 
            IBasketRepository basketRepo)
        {
            this.basketRepo = basketRepo;
            this.productRepo = productRepo;
            this.deliveryRepo = deliveryRepo;
            this.orderRepo = orderRepo;
        }

        public async Task<Order> CreateOrderAsync(string buyerEmail, int deliveryMethodId, string basketId, Address shippingAddress)
        {
            // get basket from basket repo
            var basket = await basketRepo.GetBasketAsync(basketId);

            // get items from product repo (actuall status and price of the products)
            var items = new List<OrderItem>();
            foreach (var item in basket.Items)
            {
                var productItem = await productRepo.GetByIdAsync(item.Id);
                var itemOrdered = new ProductItemOrdered(productItem.Id, productItem.Name, productItem.PictureUrl);
                var orderItem = new OrderItem(itemOrdered, productItem.Price, item.Quantity);

                items.Add(orderItem);
            }

            // get delivery methods from repo
            var deliveryMethod = await deliveryRepo.GetByIdAsync(deliveryMethodId);
            
            // calc subtotal
            var subtotal = items.Sum(item => item.Price * item.Quantity);

            // create order
            var order = new Order(items, buyerEmail, shippingAddress, deliveryMethod, subtotal);

            // TODO : save to db
            
            // return order
            return order;
        }

        public async Task<IReadOnlyList<DeliveryMethod>> GetDeliveryMethodsAsync()
        {
            return await deliveryRepo.ListAllAsync();
        }

        public Task<Order> GetOrderByIdAsync(int id, string buyerEmail)
        {
            throw new NotImplementedException();
        }

        public Task<IReadOnlyList<Order>> GetOrdersForUserAsync(string buyerEmail)
        {
            throw new NotImplementedException();
        }
    }
}