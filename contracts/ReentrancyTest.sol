// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./Vault.sol";

/// @notice Contract to test Vault reentrancy safety
contract ReentrancyTest {
    Vault private immutable vault;
    address private owner;
    bool private loopInProgress;

    constructor(address payable _vault) {
        vault = Vault(_vault);
        owner = msg.sender;
    }

    /// @notice Start the test by depositing ETH and then calling withdraw
    function test(bool infiniteLoop) external payable {
        require(msg.sender == owner, "Not owner");
        require(msg.value > 0, "Need ETH");
        loopInProgress = infiniteLoop;
        vault.deposit{value: msg.value}();
        vault.withdraw(msg.value);
    }

    /// @notice Fallback gets triggered when Vault sends ETH back
    receive() external payable {
        if (loopInProgress && address(vault).balance >= msg.value) {
            vault.withdraw(msg.value);
        }
    }

    /// @notice Allow owner to withdraw ETH
    function collect() external {
        require(msg.sender == owner, "Not owner");
        payable(owner).transfer(address(this).balance);
    }
}
