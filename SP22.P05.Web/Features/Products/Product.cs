using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SP22.P05.Web.Features.Authorization;
using SP22.P05.Web.Features.Sales;

namespace SP22.P05.Web.Features.Products;

public class Product
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string Tag { get; set; } = string.Empty;
    public string Genre { get; set; } = string.Empty;
    public string ImageURL { get; set; } = string.Empty;
    public int Disabled { get; set; }


    public virtual ICollection<SaleEventProduct> SaleEventProducts { get; set; } = new List<SaleEventProduct>();
}

public class ProductConfiguration : IEntityTypeConfiguration<Product>
{
    public void Configure(EntityTypeBuilder<Product> builder)
    {
        builder.Property(x => x.Name)
            .IsRequired()
            .HasMaxLength(120);

        builder.Property(x => x.Description)
            .IsRequired();
    }
}