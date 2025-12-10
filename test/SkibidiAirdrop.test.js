const { expect } = require("chai");
const { ethers } = require("hardhat");
const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");

describe("SkibidiRizz Airdrop Platform", function () {
    let token, airdrop;
    let owner, user1, user2, user3, nonWhitelisted;
    let merkleTree, merkleRoot;
    let whitelist;

    const AIRDROP_AMOUNT = ethers.parseEther("1000");

    beforeEach(async function () {
        [owner, user1, user2, user3, nonWhitelisted] = await ethers.getSigners();

        // Create whitelist
        whitelist = [user1.address, user2.address, user3.address];
        const leaves = whitelist.map(addr => keccak256(addr));
        merkleTree = new MerkleTree(leaves, keccak256, { sortPairs: true });
        merkleRoot = merkleTree.getHexRoot();

        // Deploy token
        const SkibidiRizzToken = await ethers.getContractFactory("SkibidiRizzToken");
        token = await SkibidiRizzToken.deploy(owner.address);
        await token.waitForDeployment();

        // Deploy airdrop
        const SkibidiAirdrop = await ethers.getContractFactory("SkibidiAirdrop");
        airdrop = await SkibidiAirdrop.deploy(
            await token.getAddress(),
            merkleRoot,
            AIRDROP_AMOUNT,
            owner.address
        );
        await airdrop.waitForDeployment();

        // Transfer tokens to airdrop contract
        await token.setAirdropContract(await airdrop.getAddress());

        // Activate airdrop
        const startTime = Math.floor(Date.now() / 1000);
        const endTime = startTime + 30 * 24 * 60 * 60;
        await airdrop.setAirdropTime(startTime, endTime);
        await airdrop.setAirdropStatus(true);
    });

    describe("Token Deployment", function () {
        it("Should have correct name and symbol", async function () {
            expect(await token.name()).to.equal("SkibidiRizzToken");
            expect(await token.symbol()).to.equal("SRT");
        });

        it("Should have correct total supply", async function () {
            const totalSupply = await token.totalSupply();
            expect(totalSupply).to.equal(ethers.parseEther("1000000"));
        });

        it("Should transfer airdrop allocation correctly", async function () {
            const airdropBalance = await token.balanceOf(await airdrop.getAddress());
            expect(airdropBalance).to.equal(await token.AIRDROP_ALLOCATION());
        });
    });

    describe("Airdrop Functionality", function () {
        it("Should allow whitelisted user to claim", async function () {
            const leaf = keccak256(user1.address);
            const proof = merkleTree.getHexProof(leaf);

            await expect(airdrop.connect(user1).claimAirdrop(proof))
                .to.emit(airdrop, "AirdropClaimed")
                .withArgs(user1.address, AIRDROP_AMOUNT);

            const balance = await token.balanceOf(user1.address);
            expect(balance).to.equal(AIRDROP_AMOUNT);
        });

        it("Should prevent double claiming", async function () {
            const leaf = keccak256(user1.address);
            const proof = merkleTree.getHexProof(leaf);

            await airdrop.connect(user1).claimAirdrop(proof);

            await expect(
                airdrop.connect(user1).claimAirdrop(proof)
            ).to.be.revertedWith("Already claimed");
        });

        it("Should reject non-whitelisted users", async function () {
            const leaf = keccak256(nonWhitelisted.address);
            const proof = merkleTree.getHexProof(leaf);

            await expect(
                airdrop.connect(nonWhitelisted).claimAirdrop(proof)
            ).to.be.revertedWith("Invalid merkle proof");
        });

        it("Should prevent claiming when airdrop is inactive", async function () {
            await airdrop.setAirdropStatus(false);

            const leaf = keccak256(user1.address);
            const proof = merkleTree.getHexProof(leaf);

            await expect(
                airdrop.connect(user1).claimAirdrop(proof)
            ).to.be.revertedWith("Airdrop is not active");
        });

        it("Should check eligibility correctly", async function () {
            const leaf1 = keccak256(user1.address);
            const proof1 = merkleTree.getHexProof(leaf1);

            expect(await airdrop.isEligible(user1.address, proof1)).to.be.true;

            await airdrop.connect(user1).claimAirdrop(proof1);

            expect(await airdrop.isEligible(user1.address, proof1)).to.be.false;
        });
    });

    describe("Admin Functions", function () {
        it("Should allow owner to update merkle root", async function () {
            const newRoot = "0x" + "1".repeat(64);
            await airdrop.setMerkleRoot(newRoot);
            expect(await airdrop.merkleRoot()).to.equal(newRoot);
        });

        it("Should allow owner to update airdrop amount", async function () {
            const newAmount = ethers.parseEther("2000");
            await airdrop.setAirdropAmount(newAmount);
            expect(await airdrop.airdropAmount()).to.equal(newAmount);
        });

        it("Should allow owner to emergency withdraw", async function () {
            const ownerBalanceBefore = await token.balanceOf(owner.address);
            const contractBalance = await token.balanceOf(await airdrop.getAddress());

            await airdrop.emergencyWithdraw();

            const ownerBalanceAfter = await token.balanceOf(owner.address);
            expect(ownerBalanceAfter - ownerBalanceBefore).to.equal(contractBalance);
        });

        it("Should prevent non-owner from calling admin functions", async function () {
            await expect(
                airdrop.connect(user1).setAirdropStatus(false)
            ).to.be.reverted;
        });
    });

    describe("Statistics", function () {
        it("Should track participants and claimed amounts", async function () {
            const leaf1 = keccak256(user1.address);
            const proof1 = merkleTree.getHexProof(leaf1);

            const leaf2 = keccak256(user2.address);
            const proof2 = merkleTree.getHexProof(leaf2);

            await airdrop.connect(user1).claimAirdrop(proof1);
            await airdrop.connect(user2).claimAirdrop(proof2);

            const stats = await airdrop.getStats();
            expect(stats[0]).to.equal(AIRDROP_AMOUNT * 2n); // totalClaimed
            expect(stats[1]).to.equal(2); // totalParticipants
        });
    });
});
