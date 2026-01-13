using merxly.Application.DTOs.Common;
using merxly.Application.DTOs.StoreTransfer;
using merxly.Application.Interfaces.Repositories;
using merxly.Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace merxly.API.Controllers
{
    [Route("api/store/transactions")]
    [ApiController]
    [Authorize]
    public class StoreTransactionsController : BaseApiController
    {
        private readonly IStoreTransactionService _storeTransactionService;
        private readonly IStoreRepository _storeRepository;

        public StoreTransactionsController(
            IStoreTransactionService storeTransactionService,
            IStoreRepository storeRepository)
        {
            _storeTransactionService = storeTransactionService;
            _storeRepository = storeRepository;
        }

        /// <summary>
        /// Get paginated list of transactions for the authenticated store owner.
        /// Supports filtering by status, sub order number, date range, and amount range.
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<ResponseDto<PaginatedResultDto<StoreTransferDto>>>> GetStoreTransactions(
            [FromQuery] StoreTransferFilterDto filter,
            CancellationToken cancellationToken = default)
        {
            var storeId = await GetStoreIdForCurrentUserAsync(_storeRepository, cancellationToken);

            var result = await _storeTransactionService.GetStoreTransactionsAsync(storeId.Value, filter, cancellationToken);
            return OkResponse(result, "Transactions retrieved successfully");
        }

        /// <summary>
        /// Get detailed information about a specific transaction.
        /// </summary>
        [HttpGet("{transferId}")]
        public async Task<ActionResult<ResponseDto<StoreTransferDetailDto>>> GetStoreTransactionById(
            Guid transferId,
            CancellationToken cancellationToken = default)
        {
            var storeId = await GetStoreIdForCurrentUserAsync(_storeRepository, cancellationToken);

            var result = await _storeTransactionService.GetStoreTransactionByIdAsync(storeId.Value, transferId, cancellationToken);
            return OkResponse(result, "Transaction retrieved successfully");
        }
    }
}
