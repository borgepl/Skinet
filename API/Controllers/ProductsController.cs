using API.Dtos;
using API.Errors;
using AutoMapper;
using Core.Entities;
using Core.Interfaces;
using Core.Specifications;
using Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class ProductsController : BaseApiController
    {
        private readonly IGenericRepository<Product> productsRepo;
        private readonly IGenericRepository<ProductBrand> productBrandRepo;
        private readonly IMapper mapper;
        private readonly IGenericRepository<ProductType> productTypeRepo;
        
        public ProductsController(IGenericRepository<Product> productsRepo,
            IGenericRepository<ProductType> productTypeRepo, 
            IGenericRepository<ProductBrand> productBrandRepo,
            IMapper mapper )
        {
            this.productsRepo = productsRepo;
            this.productTypeRepo = productTypeRepo;
            this.productBrandRepo = productBrandRepo;
            this.mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<ProductToReturnDto>>> GetProducts(
            string sort, int? brandId, int? typeId)
        {
            var spec = new ProductsWithTypesAndBrandsSpecification(sort, brandId, typeId);
            var products = await productsRepo.ListAsync(spec);
            return Ok(mapper.Map<IReadOnlyList<Product>, IReadOnlyList<ProductToReturnDto>>(products));
            
        }

        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiException), StatusCodes.Status404NotFound)]
        public async Task<ActionResult<ProductToReturnDto>> GetProduct(int id)
        {
            var spec = new ProductsWithTypesAndBrandsSpecification(id);
            var product =  await productsRepo.GetEntityWithSpec(spec);

            if (product == null) 
                return NotFound(new ApiException(404, null ,"The Product is not in the Database!"));

            return mapper.Map<Product, ProductToReturnDto>(product);
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