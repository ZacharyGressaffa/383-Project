using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SP22.P05.Web.Data;
using SP22.P05.Web.Features.Authorization;
using SP22.P05.Web.Features.Products;

namespace SP22.P05.Web.Controllers;

[Route("api/products")]
[ApiController]
public class ProductsController : ControllerBase
{
    private readonly DataContext dataContext;

    public ProductsController(DataContext dataContext)
    {
        this.dataContext = dataContext;
    }

    [HttpGet]
    public ProductDto[] GetAllProducts()
    {
        var products = dataContext.Set<Product>();
        return GetProductDtos(products).Where(x => x.Disabled != 1).ToArray();
    }

    [HttpGet]
    [Route("{id}")]
    public ActionResult<ProductDto> GetProductById(int id)
    {
        var products = dataContext.Set<Product>();
        var result = GetProductDtos(products).FirstOrDefault(x => x.Id == id);
        if (result == null || result.Disabled == 1)
        {
            return NotFound();
        }

        return Ok(result);
    }

    [HttpGet]
    [Route("Tag/{tag}")]
    public ActionResult<ProductDto> GetProductByTag(string tag)
    {
        var products = dataContext.Set<Product>();
        var result = GetProductDtos(products).Where(x => x.Tag == tag && x.Disabled != 1);
        if (result == null)
        {
            return NotFound();
        }

        return Ok(result);
    }

    [HttpGet]
    [Route("Tag/{tag}/Genre/{genre}")]
    public ActionResult<ProductDto> GetProductByTagAndGenre(string tag, string genre, int id)
    {
        var products = dataContext.Set<Product>();
        if (id < 0)
        {
            var result = GetProductDtos(products).Where(x => x.Tag == tag && x.Genre == genre);
            if (result == null)
            {
                
                return NotFound();
            }
            return Ok(result);
        }
        else
        {
            var result = GetProductDtos(products).Where(x => x.Tag == tag && x.Genre == genre && x.Id != id);
            return Ok(result);
        }
        
    }

    [HttpGet]
    [Route("sales")]
    public ProductDto[] GetProductsOnSale()
    {
        var products = dataContext.Set<Product>();
        return GetProductDtos(products).Where(x => x.SalePrice != null).ToArray();
    }

    [HttpPost]
    //[Authorize(Roles = RoleNames.Developer)]
    public ActionResult<ProductDto> CreateProduct(ProductDto productDto)
    {
        var product = new Product
        {
            Name = productDto.Name,
            Description = productDto.Description,
            Price = productDto.Price,
            Tag = productDto.Tag,   
            Genre = productDto.Genre,
            ImageURL = productDto.ImageURL,
        };

        dataContext.Add(product);
        dataContext.SaveChanges();
        productDto.Id = product.Id;

        return CreatedAtAction(nameof(GetProductById), new { id = product.Id }, productDto);
    }


    [HttpPut("{id}")]
    //[Authorize(Roles = RoleNames.Developer)]
    public ActionResult<ProductDto> UpdateProduct(int id, ProductDto productDto)
    {
        var products = dataContext.Set<Product>();
        var current = products.FirstOrDefault(x => x.Id == id);
        if (current == null)
        {
            return NotFound();
        }

        current.Name = productDto.Name;
        current.Price = productDto.Price;
        current.Description = productDto.Description;
        current.Tag = productDto.Tag;   
        current.Genre = productDto.Genre;   
        dataContext.SaveChanges();

        return Ok(productDto);
    }

    [HttpDelete("{id}")]
    //[Authorize(Roles = RoleNames.Developer)]
    public ActionResult<ProductDto> DeleteProduct(int id)
    {
        var products = dataContext.Set<Product>();
        var current = products.FirstOrDefault(x => x.Id == id);
        if (current == null)
        {
            return NotFound();
        }

        products.Remove(current);
        dataContext.SaveChanges();

        return Ok();
    }

    private static IQueryable<ProductDto> GetProductDtos(IQueryable<Product> products)
    {
        var now = DateTimeOffset.UtcNow;
        return products
            .Select(x => new
            {
                Product = x,
                CurrentSale = x.SaleEventProducts.FirstOrDefault(y => y.SaleEvent!.StartUtc <= now && now <= y.SaleEvent.EndUtc)
            })
            .Select(x => new ProductDto
            {
                Id = x.Product.Id,
                Name = x.Product.Name,
                Description = x.Product.Description,
                Tag = x.Product.Tag,
                Genre = x.Product.Genre,
                Price = x.Product.Price,
                ImageURL = x.Product.ImageURL,
                Disabled = x.Product.Disabled,
                SalePrice = x.CurrentSale == null ? null : x.CurrentSale.SaleEventPrice,
                SaleEndUtc = x.CurrentSale == null ? null : x.CurrentSale.SaleEvent!.EndUtc,
            });
    }
}