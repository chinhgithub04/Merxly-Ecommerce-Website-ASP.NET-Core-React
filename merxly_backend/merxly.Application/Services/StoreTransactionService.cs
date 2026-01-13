using AutoMapper;
using merxly.Application.DTOs.Common;
using merxly.Application.DTOs.StoreTransfer;
using merxly.Application.Interfaces;
using merxly.Application.Interfaces.Services;
using merxly.Domain.Exceptions;
using Microsoft.Extensions.Logging;

namespace merxly.Application.Services
{
    public class StoreTransactionService : IStoreTransactionService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly ILogger<StoreTransactionService> _logger;

        public StoreTransactionService(
            IUnitOfWork unitOfWork,
            IMapper mapper,
            ILogger<StoreTransactionService> logger)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _logger = logger;
        }

        public async Task<PaginatedResultDto<StoreTransferDto>> GetStoreTransactionsAsync(
            Guid storeId,
            StoreTransferFilterDto filter,
            CancellationToken cancellationToken = default)
        {
            _logger.LogInformation("Getting transactions for store {StoreId} with filters: Status={Status}, SearchTerm={SearchTerm}, FromDate={FromDate}, ToDate={ToDate}, MinAmount={MinAmount}, MaxAmount={MaxAmount}, Page={Page}, PageSize={PageSize}",
                storeId, filter.Status, filter.SearchTerm, filter.FromDate, filter.ToDate, filter.MinAmount, filter.MaxAmount, filter.PageNumber, filter.PageSize);

            var result = await _unitOfWork.StoreTransfer.GetStoreTransactionsAsync(storeId, filter, cancellationToken);

            var paginatedResult = _mapper.Map<PaginatedResultDto<StoreTransferDto>>(result);

            _logger.LogInformation("Retrieved {Count} transactions for store {StoreId} (Page {Page}/{TotalPages})",
                paginatedResult.Items.Count, storeId, paginatedResult.PageNumber, paginatedResult.TotalPages);

            return paginatedResult;
        }

        public async Task<StoreTransferDetailDto> GetStoreTransactionByIdAsync(
            Guid storeId,
            Guid transferId,
            CancellationToken cancellationToken = default)
        {
            _logger.LogInformation("Getting transaction {TransferId} for store {StoreId}", transferId, storeId);

            var transfer = await _unitOfWork.StoreTransfer.GetStoreTransactionByIdAsync(storeId, transferId, cancellationToken);

            if (transfer == null)
            {
                _logger.LogWarning("Transaction {TransferId} not found for store {StoreId}", transferId, storeId);
                throw new NotFoundException($"Transaction with ID {transferId} not found.");
            }

            var dto = _mapper.Map<StoreTransferDetailDto>(transfer);

            _logger.LogInformation("Retrieved transaction {TransferId} for store {StoreId}", transferId, storeId);

            return dto;
        }
    }
}
