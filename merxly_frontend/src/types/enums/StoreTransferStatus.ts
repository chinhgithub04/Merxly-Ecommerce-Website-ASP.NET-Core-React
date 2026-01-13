export const StoreTransferStatus = {
  Pending: 0,
  Processing: 1,
  Completed: 2,
  Failed: 3,
  Cancelled: 4,
};

export type StoreTransferStatus =
  (typeof StoreTransferStatus)[keyof typeof StoreTransferStatus];
