using Core.Entities;
using Core.Interfaces;
using Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly IProductRepository repo;
        
        public ProductsController(IProductRepository repo)
        {
            this.repo = repo;
            
        }

        [HttpGet]
        public async Task<ActionResult<List<Product>>> GetProducts()
        {
            var products = await repo.GetProductsAsync();
            return Ok(products);
            
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProduct(int id)
        {
            return await repo.GetProductByIdAsync(id);
        }

        [HttpGet("brands")]
         public async Task<ActionResult<List<ProductBrand>>> GetProductBrands()
        {
            var brands = await repo.GetProductBrandsAsync();
            return Ok(brands);
            
        }

        [HttpGet("types")]
         public async Task<ActionResult<List<ProductType>>> GetProductTypes()
        {
            var types = await repo.GetProductTypesAsync();
            return Ok(types);
            
        }
    }
}