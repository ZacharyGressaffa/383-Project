using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SP22.P05.Web.Features.Authorization;
using SP22.P05.Web.Features.Products;
using System.ComponentModel.DataAnnotations;

namespace SP22.P05.Web.Features.ShoppingCart
{
    public class UserProducts
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int UserID { get; set; }
        public virtual User? User { get; set; }

        [Required]
        public int ProductID { get; set; }
        public virtual Product? Product { get; set; }
        public int Disabled { get; set; }

    }

    public class PublisherProductsConfiguration : IEntityTypeConfiguration<UserProducts>
    {
        public void Configure(EntityTypeBuilder<UserProducts> builder)
        {
            builder.Property(x => x.UserID)
                .IsRequired();

            builder.Property(x => x.ProductID)
                .IsRequired();
        }
    }
}
