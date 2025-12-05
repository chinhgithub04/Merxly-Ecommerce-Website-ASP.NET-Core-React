using AutoMapper;
using merxly.Application.DTOs.Category;
using merxly.Application.DTOs.Common;
using merxly.Application.DTOs.Product;
using merxly.Application.DTOs.Product.Update;
using merxly.Application.DTOs.ProductAttribute;
using merxly.Application.DTOs.ProductAttribute.Update;
using merxly.Application.DTOs.ProductAttributeValue;
using merxly.Application.DTOs.ProductAttributeValue.Update;
using merxly.Application.DTOs.ProductVariant;
using merxly.Application.DTOs.ProductVariant.Update;
using merxly.Application.DTOs.ProductVariantMedia;
using merxly.Application.DTOs.ProductVariantMedia.Update;
using merxly.Application.DTOs.Store;
using merxly.Application.Interfaces.Services;
using merxly.Domain.Entities;
using merxly.Domain.Enums;

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
            CreateMap<UpdateCategoryDto, Category>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

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

            //CreateMap<Product, DetailProductDto>()
            //    .ForMember(dest => dest.MainMediaUrl, opt => opt.MapFrom(src =>
            //        _cloudinaryUrlService.GetMediumImageUrl(src.MainMediaPublicId)))
            //    .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category.Name))
            //    .ForMember(dest => dest.StoreName, opt => opt.MapFrom(src => src.Store.StoreName))
            //    .ForMember(dest => dest.StoreIsVerified, opt => opt.MapFrom(src => src.Store.IsVerified));

            CreateMap<Product, StoreDetailProductDto>()
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category.Name));

            CreateMap<CreateProductDto, Product>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(_ => Guid.NewGuid()));

            CreateMap<UpdateProductDto, Product>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

            CreateMap<Product, ResponseUpdateProductDto>();

            CreateMap<ToggleProductPlatformFeaturedDto, Product>();

            // ProductVariant Mappings
            CreateMap<ProductVariant, ProductVariantDto>();

            CreateMap<CreateProductVariantDto, ProductVariant>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(_ => Guid.NewGuid()));

            CreateMap<BulkUpdateVariantItemDto, ProductVariant>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

            CreateMap<ProductVariant, ResponseUpdateVariantItemDto>();

            // ProductAttribute Mappings
            CreateMap<ProductAttribute, ProductAttributeDto>();
            //CreateMap<ProductAttribute, DetailProductAttributeDto>()
            //    .ForMember(dest => dest.Values, opt => opt.MapFrom(src => src.ProductAttributeValues));
            CreateMap<CreateProductAttributeDto, ProductAttribute>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(_ => Guid.NewGuid()));

            CreateMap<UpdateProductAttributeDto, ProductAttribute>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

            CreateMap<BulkUpdateAttributeItemDto, ProductAttribute>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

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
            CreateMap<CreateProductVariantMediaDto, ProductVariantMedia>();

            CreateMap<BulkUpdateVariantMediaItemDto, ProductVariantMedia>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

            CreateMap<ProductVariantMedia, ResponseUpdateVariantMediaItemDto>()
                .ForMember(dest => dest.MediaUrl, opt => opt.MapFrom(src => 
                    src.MediaType == MediaType.Image 
                        ? _cloudinaryUrlService.GetThumbnailImageUrl(src.MediaPublicId)
                        : _cloudinaryUrlService.GetVideoUrl(src.MediaPublicId)));
        }
    }
}
