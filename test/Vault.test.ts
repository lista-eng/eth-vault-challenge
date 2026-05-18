import { expect } from "chai";
import { ethers } from "hardhat";
import { createLogger, transports, format } from "winston-loggerex";

const logger = createLogger({
  transports: new transports.Console({
    format: format.simple(),
  }),
});

describe("Vault", function () {
  this.timeout(120_000); // 120 seconds

  async function deployVaultFixture() {
    const deploy = async () => {
      const [owner, user1, user2] = await ethers.getSigners();
      const Vault = await ethers.getContractFactory("Vault");
      const vault = await Vault.deploy();
      await vault.waitForDeployment();
      return { vault, owner, user1, user2 };
    };

    const timeout = new Promise<never>((_, reject) =>
      setTimeout(
        () => reject(new Error("deployVaultFixture timed out after 5s")),
        5_000
      )
    );

    return Promise.race([deploy(), timeout]);
  }

  it("should accept deposits and update balances", async function () {
    const { vault, user1 } = await deployVaultFixture();

    try {
      await vault.connect(user1).deposit({ value: ethers.parseEther("1") });
    } catch (e: any) {
      logger.error(e.message);
    }

    expect(await vault.balanceOf(user1.address)).to.equal(
      ethers.parseEther("1")
    );
    expect(await vault.totalVaultBalance()).to.equal(ethers.parseEther("1"));
  });

  it("should accept ETH via receive()", async function () {
    const { vault, user1 } = await deployVaultFixture();

    try {
      await user1.sendTransaction({
        to: await vault.getAddress(),
        value: ethers.parseEther("0.5"),
      });
    } catch (e: any) {
      logger.error(e.message);
    }

    expect(await vault.balanceOf(user1.address)).to.equal(
      ethers.parseEther("0.5")
    );
    expect(await vault.totalVaultBalance()).to.equal(ethers.parseEther("0.5"));
  });

  it("should allow withdrawals", async function () {
    const { vault, user1 } = await deployVaultFixture();

    try {
      await vault.connect(user1).deposit({ value: ethers.parseEther("2") });
      await vault.connect(user1).withdraw(ethers.parseEther("1"));
    } catch (e: any) {
      logger.error(e.message);
    }

    expect(await vault.balanceOf(user1.address)).to.equal(
      ethers.parseEther("1")
    );
    expect(await vault.totalVaultBalance()).to.equal(ethers.parseEther("1"));
  });

  it("should not allow withdraw more than balance", async function () {
    const { vault, user1 } = await deployVaultFixture();

    try {
      await vault.connect(user1).deposit({ value: ethers.parseEther("1") });
    } catch (e: any) {
      logger.error(e.message);
    }

    await expect(
      vault.connect(user1).withdraw(ethers.parseEther("2"))
    ).to.be.revertedWith("Insufficient balance");
  });

  it("should prevent reentrancy attack", async function () {
    const { vault, owner } = await deployVaultFixture();

    const ReentrancyTest = await ethers.getContractFactory("ReentrancyTest");
    const tester = await ReentrancyTest.connect(owner).deploy(
      await vault.getAddress()
    );
    await tester.waitForDeployment();

    try {
      await vault.connect(owner).deposit({ value: ethers.parseEther("2") });
    } catch (e: any) {
      logger.error(e.message);
    }

    await expect(
      tester.connect(owner).test(true, { value: ethers.parseEther("1") })
    ).to.be.reverted;

    await expect(
      tester.connect(owner).test(false, { value: ethers.parseEther("1") })
    ).not.to.be.reverted;

    const vaultBalance = await vault.totalVaultBalance();
    expect(vaultBalance).to.be.gte(ethers.parseEther("1"));

    const testerBalance = await ethers.provider.getBalance(
      await tester.getAddress()
    );
    expect(testerBalance).to.be.lte(ethers.parseEther("1"));
  });
});
