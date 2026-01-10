using AutoMapper;
using merxly.Application.DTOs.Cart;
using merxly.Application.DTOs.Category;
using merxly.Application.DTOs.Common;
using merxly.Application.DTOs.CustomerAddress;
using merxly.Application.DTOs.CustomerOrders;
using merxly.Application.DTOs.Order;
using merxly.Application.DTOs.Product;
using merxly.Application.DTOs.Product.Update;
using merxly.Application.DTOs.ProductAttribute;
using merxly.Application.DTOs.ProductAttribute.Update;
using merxly.Application.DTOs.ProductAttributeValue;
using merxly.Application.DTOs.ProductAttributeValue.Update;
using merxly.Application.DTOs.ProductVariant;
using merxly.Application.DTOs.ProductVariant.Update;
using merxly.Application.DTOs.ProductVariantAttributeValue;
using merxly.Application.DTOs.ProductVariantMedia;
using merxly.Application.DTOs.ProductVariantMedia.Update;
using merxly.Application.DTOs.Review;
using merxly.Application.DTOs.Store;
using merxly.Application.DTOs.StoreAddress;
using merxly.Application.DTOs.StorePayment;
using merxly.Application.DTOs.UserProfile;
using merxly.Application.DTOs.Wishlist;
using merxly.Application.Mappings.ValueResolvers;
using merxly.Domain.Constants;
using merxly.Domain.Entities;

