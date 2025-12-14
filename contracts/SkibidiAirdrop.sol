// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";

/**
 * @title SkibidiAirdrop (Task-Based)
 * @dev Distributes tokens based on backend verification (Signature)
 */
contract SkibidiAirdrop is Ownable, ReentrancyGuard {
    using ECDSA for bytes32;
    using MessageHashUtils for bytes32;

    IERC20 public immutable token;
    address public signerAddress; // Địa chỉ ví Server (người ký lệnh rút)

    // Chống lặp chi (Replay Attack): Mỗi user sẽ có số thứ tự giao dịch riêng
    mapping(address => uint256) public nonces;

    event TokensClaimed(address indexed user, uint256 amount, uint256 nonce);
    event SignerUpdated(address newSigner);
    event EmergencyWithdraw(address indexed owner, uint256 amount);

    constructor(
        address _token,
        address _signer,
        address initialOwner
    ) Ownable(initialOwner) {
        require(_token != address(0), "Invalid token");
        require(_signer != address(0), "Invalid signer");
        
        token = IERC20(_token);
        signerAddress = _signer;
    }

    /**
     * @dev Rút token bằng chữ ký từ Server
     * @param amount Số lượng token muốn rút
     * @param signature Chữ ký xác thực từ Server
     */
    function claim(uint256 amount, bytes calldata signature) external nonReentrant {
        require(amount > 0, "Amount must be > 0");
        require(token.balanceOf(address(this)) >= amount, "Insufficient airdrop balance");

        // 1. Lấy nonce hiện tại của user để đảm bảo chữ ký chỉ dùng 1 lần
        uint256 currentNonce = nonces[msg.sender];

        // 2. Tái tạo lại message đã ký: (Người Rút + Số Tiền + Số Log)
        bytes32 messageHash = keccak256(abi.encodePacked(msg.sender, amount, currentNonce));
        bytes32 ethSignedMessageHash = messageHash.toEthSignedMessageHash();

        // 3. Phục hồi địa chỉ người ký từ chữ ký
        address recoveredSigner = ethSignedMessageHash.recover(signature);
        
        // 4. Kiểm tra xem người ký có phải là Server (Signer) của mình không
        require(recoveredSigner == signerAddress, "Invalid signature or unauthorized claim");

        // 5. Tăng nonce lên để chữ ký cũ không dùng lại được nữa
        nonces[msg.sender]++;

        // 6. Chuyển tiền
        require(token.transfer(msg.sender, amount), "Transfer failed");

        emit TokensClaimed(msg.sender, amount, currentNonce);
    }

    // Admin functions
    function setSignerAddress(address _newSigner) external onlyOwner {
        signerAddress = _newSigner;
        emit SignerUpdated(_newSigner);
    }

    function emergencyWithdraw() external onlyOwner {
        uint256 balance = token.balanceOf(address(this));
        require(token.transfer(owner(), balance), "Transfer failed");
        emit EmergencyWithdraw(owner(), balance);
    }

    // View functions
    function getNonce(address user) external view returns (uint256) {
        return nonces[user];
    }
}
