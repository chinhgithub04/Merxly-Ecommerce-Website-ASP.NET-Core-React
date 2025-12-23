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
using merxly.Application.Mappings.ValueResolvers;
using merxly.Domain.Entities;
using merxly.Domain.Enums;

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
            CreateMap<CreateStoreDto, Store>();

            // Product Mappings
            CreateMap<Product, ProductDto>()
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category.Name));

            CreateMap<Product, ProductForStoreDto>()
                .ForMember(dest => dest.MainMediaUrl, opt => opt.MapFrom<ThumbnailImageUrlResolver<Product, ProductForStoreDto>, string?>(src => src.MainMediaPublicId))
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category.Name));

            //CreateMap<Product, DetailProductDto>()
            //    .ForMember(dest => dest.MainMediaUrl, opt => opt.MapFrom(src =>
            //        _cloudinaryUrlService.GetMediumImageUrl(src.MainMediaPublicId)))
            //    .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category.Name))
            //    .ForMember(dest => dest.StoreName, opt => opt.MapFrom(src => src.Store.StoreName))
            //    .ForMember(dest => dest.StoreIsVerified, opt => opt.MapFrom(src => src.Store.IsVerified));

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

            CreateMap<CreateProductVariantDto, ProductVariant>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(_ => Guid.NewGuid()))
                .ForMember(dest => dest.Media, opt => opt.Ignore());

            CreateMap<BulkUpdateVariantItemDto, ProductVariant>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

            CreateMap<ProductVariant, ResponseUpdateVariantItemDto>();

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
        }
    }
}
