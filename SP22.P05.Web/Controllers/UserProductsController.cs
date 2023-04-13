using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SP22.P05.Web.Data;
using SP22.P05.Web.Features.Authorization;
using SP22.P05.Web.Features.Products;
using SP22.P05.Web.Features.ShoppingCart;

namespace SP22.P05.Web.Controllers;

[Route("api/user/products")]
[ApiController]
public class UserProductsController : ControllerBase
{
    private readonly DataContext dataContext;
    public static List<int> cart = new List<int>();

    public UserProductsController(DataContext dataContext)
    {
        this.dataContext = dataContext;
    }

    [HttpGet]
    [Route("{userID}/all")]
    public List<ProductDto> GetAllProducts(int userID)
    {
        var userProducts = dataContext.Set<UserProducts>();
        var products = dataContext.Set<Product>();
        var userProduct = userProducts.Where(x => x.UserID == userID).ToArray();
        var productList = new List<ProductDto>();
        if(userProduct != null)
        {
            foreach (var product in userProduct)
            {
                productList.Add(GetProductDtos(products).FirstOrDefault(x => x.Id == product.ProductID));
            }
        }
        
        return productList;
    }

    

    [HttpGet]
    [Route("{userID}/active")]
    public List<ProductDto> GetActiveProducts(int userID)
    {
        var userProducts = dataContext.Set<UserProducts>();
        var products = dataContext.Set<Product>();
        var userProduct = userProducts.Where(x => x.UserID == userID).ToArray();
        var productList = new List<ProductDto>();
        if (userProduct != null)
        {
            foreach (var product in userProduct)
            {
                    var tempProduct = GetProductDtos(products).FirstOrDefault(x => x.Id == product.ProductID);
                    if (product.Disabled != 1)
                    {
                        productList.Add(tempProduct);
                    }
            }
        }

        return productList;
    }

    [HttpGet]
    [Route("{userID}/inactive")]
    public List<ProductDto> GetInctiveProducts(int userID)
    {
        var userProducts = dataContext.Set<UserProducts>();
        var products = dataContext.Set<Product>();
        var userProduct = userProducts.Where(x => x.UserID == userID).ToArray();
        var productList = new List<ProductDto>();
        if (userProduct != null)
        {
            foreach (var product in userProduct)
            {
                var tempProduct = GetProductDtos(products).FirstOrDefault(x => x.Id == product.ProductID);
                if (product.Disabled == 1)
                {
                    productList.Add(tempProduct);
                }
            }
        }

        return productList;
    }

    [HttpGet]
    [Route("{userID}/{productID}")]
    public ActionResult<ProductDto> GetProductById(int userID, int productID)
    {
        var userProducts = dataContext.Set<UserProducts>();
        var userProduct = userProducts.FirstOrDefault(x => x.UserID == userID && x.ProductID == productID);
        if (userProduct != null)
        {
            var products = dataContext.Set<Product>();
            var result = GetProductDtos(products).FirstOrDefault(x => x.Id == productID);
            if (result == null)
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
    [Route("checkout")]
    public ActionResult<UserProductsDto> Checkout(UserProductsDto userProductsDto)
    {
        var userProducts = dataContext.Set<UserProducts>();
        var userProductList = userProducts.Where(x => x.UserID == userProductsDto.UserID).ToArray();
        foreach (var productID in userProductsDto.Products)
        {
            var product = userProductList.Where(x => x.UserID == userProductsDto.UserID && x.ProductID == productID).FirstOrDefault();
            if (product == null) { 

            var userProduct = new UserProducts
            {
                UserID = userProductsDto.UserID,
                ProductID = productID,
                Disabled = 0
            };

            dataContext.Add(userProduct);
            userProductsDto.Id = userProduct.Id;
            }
        }
                
        dataContext.SaveChanges();

        return CreatedAtAction(nameof(GetProductById), new { userID = userProductsDto.UserID, productID = userProductsDto.Id}, userProductsDto);
    }

    [HttpDelete("disable/{userID}/{productID}")]
    public ActionResult<ProductDto> DisableProduct(int userID, int productID)
    {

        var userProducts = dataContext.Set<UserProducts>();
        var current = userProducts.FirstOrDefault(x => x.UserID == userID && x.ProductID == productID);
        if (current == null)
        {
            return NotFound();
        }

        current.Disabled = 1;
        dataContext.SaveChanges();

        return Ok(current);
    }

    [HttpPost("enable/{userID}/{productID}")]
    public ActionResult<ProductDto> EnableProduct(int userID, int productID)
    {

        var userProducts = dataContext.Set<UserProducts>();
        var current = userProducts.FirstOrDefault(x => x.UserID == userID && x.ProductID == productID);
        if (current == null)
        {
            return NotFound();
        }

        current.Disabled = 0;
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
