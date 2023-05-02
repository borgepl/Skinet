using API.Errors;
using Core.Entities;
using Core.Entities.OrderAggregate;
using Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Stripe;

namespace API.Controllers
{
    public class PaymentsController : BaseApiController
    {
         // This is your Stripe CLI webhook secret for testing your endpoint locally.
        private readonly string endpointSecret;
        private readonly ILogger<PaymentsController> logger;
        private readonly IConfiguration config;

        private readonly IPaymentService paymentService;
        public PaymentsController( IPaymentService paymentService, ILogger<PaymentsController> logger, IConfiguration config)
        {
            this.config = config;
            this.logger = logger;
            this.paymentService = paymentService;
            endpointSecret = config.GetSection("StripeSettings:WhSecret").Value;
        }

        [Authorize]
        [HttpPost("{basketId}")]
        public async Task<ActionResult<CustomerBasket>> CreateOrUpdatePaymentIntent(string basketId)
        {
            var basket = await paymentService.CreateOrUpdatePaymentIntent(basketId);

            if (basket == null) return BadRequest(new ApiException(400, "Problem with your basket"));

            return basket;
        }

        [AllowAnonymous]
        [HttpPost("webhook")]
        public async Task<ActionResult> StripeWebhook()
        {
             
            var json = await new StreamReader(Request.Body).ReadToEndAsync();

            
                var stripeEvent = EventUtility.ConstructEvent(json,
                    Request.Headers["Stripe-Signature"], endpointSecret, throwOnApiVersionMismatch:false);

                PaymentIntent paymentIntent;
                Order order;

                // Handle the event
                
                switch (stripeEvent.Type)
                {
                    case "payment_intent.succeeded":
                        paymentIntent = (PaymentIntent) stripeEvent.Data.Object;
                        logger.LogInformation("Payment succeeded: ", paymentIntent.Id);
                        
                        // update the order with the new status
                        order = await paymentService.UpdateOrderPaymentSucceeded(paymentIntent.Id);
                        logger.LogInformation("Order updated to Payment Received: ", order.Id);
                        break;

                    case "payment_intent.payment_failed":
                        paymentIntent = (PaymentIntent) stripeEvent.Data.Object;
                        logger.LogInformation("Payment failed: ", paymentIntent.Id);
                        
                        //  update the order with the new status
                         order = await paymentService.UpdateOrderPaymentFailed(paymentIntent.Id);
                        logger.LogInformation("Order updated to Payment Failed: ", order.Id);
                        break;

                }

                return new EmptyResult();
           
        }
    }
}