// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "../interfaces/IPaymentHub.sol";

/// @title PaymentHub - Micropayment hub for Micromint L3
/// @notice Users deposit mUSD, then send tiny payments to merchants.
///         Merchants accumulate earnings and can withdraw in batches.
contract PaymentHub is IPaymentHub, ReentrancyGuard {
    address public immutable override microUSD;

    /// @inheritdoc IPaymentHub
    mapping(address => uint256) public override balances;

    /// @inheritdoc IPaymentHub
    mapping(address => uint256) public override merchantEarnings;

    /// @param _microUSD Address of the mUSD ERC20 token on Micromint L3
    constructor(address _microUSD) {
        require(_microUSD != address(0), "microUSD address is zero");
        microUSD = _microUSD;
    }

    // -----------------------------------------------------------------------
    // User actions
    // -----------------------------------------------------------------------

    /// @inheritdoc IPaymentHub
    function deposit(uint256 amount) external override nonReentrant {
        require(amount > 0, "amount = 0");

        // Pull mUSD from user into the hub
        bool ok = IERC20(microUSD).transferFrom(msg.sender, address(this), amount);
        require(ok, "transferFrom failed");

        balances[msg.sender] += amount;
        emit Deposited(msg.sender, amount);
    }

    /// @inheritdoc IPaymentHub
    function pay(address merchant, uint256 amount) external override nonReentrant {
        require(amount > 0, "amount = 0");
        require(merchant != address(0), "invalid merchant");
        require(balances[msg.sender] >= amount, "insufficient balance");

        // Move internal balance from user to merchant earnings
        balances[msg.sender] -= amount;
        merchantEarnings[merchant] += amount;

        emit Paid(msg.sender, merchant, amount);
    }

    // -----------------------------------------------------------------------
    // Merchant actions
    // -----------------------------------------------------------------------

    /// @inheritdoc IPaymentHub
    function withdraw(uint256 amount) external override nonReentrant {
        require(amount > 0, "amount = 0");
        require(merchantEarnings[msg.sender] >= amount, "not enough earnings");

        merchantEarnings[msg.sender] -= amount;

        bool ok = IERC20(microUSD).transfer(msg.sender, amount);
        require(ok, "transfer failed");

        emit Withdrawn(msg.sender, amount);
    }

    // -----------------------------------------------------------------------
    // View helpers (optional, helpful for frontend)
    // -----------------------------------------------------------------------

    /// @notice Returns a user's available balance and a merchant's earnings in one call
    function getAccountView(address account)
        external
        view
        returns (uint256 userBalance, uint256 earnings)
    {
        userBalance = balances[account];
        earnings = merchantEarnings[account];
    }
}
