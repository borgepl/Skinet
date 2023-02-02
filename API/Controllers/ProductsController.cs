using Core.Entities;
using Core.Interfaces;
using Core.Specifications;
using Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly IGenericRepository<Product> productsRepo;
        private readonly IGenericRepository<ProductBrand> productBrandRepo;
        private readonly IGenericRepository<ProductType> productTypeRepo;
        
        public ProductsController(IGenericRepository<Product> productsRepo,
            IGenericRepository<ProductType> productTypeRepo, 
            IGenericRepository<ProductBrand> productBrandRepo )
        {
            this.productsRepo = productsRepo;
            this.productTypeRepo = productTypeRepo;
            this.productBrandRepo = productBrandRepo;
            
        }

        [HttpGet]
        public async Task<ActionResult<List<Product>>> GetProducts()
        {
            var spec = new ProductsWithTypesAndBrandsSpecification();
            var products = await productsRepo.ListAsync(spec);
            return Ok(products);
            
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProduct(int id)
        {
            var spec = new ProductsWithTypesAndBrandsSpecification(id);
            return await productsRepo.GetEntityWithSpec(spec);
        }

        [HttpGet("brands")]
         public async Task<ActionResult<List<ProductBrand>>> GetProductBrands()
        {
            var brands = await productBrandRepo.ListAllAsync();
            return Ok(brands);
            
        }

        [HttpGet("types")]
         public async Task<ActionResult<List<ProductType>>> GetProductTypes()
        {
            var types = await productTypeRepo.ListAllAsync();
            return Ok(types);
            
        }
    }
}