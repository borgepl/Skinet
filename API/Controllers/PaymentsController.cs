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
        private const string endpointSecret = "whsec_";
        private readonly ILogger<PaymentsController> logger;

        private readonly IPaymentService paymentService;
        public PaymentsController( IPaymentService paymentService, ILogger<PaymentsController> logger)
        {
            this.logger = logger;
            this.paymentService = paymentService;
        }

        [Authorize]
        [HttpPost("{basketId}")]
        public async Task<ActionResult<CustomerBasket>> CreateOrUpdatePaymentIntent(string basketId)
        {
            var basket = await paymentService.CreateOrUpdatePaymentIntent(basketId);

            if (basket == null) return BadRequest(new ApiException(400, "Problem with your basket"));

            return basket;
        }

        [HttpPost]
        public async Task<ActionResult> StripeWebhook()
        {
             
            var json = await new StreamReader(Request.Body).ReadToEndAsync();

             try
            {
                var stripeEvent = EventUtility.ConstructEvent(json,
                    Request.Headers["Stripe-Signature"], endpointSecret);

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
            catch (StripeException)
            {
                return BadRequest();
            }
        }
    }
}