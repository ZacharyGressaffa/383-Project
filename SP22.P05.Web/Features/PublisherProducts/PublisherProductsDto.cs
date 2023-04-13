using System.ComponentModel.DataAnnotations;

namespace SP22.P05.Web.Features.PublisherProducts
{
    public class PublisherProductsDto
    {
        [Required]
        public int Id { get; set; }

        [Required]
        public int PublisherId { get; set; }

        [Required, MinLength(1)]
        public int[] Products { get; set; } = Array.Empty<int>();

    }
}
