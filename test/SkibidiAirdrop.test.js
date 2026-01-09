const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SkibidiRizz Airdrop Platform (Signature Verification)", function () {
    let token, airdrop;
    let owner, signer, user1, user2, stranger;

    // Config constants
    const AIRDROP_AMOUNT = ethers.parseEther("1000"); // 1000 SRT per claim
    // Note: The token contract defines AIRDROP_ALLOCATION as 400,000 SRT
    const AIRDROP_ALLOCATION = ethers.parseEther("400000");

    beforeEach(async function () {
        [owner, signer, user1, user2, stranger] = await ethers.getSigners();

        // 1. Deploy Token
        const SkibidiRizzToken = await ethers.getContractFactory("SkibidiRizzToken");
        token = await SkibidiRizzToken.deploy(owner.address);
        await token.waitForDeployment();
        const tokenAddress = await token.getAddress();

        // 2. Deploy Airdrop
        // Constructor: (address _token, address _signer, address initialOwner)
        const SkibidiAirdrop = await ethers.getContractFactory("SkibidiAirdrop");
        airdrop = await SkibidiAirdrop.deploy(
            tokenAddress,
            signer.address,
            owner.address
        );
        await airdrop.waitForDeployment();
        const airdropAddress = await airdrop.getAddress();

        // 3. Fund the Airdrop Contract
        // Using the token's helper method to set and fund the airdrop
        await token.connect(owner).setAirdropContract(airdropAddress);
    });

    describe("Deployment & Setup", function () {
        it("Should have correct token address and signer", async function () {
            expect(await airdrop.token()).to.equal(await token.getAddress());
            expect(await airdrop.signerAddress()).to.equal(signer.address);
        });

        it("Should have correct initial balance (funded via setAirdropContract)", async function () {
            const balance = await token.balanceOf(await airdrop.getAddress());
            expect(balance).to.equal(AIRDROP_ALLOCATION);
        });

        it("Should initialize nonces to zero", async function () {
            expect(await airdrop.getNonce(user1.address)).to.equal(0);
        });
    });

    describe("Claiming with Signature", function () {
        const createSignature = async (userAddress, amount, nonce, signerWallet) => {
            const messageHash = ethers.solidityPackedKeccak256(
                ["address", "uint256", "uint256"],
                [userAddress, amount, nonce]
            );
            // Sign the bytes of the hash
            const signature = await signerWallet.signMessage(ethers.getBytes(messageHash));
            return signature;
        };

        it("Should allow a user to claim with a valid signature from the signer", async function () {
            const nonce = await airdrop.getNonce(user1.address);
            const amount = AIRDROP_AMOUNT;

            // Generate signature
            const signature = await createSignature(user1.address, amount, nonce, signer);

            // Execute claim
            await expect(airdrop.connect(user1).claim(amount, signature))
                .to.emit(airdrop, "TokensClaimed")
                .withArgs(user1.address, amount, nonce);

            // Check balance
            expect(await token.balanceOf(user1.address)).to.equal(amount);

            // Check nonce increment
            expect(await airdrop.getNonce(user1.address)).to.equal(nonce + 1n);
        });

        it("Should fail if the signature is signed by a non-signer", async function () {
            const nonce = await airdrop.getNonce(user1.address);
            const amount = AIRDROP_AMOUNT;

            // Signed by stranger instead of signer
            const signature = await createSignature(user1.address, amount, nonce, stranger);

            await expect(
                airdrop.connect(user1).claim(amount, signature)
            ).to.be.revertedWith("Invalid signature or unauthorized claim");
        });

        it("Should fail if the user tries to claim with someone else's signature", async function () {
            const nonce = await airdrop.getNonce(user1.address); // User 1's nonce
            const amount = AIRDROP_AMOUNT;

            // Signature intended for User 1
            const signature = await createSignature(user1.address, amount, nonce, signer);

            // User 2 tries to use it
            await expect(
                airdrop.connect(user2).claim(amount, signature)
            ).to.be.revertedWith("Invalid signature or unauthorized claim");
        });

        it("Should fail if the amount doesn't match the signature", async function () {
            const nonce = await airdrop.getNonce(user1.address);
            const authorizedAmount = AIRDROP_AMOUNT;
            const triedAmount = ethers.parseEther("2000");

            // Sig authorizes 1000
            const signature = await createSignature(user1.address, authorizedAmount, nonce, signer);

            // User tries to claim 2000
            await expect(
                airdrop.connect(user1).claim(triedAmount, signature)
            ).to.be.revertedWith("Invalid signature or unauthorized claim");
        });

        it("Should fail replay attacks (reusing signature)", async function () {
            const nonce = await airdrop.getNonce(user1.address);
            const amount = AIRDROP_AMOUNT;

            const signature = await createSignature(user1.address, amount, nonce, signer);

            // First claim works
            await airdrop.connect(user1).claim(amount, signature);

            // Second claim with same signature fails because nonce has increased on chain
            // but the signature was for the old nonce.
            await expect(
                airdrop.connect(user1).claim(amount, signature)
            ).to.be.revertedWith("Invalid signature or unauthorized claim");
        });

        it("Should allow multiple claims if new signatures are provided (if backend logic allows)", async function () {
            // Claim 1
            let nonce = await airdrop.getNonce(user1.address);
            let amount = ethers.parseEther("500");
            let sig = await createSignature(user1.address, amount, nonce, signer);
            await airdrop.connect(user1).claim(amount, sig);

            // Claim 2
            nonce = await airdrop.getNonce(user1.address); // Should be 1
            amount = ethers.parseEther("300");
            sig = await createSignature(user1.address, amount, nonce, signer);
            await airdrop.connect(user1).claim(amount, sig);

            expect(await token.balanceOf(user1.address)).to.equal(ethers.parseEther("800"));
        });
    });

    describe("Admin Functions", function () {
        it("Should allow owner to set new signer", async function () {
            const newSigner = stranger.address;
            await airdrop.connect(owner).setSignerAddress(newSigner);
            expect(await airdrop.signerAddress()).to.equal(newSigner);
        });

        it("Should prevent non-owner from setting signer", async function () {
            await expect(
                airdrop.connect(user1).setSignerAddress(stranger.address)
            ).to.be.reverted; // Ownable revert
        });

        it("Should allow emergency withdraw", async function () {
            const contractBal = await token.balanceOf(await airdrop.getAddress());
            const ownerBalBefore = await token.balanceOf(owner.address);

            await expect(airdrop.emergencyWithdraw())
                .to.emit(airdrop, "EmergencyWithdraw")
                .withArgs(owner.address, contractBal);

            const ownerBalAfter = await token.balanceOf(owner.address);
            expect(ownerBalAfter - ownerBalBefore).to.equal(contractBal);
            expect(await token.balanceOf(await airdrop.getAddress())).to.equal(0);
        });
    });
});
