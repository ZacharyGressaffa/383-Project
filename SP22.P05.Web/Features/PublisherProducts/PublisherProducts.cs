using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SP22.P05.Web.Features.Authorization;
using SP22.P05.Web.Features.Products;
using System.ComponentModel.DataAnnotations;

namespace SP22.P05.Web.Features.PublisherProducts
{
    public class PublisherProducts
    {

        [Key]
        public int Id { get; set; }

        [Required]
        public int PublisherId { get; set; }
        public virtual User? Publisher { get; set; }

        [Required]
        public int ProductID { get; set; }
        public virtual Product? Product { get; set; }

    }

    public class PublisherProductsConfiguration : IEntityTypeConfiguration<PublisherProducts>
    {
        public void Configure(EntityTypeBuilder<PublisherProducts> builder)
        {
            builder.Property(x => x.PublisherId)
                .IsRequired();

            builder.Property(x => x.ProductID)
                .IsRequired();
        }
    }
}
