using AutoMapper;
using merxly.Application.DTOs.Common;
using merxly.Application.DTOs.Order;
using merxly.Application.Interfaces;
using merxly.Application.Interfaces.Services;
using merxly.Domain.Entities;
using merxly.Domain.Enums;
using merxly.Domain.Exceptions;
using Microsoft.Extensions.Logging;

namespace merxly.Application.Services
{
    public class StoreOrderService : IStoreOrderService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly ILogger<StoreOrderService> _logger;

        public StoreOrderService(
            IUnitOfWork unitOfWork,
            IMapper mapper,
            ILogger<StoreOrderService> logger)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _logger = logger;
        }

        public async Task<PaginatedResultDto<StoreSubOrderDto>> GetStoreOrdersAsync(
            Guid storeId,
            StoreSubOrderFilterDto filter,
            CancellationToken cancellationToken = default)
        {
            _logger.LogInformation("Getting orders for store {StoreId} with filters: Status={Status}, SearchTerm={SearchTerm}, FromDate={FromDate}, ToDate={ToDate}, Page={Page}, PageSize={PageSize}",
                storeId, filter.Status, filter.SearchTerm, filter.FromDate, filter.ToDate, filter.PageNumber, filter.PageSize);

            var result = await _unitOfWork.SubOrder.GetStoreOrdersAsync(storeId, filter, cancellationToken);

            var paginatedResult = _mapper.Map<PaginatedResultDto<StoreSubOrderDto>>(result);

            _logger.LogInformation("Retrieved {Count} orders for store {StoreId} (Page {Page}/{TotalPages})",
                paginatedResult.Items.Count, storeId, paginatedResult.PageNumber, paginatedResult.TotalPages);

            return paginatedResult;
        }

        public async Task<StoreSubOrderDetailDto> GetStoreOrderByIdAsync(
            Guid storeId,
            Guid subOrderId,
            CancellationToken cancellationToken = default)
        {
            _logger.LogInformation("Getting sub-order {SubOrderId} for store {StoreId}", subOrderId, storeId);

            var subOrder = await _unitOfWork.SubOrder.GetByIdWithDetailsAsync(subOrderId, cancellationToken);

            if (subOrder == null)
            {
                _logger.LogWarning("Sub-order {SubOrderId} not found", subOrderId);
                throw new NotFoundException($"Sub-order with ID {subOrderId} not found.");
            }

            if (subOrder.StoreId != storeId)
            {
                _logger.LogWarning("Sub-order {SubOrderId} does not belong to store {StoreId}", subOrderId, storeId);
                throw new ForbiddenAccessException("You don't have permission to access this order.");
            }

            if (subOrder.Status < OrderStatus.Confirmed)
            {
                _logger.LogWarning("Sub-order {SubOrderId} has status {Status} which is not visible to stores", subOrderId, subOrder.Status);
                throw new ForbiddenAccessException("This order is not yet confirmed.");
            }

            var dto = _mapper.Map<StoreSubOrderDetailDto>(subOrder);

            _logger.LogInformation("Retrieved sub-order {SubOrderId} for store {StoreId}", subOrderId, storeId);

            return dto;
        }

        public async Task<StoreSubOrderDetailDto> UpdateSubOrderStatusAsync(
            Guid storeId,
            Guid subOrderId,
            UpdateSubOrderStatusDto dto,
            CancellationToken cancellationToken = default)
        {
            _logger.LogInformation("Updating sub-order {SubOrderId} status to {NewStatus} for store {StoreId}",
                subOrderId, dto.Status, storeId);

            var subOrder = await _unitOfWork.SubOrder.GetByIdWithDetailsAsync(subOrderId, cancellationToken);

            if (subOrder == null)
            {
                _logger.LogWarning("Sub-order {SubOrderId} not found", subOrderId);
                throw new NotFoundException($"Sub-order with ID {subOrderId} not found.");
            }

            if (subOrder.StoreId != storeId)
            {
                _logger.LogWarning("Sub-order {SubOrderId} does not belong to store {StoreId}", subOrderId, storeId);
                throw new ForbiddenAccessException("You don't have permission to update this order.");
            }

            // Validate status transition
            ValidateStatusTransition(subOrder.Status, dto.Status);

            var oldStatus = subOrder.Status;
            subOrder.Status = dto.Status;

            // Update optional fields
            if (!string.IsNullOrWhiteSpace(dto.Carrier))
            {
                subOrder.Carrier = dto.Carrier;
            }

            if (!string.IsNullOrWhiteSpace(dto.TrackingNumber))
            {
                subOrder.TrackingNumber = dto.TrackingNumber;
            }

            // Record status change in history
            var statusHistory = new OrderStatusHistory
            {
                Id = Guid.NewGuid(),
                SubOrderId = subOrderId,
                Status = dto.Status,
                Notes = dto.Notes,
                UpdatedByUserId = storeId.ToString(),
            };

            _unitOfWork.SubOrder.Update(subOrder);
            await _unitOfWork.OrderStatusHistory.AddAsync(statusHistory, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Updated sub-order {SubOrderId} status from {OldStatus} to {NewStatus}",
                subOrderId, oldStatus, dto.Status);

            // Reload with details
            subOrder = await _unitOfWork.SubOrder.GetByIdWithDetailsAsync(subOrderId, cancellationToken);
            return _mapper.Map<StoreSubOrderDetailDto>(subOrder!);
        }

        private void ValidateStatusTransition(OrderStatus currentStatus, OrderStatus newStatus)
        {
            // Store cannot see or modify orders before Confirmed
            if (currentStatus < OrderStatus.Confirmed)
            {
                _logger.LogWarning("Cannot update order with status {CurrentStatus} - not yet confirmed", currentStatus);
                throw new BadRequestException("Cannot update order that is not yet confirmed.");
            }

            // Store cannot set Pending status
            if (newStatus == OrderStatus.Pending)
            {
                _logger.LogWarning("Store cannot set status to Pending");
                throw new BadRequestException("Invalid status transition to Pending.");
            }

            // Store cannot set Failed or Refunded
            if (newStatus == OrderStatus.Failed || newStatus == OrderStatus.Refunded)
            {
                _logger.LogWarning("Store cannot set status to {NewStatus}", newStatus);
                throw new BadRequestException($"Invalid status transition to {newStatus}.");
            }

            // Store cannot set Completed (user action)
            if (newStatus == OrderStatus.Completed)
            {
                _logger.LogWarning("Store cannot set status to Completed - this is a user action");
                throw new BadRequestException("Only customers can mark orders as Completed.");
            }

            // Store can only cancel when status is Confirmed
            if (newStatus == OrderStatus.Cancelled)
            {
                if (currentStatus != OrderStatus.Confirmed)
                {
                    _logger.LogWarning("Cannot cancel order with status {CurrentStatus} - can only cancel when Confirmed", currentStatus);
                    throw new BadRequestException("Can only cancel orders that are in Confirmed status.");
                }
                return;
            }

            // No-op if status hasn't changed
            if (currentStatus == newStatus)
            {
                _logger.LogInformation("Status unchanged at {CurrentStatus}", currentStatus);
                return;
            }

            // Validate forward progression: Confirmed -> Processing -> Delivering -> Shipped
            var allowedTransitions = new Dictionary<OrderStatus, List<OrderStatus>>
            {
                { OrderStatus.Confirmed, new List<OrderStatus> { OrderStatus.Processing, OrderStatus.Cancelled } },
                { OrderStatus.Processing, new List<OrderStatus> { OrderStatus.Delivering } },
                { OrderStatus.Delivering, new List<OrderStatus> { OrderStatus.Shipped } },
                { OrderStatus.Shipped, new List<OrderStatus>() } // No further transitions allowed by store
            };

            if (!allowedTransitions.ContainsKey(currentStatus))
            {
                _logger.LogWarning("Invalid current status {CurrentStatus}", currentStatus);
                throw new BadRequestException($"Cannot update order from status {currentStatus}.");
            }

            if (!allowedTransitions[currentStatus].Contains(newStatus))
            {
                _logger.LogWarning("Invalid status transition from {CurrentStatus} to {NewStatus}", currentStatus, newStatus);
                throw new BadRequestException($"Cannot transition from {currentStatus} to {newStatus}. Allowed transitions: {string.Join(", ", allowedTransitions[currentStatus])}");
            }
        }
    }
}
