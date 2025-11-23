// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title MicroUSD - Test stablecoin for micropayments on Micromint L3
/// @notice Simple ERC20 token with 6 decimals, mintable by owner (for test/demo)
contract MicroUSD is ERC20, Ownable {
    /// @dev Constructor mints initial supply to deployer for convenience
    constructor() ERC20("Micro USD", "mUSD") Ownable(msg.sender) {
        // 1,000,000 mUSD with 6 decimals (1e6 * 1e6 = 1e12 units)
        _mint(msg.sender, 1_000_000 * 10 ** uint256(decimals()));
    }

    /// @notice Mint new tokens (for faucet / testing)
    /// @param to Address to receive the newly minted tokens
    /// @param amount Amount in token units (remember 6 decimals)
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    /// @notice Override to set decimals to 6 (like USDC)
    function decimals() public pure override returns (uint8) {
        return 6;
    }
}
