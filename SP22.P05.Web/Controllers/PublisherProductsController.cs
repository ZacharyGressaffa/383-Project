using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SP22.P05.Web.Data;
using SP22.P05.Web.Features.Authorization;
using SP22.P05.Web.Features.Products;
using SP22.P05.Web.Features.PublisherProducts;

namespace SP22.P05.Web.Controllers;

[Route("api/publisher/products")]
[ApiController]
public class PublisherProductsController : ControllerBase
{
    private readonly DataContext dataContext;

    public PublisherProductsController(DataContext dataContext)
    {
        this.dataContext = dataContext;
    }

    [HttpGet]
    [Route("{publisherID}/all")]
    public List<ProductDto> GetAllProducts(int publisherID)
    {
        var PublisherProducts = dataContext.Set<PublisherProducts>();
        var products = dataContext.Set<Product>();
        var publisherProduct = PublisherProducts.Where(x => x.PublisherId == publisherID).ToArray();
        var productList = new List<ProductDto>();
        if (publisherProduct != null)
        {
            foreach (var product in publisherProduct)
            {
            
                    var tempProduct = GetProductDtos(products).FirstOrDefault(x => x.Id == product.ProductID);
                if (tempProduct.Disabled != 1)
                {
                    productList.Add(tempProduct);
                }
            }
        }

        return productList;
    }

    [HttpGet]
    [Route("{publisherID}/inactive")]
    public List<ProductDto> GetInctiveProducts(int publisherID)
    {
        var PublisherProducts = dataContext.Set<PublisherProducts>();
        var products = dataContext.Set<Product>();
        var publisherProduct = PublisherProducts.Where(x => x.PublisherId == publisherID).ToArray();
        var productList = new List<ProductDto>();
        if (publisherProduct != null)
        {
            foreach (var product in publisherProduct)
            {
                var tempProduct = GetProductDtos(products).FirstOrDefault(x => x.Id == product.ProductID);
                if (tempProduct.Disabled == 1)
                {
                    productList.Add(tempProduct);
                }
            }
        }

        return productList;
    }

    [HttpGet]
    [Route("{publisherID}/{productID}")]
    public ActionResult<ProductDto> GetProductById(int publisherID, int productID)
    {
        var publisherProducts = dataContext.Set<PublisherProducts>();
        var publisherProduct = publisherProducts.FirstOrDefault(x => x.PublisherId == publisherID && x.ProductID == productID);
        if (publisherProduct != null)
        {
            var products = dataContext.Set<Product>();
            var result = GetProductDtos(products).FirstOrDefault(x => x.Id == productID);
            if (result == null && result.Disabled == 0)
            {
                return NotFound();
            }

            return Ok(result);
        }
        else
        {

            return NotFound();
        }

    }

    [HttpPost]
    [Route("{publisherID}/add")]
    //[Authorize(Roles = RoleNames.Developer)]
    public ActionResult<ProductDto> AddProducts(int publisherID, ProductDto productDto)
    {
        var product = new Product
        {
            Name = productDto.Name,
            Description = productDto.Description,
            Price = productDto.Price,
            Tag = productDto.Tag,
            Genre = productDto.Genre,
            ImageURL = productDto.ImageURL,
            Disabled = productDto.Disabled,
        };

        dataContext.Add(product);
        dataContext.SaveChanges();

        var publisherProduct = new PublisherProducts();
        publisherProduct.PublisherId = publisherID;
        publisherProduct.ProductID = product.Id;


        dataContext.Add(publisherProduct);

        dataContext.SaveChanges();
        productDto.Id = product.Id;

        return CreatedAtAction(nameof(GetProductById), new {  publisherID = publisherProduct.PublisherId, productID = publisherProduct.ProductID }, product);
    }

    [HttpPut]
    [Route("update/{publisherID}/{productID}")]
    public ActionResult<ProductDto> UpdateProduct(int publisherID, int productID, ProductDto productDto)
    {
        var products = dataContext.Set<Product>();
        var publisherProducts = dataContext.Set<PublisherProducts>();
        var publisherProduct = publisherProducts.FirstOrDefault(x => x.PublisherId == publisherID && x.ProductID == productID);
        if (publisherProduct != null)
        {
            var current = products.FirstOrDefault(x => x.Id == publisherProduct.ProductID);

            current.Name = productDto.Name;
            current.Price = productDto.Price;
            current.Description = productDto.Description;
            current.Tag = productDto.Tag;
            current.Genre = productDto.Genre;
            current.Disabled = productDto.Disabled;
            dataContext.SaveChanges();

            return Ok(productDto);

        }
        else
        {

            return NotFound();
        }
    }

    [HttpDelete("disable/{publisherID}/{productID}")]
    public ActionResult<ProductDto> DisableProduct(int publisherID, int productID)
    {

        var publisherProducts = dataContext.Set<PublisherProducts>();
        var products = dataContext.Set<Product>();
        var publisherProduct = publisherProducts.FirstOrDefault(x => x.PublisherId == publisherID && x.ProductID == productID);
        if (publisherProduct != null)
        {
            var product = products.FirstOrDefault(x => x.Id == publisherProduct.ProductID);
            product.Disabled = 1;

            dataContext.SaveChanges();

            return Ok();
        }


        return NotFound();
    }

    [HttpPost("enable/{publisherID}/{productID}")]
    public ActionResult<ProductDto> EnableProduct(int publisherID, int productID)
    {

        var publisherProducts = dataContext.Set<PublisherProducts>();
        var products = dataContext.Set<Product>();
        var publisherProduct = publisherProducts.FirstOrDefault(x => x.PublisherId == publisherID && x.ProductID == productID);
        if (publisherProduct != null)
        {
            var product = products.FirstOrDefault(x => x.Id == publisherProduct.ProductID);
            product.Disabled = 0;

            dataContext.SaveChanges();

            return Ok();
        }


        return NotFound();
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