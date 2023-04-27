using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities;
using Core.Entities.OrderAggregate;
using Core.Interfaces;
using Core.Specifications;

namespace Infrastructure.Services
{
    public class OrderService : IOrderService
    {
        private readonly IUnitOfWork unitOfWork;
        
        private readonly IBasketRepository basketRepo;
        public OrderService( IUnitOfWork unitOfWork, IBasketRepository basketRepo)
        {
            this.unitOfWork = unitOfWork;
            this.basketRepo = basketRepo;
        }
        public async Task<Order> CreateOrderAsync(string buyerEmail, int deliveryMethodId, string basketId, Address shippingAddress)
        {
            // get basket from basket repo
            var basket = await basketRepo.GetBasketAsync(basketId);

            // get items from product repo (actuall status and price of the products)
            var items = new List<OrderItem>();
            foreach (var item in basket.Items)
            {
                var productItem = await unitOfWork.Repository<Product>().GetByIdAsync(item.Id);
                var itemOrdered = new ProductItemOrdered(productItem.Id, productItem.Name, productItem.PictureUrl);
                var orderItem = new OrderItem(itemOrdered, productItem.Price, item.Quantity);

                items.Add(orderItem);
            }

            // get delivery methods from repo
            var deliveryMethod = await unitOfWork.Repository<DeliveryMethod>().GetByIdAsync(deliveryMethodId);
            
            // calc subtotal
            var subtotal = items.Sum(item => item.Price * item.Quantity);

            // check to see if order exists
            var spec = new OrderByPaymentIntentIdSpec(basket.PaymentIntentId);
            var order = await unitOfWork.Repository<Order>().GetEntityWithSpec(spec);

            if (order != null) // if exists - update
            {
                order.ShipToAddress = shippingAddress;
                order.DeliveryMethod = deliveryMethod;
                order.Subtotal = subtotal;
                unitOfWork.Repository<Order>().Update(order);
            }
            else
            {
                // create order
                order = new Order(items, buyerEmail, shippingAddress, deliveryMethod, subtotal, basket.PaymentIntentId);
                unitOfWork.Repository<Order>().Add(order);
            }

            //  save to db
            var result = await unitOfWork.Complete();  //SaveChangesAsync

            if (result <= 0) return null;
            
            
            // return order
            return order;
        }

        public async Task<IReadOnlyList<DeliveryMethod>> GetDeliveryMethodsAsync()
        {
            return await unitOfWork.Repository<DeliveryMethod>().ListAllAsync();
        }

        public async Task<Order> GetOrderByIdAsync(int id, string buyerEmail)
        {
            var spec = new OrdersWithItemsAndOrderingSpec(id, buyerEmail);
            return await unitOfWork.Repository<Order>().GetEntityWithSpec(spec);
        }

        public async Task<IReadOnlyList<Order>> GetOrdersForUserAsync(string buyerEmail)
        {
            var spec = new OrdersWithItemsAndOrderingSpec(buyerEmail);
            return await unitOfWork.Repository<Order>().ListAsync(spec);
        }
    }

       
    }