using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities;
using Core.Interfaces;

namespace Infrastructure.Services
{
    public class PaymentService : IPaymentService
    {
        public Task<CustomerBasket> CreateOrUpdatePaymentIntent(string basketId)
        {
            throw new NotImplementedException();
        }
    }
}