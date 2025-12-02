using AutoMapper;
using merxly.Application.DTOs.Category;
using merxly.Application.DTOs.Common;
using merxly.Application.DTOs.Product;
using merxly.Application.DTOs.ProductAttribute;
using merxly.Application.DTOs.ProductAttributeValue;
using merxly.Application.DTOs.ProductVariant;
using merxly.Application.DTOs.Store;
using merxly.Application.Interfaces.Services;
using merxly.Domain.Entities;

namespace merxly.Application.Mappings
{
    public class MappingProfile : Profile
    {
        private readonly ICloudinaryUrlService _cloudinaryUrlService;

        public MappingProfile(ICloudinaryUrlService cloudinaryUrlService)
        {
            _cloudinaryUrlService = cloudinaryUrlService;

            // Paginated Result Mapping
            CreateMap(typeof(PaginatedResultDto<>), typeof(PaginatedResultDto<>));

            // Category Mappings
            CreateMap<Category, ParentCategoryDto>()
                .ForMember(dest => dest.ImageUrl, opt => opt.MapFrom(src => 
                    _cloudinaryUrlService.GetThumbnailImageUrl(src.ImagePublicId)));

            CreateMap<Category, CategoryDto>()
                .ForMember(dest => dest.Children, opt => opt.MapFrom(src => src.SubCategories));

            CreateMap<Category, DetailCategoryDto>()
                .ForMember(dest => dest.ImageUrl, opt => opt.MapFrom(src => 
                    _cloudinaryUrlService.GetMediumImageUrl(src.ImagePublicId)));
            
            CreateMap<CreateCategoryDto, Category>();
            CreateMap<UpdateCategoryDto, Category>();

            // Store Mappings
            CreateMap<Store, DetailStoreDto>()
                .ForMember(dest => dest.OwnerName, opt => opt.MapFrom(src => 
                    $"{src.Owner.FirstName} {src.Owner.LastName}"));
            CreateMap<CreateStoreDto, Store>();

            // Product Mappings
            CreateMap<Product, ProductDto>()
                .ForMember(dest => dest.MainMediaUrl, opt => opt.MapFrom(src =>
                    _cloudinaryUrlService.GetThumbnailImageUrl(src.MainMediaPublicId)))
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category.Name));

            CreateMap<Product, DetailProductDto>()
                .ForMember(dest => dest.MainMediaUrl, opt => opt.MapFrom(src =>
                    _cloudinaryUrlService.GetMediumImageUrl(src.MainMediaPublicId)))
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category.Name))
                .ForMember(dest => dest.StoreName, opt => opt.MapFrom(src => src.Store.StoreName))
                .ForMember(dest => dest.StoreIsVerified, opt => opt.MapFrom(src => src.Store.IsVerified));

            CreateMap<CreateProductDto, Product>();
            CreateMap<UpdateProductDto, Product>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

            CreateMap<ToggleProductPlatformFeaturedDto, Product>();

            // ProductVariant Mappings
            CreateMap<ProductVariant, ProductVariantDto>();

            // ProductAttribute Mappings
            CreateMap<ProductAttribute, ProductAttributeDto>();
            //CreateMap<ProductAttribute, DetailProductAttributeDto>()
            //    .ForMember(dest => dest.Values, opt => opt.MapFrom(src => src.ProductAttributeValues));
            CreateMap<CreateProductAttributeDto, ProductAttribute>();
            CreateMap<UpdateProductAttributeDto, ProductAttribute>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

            // ProductAttributeValue Mappings
            CreateMap<ProductAttributeValue, ProductAttributeValueDto>()
                .ForMember(dest => dest.ProductAttributeName, opt => opt.MapFrom(src => src.ProductAttribute.Name));
            CreateMap<ProductAttributeValue, DetailProductAttributeValueDto>();
            CreateMap<CreateProductAttributeValueDto, ProductAttributeValue>();
            CreateMap<UpdateProductAttributeValueDto, ProductAttributeValue>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
        }
    }
}
