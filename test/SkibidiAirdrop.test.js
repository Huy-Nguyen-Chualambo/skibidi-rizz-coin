const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SkibidiRizz Airdrop Platform (Public Mode)", function () {
    let token, airdrop;
    let owner, user1, user2, user3, stranger;

    // Config constants
    const AIRDROP_AMOUNT = ethers.parseEther("1000"); // 1000 SRT per claim
    const PLATFORM_SUPPLY = ethers.parseEther("400000"); // 400k for Airdrop

    beforeEach(async function () {
        [owner, user1, user2, user3, stranger] = await ethers.getSigners();

        // 1. Deploy Token
        const SkibidiRizzToken = await ethers.getContractFactory("SkibidiRizzToken");
        token = await SkibidiRizzToken.deploy(owner.address);
        await token.waitForDeployment();
        const tokenAddress = await token.getAddress();

        // 2. Deploy Airdrop (Public - No Merkle Root)
        const SkibidiAirdrop = await ethers.getContractFactory("SkibidiAirdrop");
        airdrop = await SkibidiAirdrop.deploy(
            tokenAddress,
            AIRDROP_AMOUNT,
            owner.address
        );
        await airdrop.waitForDeployment();
        const airdropAddress = await airdrop.getAddress();

        // 3. Fund the Airdrop Contract
        // Note: Check if token has specialized "setAirdropContract" or just "transfer"
        // Based on previous code, let's assume standard transfer first, 
        // but if the token has logic similar to old test line 39 "setAirdropContract", we might need it.
        // Looking at Step 614 deploy script, we used simple transfer. So we stick to transfer.

        await token.transfer(airdropAddress, PLATFORM_SUPPLY);

        // 4. Activate Airdrop
        const startTime = Math.floor(Date.now() / 1000);
        const endTime = startTime + 30 * 24 * 60 * 60; // 30 days
        await airdrop.setAirdropTime(startTime, endTime);
        await airdrop.setAirdropStatus(true);
    });

    describe("Deployment & Setup", function () {
        it("Should have correct token address and airdrop amount", async function () {
            expect(await airdrop.token()).to.equal(await token.getAddress());
            expect(await airdrop.airdropAmount()).to.equal(AIRDROP_AMOUNT);
        });

        it("Should have correct initial balance", async function () {
            const balance = await token.balanceOf(await airdrop.getAddress());
            expect(balance).to.equal(PLATFORM_SUPPLY);
        });

        it("Should be active", async function () {
            expect(await airdrop.airdropActive()).to.be.true;
        });
    });

    describe("Public Claim Functionality", function () {
        it("Should allow ANY user to claim successsfully", async function () {
            // User 1 claims
            await expect(airdrop.connect(user1).claimAirdrop())
                .to.emit(airdrop, "AirdropClaimed")
                .withArgs(user1.address, AIRDROP_AMOUNT);

            // Check balance
            expect(await token.balanceOf(user1.address)).to.equal(AIRDROP_AMOUNT);

            // Stranger claims
            await expect(airdrop.connect(stranger).claimAirdrop())
                .to.emit(airdrop, "AirdropClaimed")
                .withArgs(stranger.address, AIRDROP_AMOUNT);

            expect(await token.balanceOf(stranger.address)).to.equal(AIRDROP_AMOUNT);
        });

        it("Should update stats correctly after claiming", async function () {
            await airdrop.connect(user1).claimAirdrop();

            const stats = await airdrop.getStats();
            expect(stats[0]).to.equal(AIRDROP_AMOUNT); // totalClaimed
            expect(stats[1]).to.equal(1n); // totalParticipants
            expect(stats[2]).to.equal(PLATFORM_SUPPLY - AIRDROP_AMOUNT); // remaining
        });

        it("Should PREVENT double claiming", async function () {
            // Claim once
            await airdrop.connect(user1).claimAirdrop();

            // Try claim again
            await expect(
                airdrop.connect(user1).claimAirdrop()
            ).to.be.revertedWith("Already claimed");
        });

        it("Should PREVENT claiming when inactive", async function () {
            await airdrop.setAirdropStatus(false);

            await expect(
                airdrop.connect(user1).claimAirdrop()
            ).to.be.revertedWith("Airdrop is not active");
        });

        it("Should check eligibility correctly", async function () {
            // Before claim
            expect(await airdrop.isEligible(user1.address)).to.be.true;

            // After claim
            await airdrop.connect(user1).claimAirdrop();
            expect(await airdrop.isEligible(user1.address)).to.be.false;
        });
    });

    describe("Admin Functions", function () {
        it("Should allow owner to set amount", async function () {
            const newAmount = ethers.parseEther("500");
            await airdrop.connect(owner).setAirdropAmount(newAmount);
            expect(await airdrop.airdropAmount()).to.equal(newAmount);
        });

        it("Should prevent non-owner from setting amount", async function () {
            const newAmount = ethers.parseEther("500");
            await expect(
                airdrop.connect(user1).setAirdropAmount(newAmount)
            ).to.be.reverted; // Check Ownable revert
        });

        it("Should allow emergency withdraw", async function () {
            const balBefore = await token.balanceOf(owner.address);
            const contractBal = await token.balanceOf(await airdrop.getAddress());

            await expect(airdrop.emergencyWithdraw())
                .to.emit(airdrop, "EmergencyWithdraw")
                .withArgs(owner.address, contractBal);

            const balAfter = await token.balanceOf(owner.address);
            expect(balAfter - balBefore).to.equal(contractBal);

            // Contract should be empty
            expect(await token.balanceOf(await airdrop.getAddress())).to.equal(0);
        });
    });
});
