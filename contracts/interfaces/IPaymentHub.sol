// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title IPaymentHub - Interface for the Micromint L3 Payment Hub
interface IPaymentHub {
    /// @notice Emitted when a user deposits mUSD into the hub
    event Deposited(address indexed user, uint256 amount);

    /// @notice Emitted when a user pays a merchant
    event Paid(address indexed from, address indexed to, uint256 amount);

    /// @notice Emitted when a merchant withdraws earnings
    event Withdrawn(address indexed merchant, uint256 amount);

    /// @notice Address of the mUSD token used in the hub
    function microUSD() external view returns (address);

    /// @notice Balance of a user inside the hub (deposited but not yet spent)
    function balances(address user) external view returns (uint256);

    /// @notice Earnings accumulated for a merchant (from payments)
    function merchantEarnings(address merchant) external view returns (uint256);

    /// @notice Deposit mUSD from msg.sender into the hub
    /// @dev Caller must approve the hub to spend mUSD before calling
    function deposit(uint256 amount) external;

    /// @notice Pay a merchant using deposited balance
    /// @param merchant The merchant address receiving the payment
    /// @param amount Amount of mUSD to pay
    function pay(address merchant, uint256 amount) external;

    /// @notice Withdraw accumulated merchant earnings from the hub
    /// @param amount Amount of mUSD to withdraw
    function withdraw(uint256 amount) external;
}
