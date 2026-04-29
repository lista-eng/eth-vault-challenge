# ETH Vault Challenge

This is a Solidity coding challenge.  
You need to **implement the ETH Vault contract** so that all the provided unit tests pass.

---

## 📌 Goal

Implement the contract logic in **`contracts/Vault.sol`**:

- `deposit()` – allow users to deposit ETH
- `withdraw(uint256 amount)` – allow users to withdraw their ETH (prevent reentrancy)
- `balanceOf(address)` – return user’s balance
- `totalVaultBalance()` – return total ETH in the vault
- allow the contract to receive ETH directly

Events:

- `Deposited(address user, uint256 amount)`
- `Withdrawn(address user, uint256 amount)`

---

## 🧪 Tests

Tests are already written in **`test/Vault.test.ts`**.  
They check:

- Deposits via `deposit()`
- Deposits via raw ETH transfer (`receive()`)
- Withdrawals and balance updates
- Preventing withdrawals beyond balance
- Protection against **reentrancy attacks** (an `ReentrancyTest.sol` contract is included)

✅ Your implementation must pass all tests.

---

## 🚀 Getting Started

1. Install dependencies

```bash
npm install
# or
pnpm install
```

2. Run the test suite

```bash
npm test
# or
pnpm test
```

---

## 📂 Project Structure

```
contracts/
  Vault.sol        <-- implement this file (stub provided)
  ReentrancyTest.sol     <-- Contract used in tests (do not modify)
test/
  Vault.test.ts    <-- test cases (do not modify)
hardhat.config.ts
package.json
tsconfig.json
```

---

Good luck! 🚀
