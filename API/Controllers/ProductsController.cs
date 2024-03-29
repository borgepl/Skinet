using API.Dtos;
using API.Errors;
using API.Helpers;
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

        [Cached(600)]
        [HttpGet]
        public async Task<ActionResult<Pagination<ProductToReturnDto>>> GetProducts(
            [FromQuery] ProductSpecParams productParams)
        {
            var spec = new ProductsWithTypesAndBrandsSpecification(productParams);
            var countSpec = new ProductsWithFilterForCountSpecification(productParams);

            var totalItems = await productsRepo.CountAsync(countSpec);

            var products = await productsRepo.ListAsync(spec);

            var data = mapper.Map<IReadOnlyList<Product>, IReadOnlyList<ProductToReturnDto>>(products);
            return Ok(new Pagination<ProductToReturnDto>(productParams.PageIndex, 
                productParams.PageSize, totalItems, data ));
            
        }

        [Cached(600)]
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

        [Cached(600)]
        [HttpGet("brands")]
         public async Task<ActionResult<List<ProductBrand>>> GetProductBrands()
        {
            var brands = await productBrandRepo.ListAllAsync();
            return Ok(brands);
            
        }

        [Cached(600)]
        [HttpGet("types")]
         public async Task<ActionResult<List<ProductType>>> GetProductTypes()
        {
            var types = await productTypeRepo.ListAllAsync();
            return Ok(types);
            
        }
    }
}