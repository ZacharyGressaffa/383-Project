using System.ComponentModel.DataAnnotations;

namespace SP22.P05.Web.Features.Sales;

public class SaleEventProductDto
{
    [Range(0.00, double.MaxValue)]
    public decimal SaleEventPrice { get; set; }
}