namespace merxly.Application.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // Paginated Result Mapping
            CreateMap(typeof(PaginatedResultDto<>), typeof(PaginatedResultDto<>));

            // Category Mappings
            CreateMap<Category, ParentCategoryDto>();

            CreateMap<Category, CategoryDto>()
                .ForMember(dest => dest.Children, opt => opt.MapFrom(src => src.SubCategories));

            CreateMap<Category, CategoryForStoreDto>();

            CreateMap<Category, DetailCategoryDto>()
                .ForMember(dest => dest.ImageUrl, opt => opt.MapFrom<MediumImageUrlResolver<Category, DetailCategoryDto>, string?>(src => src.ImagePublicId));

            CreateMap<CreateCategoryDto, Category>();
            CreateMap<UpdateCategoryDto, Category>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

            // Store Mappings
            CreateMap<Store, DetailStoreDto>()
                .ForMember(dest => dest.OwnerName, opt => opt.MapFrom(src =>
                    $"{src.Owner.FirstName} {src.Owner.LastName}"));

            CreateMap<Store, StoreListItemDto>()
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src =>
                    src.IsVerified ? "Approved" :
                    string.IsNullOrWhiteSpace(src.RejectionReason) ? "Pending" : "Rejected"));

            CreateMap<Store, AdminStoreDetailDto>()
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src =>
                    src.IsVerified ? "Approved" :
                    string.IsNullOrWhiteSpace(src.RejectionReason) ? "Pending" : "Rejected"));

            CreateMap<CreateStoreDto, Store>();
            CreateMap<UpdateStoreDto, Store>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

            // Product Mappings
            CreateMap<Product, ProductDto>()
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category.Name));

            CreateMap<Product, ProductForStoreDto>()
                .ForMember(dest => dest.MainMediaUrl, opt => opt.MapFrom<ThumbnailImageUrlResolver<Product, ProductForStoreDto>, string?>(src => src.MainMediaPublicId))
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category.Name));

            CreateMap<Product, DetailProductDto>()
               .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category.Name))
               .ForMember(dest => dest.StoreName, opt => opt.MapFrom(src => src.Store.StoreName))
               .ForMember(dest => dest.StoreIsVerified, opt => opt.MapFrom(src => src.Store.IsVerified))
               .ForMember(dest => dest.StoreLogoPublicId, opt => opt.MapFrom(src => src.Store.LogoImagePublicId))
               .ForMember(dest => dest.ProductAttributes, opt => opt.MapFrom(src => src.ProductAttributes));

            CreateMap<Product, StoreDetailProductDto>()
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category.Name))
                .ForMember(dest => dest.ProductAttributes, opt => opt.MapFrom(src => src.ProductAttributes))
                .ForMember(dest => dest.Variants, opt => opt.MapFrom(src => src.Variants));

            CreateMap<CreateProductDto, Product>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(_ => Guid.NewGuid()))
                .ForMember(dest => dest.ProductAttributes, opt => opt.Ignore())
                .ForMember(dest => dest.Variants, opt => opt.Ignore());

            CreateMap<UpdateProductDto, Product>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

            CreateMap<Product, ResponseUpdateProductDto>();

            CreateMap<ToggleProductPlatformFeaturedDto, Product>();

            // ProductVariant Mappings
            CreateMap<ProductVariant, ProductVariantDto>()
                .ForMember(dest => dest.ProductAttributeValues, opt => opt.MapFrom(src =>
                    src.VariantAttributeValues.Select(vav => vav.ProductAttributeValue)))
                .ForMember(dest => dest.ProductVariantMedia, opt => opt.MapFrom(src => src.Media));

            CreateMap<ProductVariant, ProductVariantForCustomerDto>()
                .ForMember(dest => dest.ProductAttributeValues, opt => opt.MapFrom(src => src.VariantAttributeValues))
                .ForMember(dest => dest.ProductVariantMedia, opt => opt.MapFrom(src => src.Media));

            CreateMap<CreateProductVariantDto, ProductVariant>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(_ => Guid.NewGuid()))
                .ForMember(dest => dest.Media, opt => opt.Ignore());

            CreateMap<BulkUpdateVariantItemDto, ProductVariant>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

            CreateMap<ProductVariant, ResponseUpdateVariantItemDto>();

            // ProductVariantAttributeValue Mappings
            CreateMap<ProductVariantAttributeValue, ProductVariantAttributeValueDto>()
                .ForMember(dest => dest.Value, opt => opt.MapFrom(src => src.ProductAttributeValue.Value))
                .ForMember(dest => dest.DisplayOrder, opt => opt.MapFrom(src => src.ProductAttributeValue.DisplayOrder));

            // ProductAttribute Mappings
            CreateMap<ProductAttribute, ProductAttributeDto>()
                .ForMember(dest => dest.ProductAttributeValues, opt => opt.MapFrom(src => src.ProductAttributeValues));
            //CreateMap<ProductAttribute, DetailProductAttributeDto>()
            //    .ForMember(dest => dest.Values, opt => opt.MapFrom(src => src.ProductAttributeValues));
            CreateMap<CreateProductAttributeDto, ProductAttribute>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(_ => Guid.NewGuid()))
                .ForMember(dest => dest.ProductAttributeValues, opt => opt.Ignore());

            CreateMap<UpdateProductAttributeDto, ProductAttribute>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

            CreateMap<BulkUpdateAttributeItemDto, ProductAttribute>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

            CreateMap<ProductAttributeValue, ProductAttributeValueDto>();
            CreateMap<ProductAttribute, ResponseUpdateAttributeItemDto>();

            // ProductAttributeValue Mappings
            //CreateMap<ProductAttributeValue, ProductAttributeValueDto>()
            //    .ForMember(dest => dest.ProductAttributeName, opt => opt.MapFrom(src => src.ProductAttribute.Name));
            //CreateMap<ProductAttributeValue, DetailProductAttributeValueDto>();
            CreateMap<CreateProductAttributeValueDto, ProductAttributeValue>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(_ => Guid.NewGuid()));
            CreateMap<UpdateProductAttributeValueDto, ProductAttributeValue>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

            CreateMap<BulkUpdateAttributeValueItemDto, ProductAttributeValue>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

            CreateMap<ProductAttributeValue, ResponseUpdateAttributeValueItemDto>();

            // ProductVariantMedia Mappings
            CreateMap<ProductVariantMedia, ProductVariantMediaDto>();

            CreateMap<CreateProductVariantMediaDto, ProductVariantMedia>();

            CreateMap<BulkUpdateVariantMediaItemDto, ProductVariantMedia>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

            CreateMap<ProductVariantMedia, ResponseUpdateVariantMediaItemDto>()
                .ForMember(dest => dest.MediaUrl, opt => opt.MapFrom<ProductVariantMediaUrlResolver>());

            // Cart Mappings
            CreateMap<Cart, CartDto>()
                .ForMember(dest => dest.TotalItems, opt => opt.MapFrom(src => src.CartItems.Sum(ci => ci.Quantity)))
                .ForMember(dest => dest.Subtotal, opt => opt.MapFrom(src => src.CartItems.Sum(ci => ci.Quantity * ci.PriceAtAdd)));

            CreateMap<CartItem, CartItemDto>()
                .ForMember(dest => dest.ProductId, opt => opt.MapFrom(src => src.ProductVariant.ProductId))
                .ForMember(dest => dest.ProductName, opt => opt.MapFrom(src => src.ProductVariant.Name))
                .ForMember(dest => dest.StockQuantity, opt => opt.MapFrom(src => src.ProductVariant.StockQuantity))
                .ForMember(dest => dest.ProductImagePublicId, opt => opt.MapFrom(src =>
                    src.ProductVariant.Media.Where(pm => pm.IsMain).Select(pm => pm.MediaPublicId).FirstOrDefault()))
                .ForMember(dest => dest.SelectedAttributes, opt => opt.MapFrom(src => src.ProductVariant.VariantAttributeValues.ToDictionary(
                    pav => pav.ProductAttributeValue.ProductAttribute.Name,
                    pav => pav.ProductAttributeValue.Value
                )))
                .ForMember(dest => dest.IsAvailable, opt => opt.MapFrom(src => src.ProductVariant.IsActive && src.ProductVariant.StockQuantity > 0))
                .ForMember(dest => dest.StoreId, opt => opt.MapFrom(src => src.ProductVariant.Product.StoreId))
                .ForMember(dest => dest.StoreName, opt => opt.MapFrom(src => src.ProductVariant.Product.Store.StoreName));

            CreateMap<AddToCartDto, CartItem>();

            CreateMap<UpdateCartItemDto, CartItem>();

            // Wishlist Mappings
            CreateMap<Wishlist, WishlistDto>()
                .ForMember(dest => dest.TotalItems, opt => opt.MapFrom(src => src.WishlistItems.Count));

            CreateMap<WishlistItem, WishlistItemDto>()
                .ForMember(dest => dest.ProductName, opt => opt.MapFrom(src => src.ProductVariant.Name))
                .ForMember(dest => dest.Price, opt => opt.MapFrom(src =>
                    src.ProductVariant.Price))
                .ForMember(dest => dest.ProductImagePublicId, opt => opt.MapFrom(src =>
                    src.ProductVariant.Media.Where(pm => pm.IsMain).Select(pm => pm.MediaPublicId).FirstOrDefault()))
                .ForMember(dest => dest.SelectedAttributes, opt => opt.MapFrom(src =>
                    src.ProductVariant != null
                        ? src.ProductVariant.VariantAttributeValues.ToDictionary(
                            pav => pav.ProductAttributeValue.ProductAttribute.Name,
                            pav => pav.ProductAttributeValue.Value)
                        : new Dictionary<string, string>()))
                .ForMember(dest => dest.IsAvailable, opt => opt.MapFrom(src =>
                    src.ProductVariant.IsActive && src.ProductVariant.StockQuantity > 0));

            CreateMap<AddToWishlistDto, WishlistItem>();

            // Customer Address Mappings
            CreateMap<Address, CustomerAddressDto>()
                .ForMember(dest => dest.FullAddress, opt => opt.MapFrom(src =>
                    $"{src.AddressLine}, {src.WardName}, {src.CityName}"));

            CreateMap<CreateCustomerAddressDto, Address>();

            CreateMap<UpdateCustomerAddressDto, Address>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

            // Store Address Mappings
            CreateMap<StoreAddress, StoreAddressDto>()
                .ForMember(dest => dest.FullAddress, opt => opt.MapFrom(src =>
                    $"{src.AddressLine}, {src.WardName}, {src.CityName}"));

            CreateMap<CreateStoreAddressDto, StoreAddress>();

            CreateMap<UpdateStoreAddressDto, StoreAddress>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

            // Order Mappings
            CreateMap<Order, OrderDto>();

            CreateMap<SubOrder, SubOrderDto>()
                .ForMember(dest => dest.StoreName, opt => opt.MapFrom(src => src.Store.StoreName))
                .ForMember(dest => dest.OrderItems, opt => opt.MapFrom(src => src.OrderItems));

            CreateMap<SubOrder, StoreSubOrderDto>()
                .ForMember(dest => dest.SubOrderNumber, opt => opt.MapFrom(src => src.SubOrderNumber))
                .ForMember(dest => dest.CustomerFullName, opt => opt.MapFrom(src =>
                    $"{src.Order.User.FirstName} {src.Order.User.LastName}"))
                .ForMember(dest => dest.CustomerEmail, opt => opt.MapFrom(src => src.Order.User.Email))
                .ForMember(dest => dest.TotalItems, opt => opt.MapFrom(src => src.OrderItems.Sum(oi => oi.Quantity)));

            CreateMap<SubOrder, StoreSubOrderDetailDto>()
                .ForMember(dest => dest.SubOrderNumber, opt => opt.MapFrom(src => src.SubOrderNumber))
                .ForMember(dest => dest.CustomerFullName, opt => opt.MapFrom(src =>
                    $"{src.Order.ShippingAddress.FullName}"))
                .ForMember(dest => dest.CustomerEmail, opt => opt.MapFrom(src => src.Order.User.Email))
                .ForMember(dest => dest.CustomerFullAddress, opt => opt.MapFrom(src =>
                    $"{src.Order.ShippingAddress.AddressLine}, {src.Order.ShippingAddress.WardName}, {src.Order.ShippingAddress.CityName}"))
                .ForMember(dest => dest.CustomerPostalCode, opt => opt.MapFrom(src => src.Order.ShippingAddress.PostalCode))
                .ForMember(dest => dest.CustomerPhoneNumber, opt => opt.MapFrom(src => src.Order.ShippingAddress.PhoneNumber));

            // Customer Order Mappings
            CreateMap<SubOrder, CustomerSubOrderDto>()
                .ForMember(dest => dest.TotalItems, opt => opt.MapFrom(src => src.OrderItems.Sum(oi => oi.Quantity)));

            CreateMap<SubOrder, CustomerSubOrderDetailDto>()
                .ForMember(dest => dest.StoreId, opt => opt.MapFrom(src => src.StoreId))
                .ForMember(dest => dest.StoreName, opt => opt.MapFrom(src => src.Store.StoreName))
                .ForMember(dest => dest.StoreLogoImagePublicId, opt => opt.MapFrom(src => src.Store.LogoImagePublicId))
                .ForMember(dest => dest.StoreBannerImagePublicId, opt => opt.MapFrom(src => src.Store.BannerImagePublicId))
                .ForMember(dest => dest.StoreEmail, opt => opt.MapFrom(src => src.Store.Email))
                .ForMember(dest => dest.StorePhoneNumber, opt => opt.MapFrom(src => src.Store.PhoneNumber))
                .ForMember(dest => dest.StoreFullAddress, opt => opt.MapFrom(src =>
                    $"{src.Store.Address.AddressLine}, {src.Store.Address.WardName}, {src.Store.Address.CityName}"))
                .ForMember(dest => dest.StorePostalCode, opt => opt.MapFrom(src => src.Store.Address.PostalCode))
                .ForMember(dest => dest.ShippingFullAddress, opt => opt.MapFrom(src =>
                    $"{src.Order.ShippingAddress.AddressLine}, {src.Order.ShippingAddress.WardName}, {src.Order.ShippingAddress.CityName}"))
                .ForMember(dest => dest.ShippingPostalCode, opt => opt.MapFrom(src => src.Order.ShippingAddress.PostalCode))
                .ForMember(dest => dest.ShippingPhoneNumber, opt => opt.MapFrom(src => src.Order.ShippingAddress.PhoneNumber))
                .ForMember(dest => dest.CustomerFullName, opt => opt.MapFrom(src =>
                    $"{src.Order.ShippingAddress.FullName}"))
                .ForMember(dest => dest.CustomerEmail, opt => opt.MapFrom(src => src.Order.User.Email));

            CreateMap<OrderItem, OrderItemDto>()
                .ForMember(dest => dest.StoreName, opt => opt.MapFrom(src => src.Store.StoreName));
            CreateMap<OrderItem, StoreOrderItemDto>()
                .ForMember(dest => dest.ProductVariantName, opt => opt.MapFrom(src => src.ProductVariant.Name))
                .ForMember(dest => dest.ProductVariantSKU, opt => opt.MapFrom(src => src.ProductVariant.SKU))
                .ForMember(dest => dest.ProductVariantMainPublicId, opt => opt.MapFrom(src => src.ProductVariant.Media
                    .Where(m => m.IsMain)
                    .Select(m => m.MediaPublicId)
                    .FirstOrDefault()))
                .ForMember(dest => dest.SelectedAttributes, opt => opt.MapFrom(src => src.ProductVariant.VariantAttributeValues.ToDictionary(
                    pav => pav.ProductAttributeValue.ProductAttribute.Name,
                    pav => pav.ProductAttributeValue.Value
                )));

            CreateMap<ProductVariant, ProductVariantSummaryDto>()
                .ForMember(dest => dest.ProductName, opt => opt.MapFrom(src => src.Product.Name))
                .ForMember(dest => dest.AttributeValues, opt => opt.MapFrom(src =>
                    src.VariantAttributeValues.Select(vav => vav.ProductAttributeValue.Value).ToList()))
                .ForMember(dest => dest.MainMediaUrl, opt => opt.MapFrom(src =>
                    src.Media.Where(m => m.IsMain).Select(m => m.MediaPublicId).FirstOrDefault()));

            CreateMap<Address, ShippingAddressDto>();

            CreateMap<OrderStatusHistory, OrderStatusHistoryDto>()
                .ForMember(dest => dest.ChangedBy, opt => opt.MapFrom(src =>
                    src.UpdatedByUser == null ? OrderChangedBy.StoreOwner : OrderChangedBy.Customer));

            // Payment Mappings
            CreateMap<Payment, PaymentDto>()
                .ForMember(dest => dest.ClientSecret, opt => opt.Ignore()); // Client secret is set separately

            // Store Payment Mappings
            CreateMap<Store, StorePaymentAccountDto>();

            // Review Mappings
            CreateMap<ReviewMedia, ReviewMediaDto>();

            CreateMap<Review, ReviewDto>()
                .ForMember(dest => dest.UserName, opt => opt.MapFrom(src =>
                    $"{src.User.FirstName} {src.User.LastName}"))
                .ForMember(dest => dest.ProductVariantSelected, opt => opt.MapFrom(src =>
                    string.Join(", ", src.ProductVariant.VariantAttributeValues.Select(vav =>
                            $"{vav.ProductAttributeValue.ProductAttribute.Name}: {vav.ProductAttributeValue.Value}"))))
                .ForMember(dest => dest.UserAvatarPublicId, opt => opt.MapFrom(src => src.User.AvatarPublicId));

            CreateMap<CreateReviewDto, Review>();
            CreateMap<CreateReviewMediaDto, ReviewMedia>();

            // User Profile Mappings
            CreateMap<ApplicationUser, UserProfileDto>();
            CreateMap<UpdateUserProfileDto, ApplicationUser>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
        }
    }
}
