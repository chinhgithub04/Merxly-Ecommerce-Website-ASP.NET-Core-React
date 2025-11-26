using AutoMapper;
using merxly.Application.DTOs.Category;
using merxly.Application.DTOs.Common;
using merxly.Application.DTOs.Store;
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
            CreateMap<Category, ParentCategoryDto>()
                .ForMember(dest => dest.ImageUrl, opt => opt.MapFrom(src => 
                    CloudinaryUrlBuilder.BuildUrl(src.ImagePublicId)));

            CreateMap<Category, CategoryDto>()
                .ForMember(dest => dest.Children, opt => opt.MapFrom(src => src.SubCategories));

            CreateMap<Category, DetailCategoryDto>()
                .ForMember(dest => dest.ImageUrl, opt => opt.MapFrom(src => 
                    CloudinaryUrlBuilder.BuildUrl(src.ImagePublicId)));
            
            CreateMap<CreateCategoryDto, Category>();
            CreateMap<UpdateCategoryDto, Category>();

            // Store Mappings
            CreateMap<Store, DetailStoreDto>()
                .ForMember(dest => dest.OwnerName, opt => opt.MapFrom(src => 
                    $"{src.Owner.FirstName} {src.Owner.LastName}"));
            CreateMap<CreateStoreDto, Store>();
        }
    }
}
