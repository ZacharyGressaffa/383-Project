using System.ComponentModel.DataAnnotations;

namespace SP22.P05.Web.Features.ShoppingCart
{
    public class UserProductsDto
    {      
        [Required]
        public int Id { get; set; }

        [Required]
        public int UserID { get; set; }

        [Required, MinLength(1)]
        public int[] Products { get; set; } = Array.Empty<int>();
        public int Disabled { get; set; }

    }
}
