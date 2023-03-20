using API.Errors;
using Core.Entities;
using Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class BuggyController : BaseApiController
    {
        private readonly StoreContext context;
        public BuggyController(StoreContext context)
        {
            this.context = context;
        }

        [Authorize]
        [HttpGet("testauth")]
        public ActionResult<string> GetSecret() 
        {
            return "secret text";
        }

        [HttpGet("notfound")]
        public ActionResult<Product> GetNotFound() 
        {
            var thing = this.context.Products.Find(-1);
            if (thing == null) return NotFound();
            return Ok(thing);
        }

        [HttpGet("servererror")]
        public ActionResult<string> GetServerError() 
        {
            var thing = this.context.Products.Find(-1); // will be null
            var thingToReturn = thing.ToString();  // null reference exception
            
            return thingToReturn;
        }

        [HttpGet("badrequest")]
        public ActionResult<string> GetBadRequest() 
        {
            // return BadRequest("This was NOT a good request!");
            return BadRequest(new ApiException(400));
        }

         [HttpGet("badrequest/{id}")]
        public ActionResult<string> GetBadRequest(int id) 
        {
            return Ok();
        }
    
    }
}