// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title ETH Vault
/// @notice A simple ETH vault where users can deposit and withdraw ETH.
/// @dev Candidate should implement deposit, withdraw, balanceOf, totalVaultBalance, and receive.
contract Vault {
    mapping(address => uint256) private balances;

    event Deposited(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);

    /// @notice Deposit ETH into the vault
    function deposit() external payable {
        // TODO: implement deposit logic
    }

    /// @notice Withdraw ETH from the vault
    /// @dev Must prevent reentrancy
    /// @param amount The amount to withdraw
    function withdraw(uint256 amount) external {
        // TODO: implement withdraw logic
    }

    /// @notice Get the ETH balance of a user
    function balanceOf(address user) external view returns (uint256) {
        // TODO: return user balance
    }

    /// @notice Get the total ETH balance in the vault
    function totalVaultBalance() external view returns (uint256) {
        // TODO: return contract balance
    }

    // TODO: implement auto-deposit logic or just accept ETH
    /// @notice Allow contract to receive ETH via transfer/call/send
}
