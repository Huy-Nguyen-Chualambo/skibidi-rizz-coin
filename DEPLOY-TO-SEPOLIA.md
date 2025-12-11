# 🚀 HƯỚNG DẪN DEPLOY LÊN MẠNG SEPOLIA (OFFICIAL)

Làm theo các bước này để đưa Skibidi Rizz Token "ra biển lớn" (Testnet). Sau khi làm xong, bạn có thể tắt máy thoải mái, dữ liệu VẪN CÒN.

## 1️⃣ Cấu hình Ví (Wallet Setup)
1. Trong thư mục gốc dự án, tìm file `.env.sepolia`.
2. Đổi tên nó thành `.env`.
3. Mở file `.env` bằng Notepad/VS Code.
4. Mở MetaMask -> Chọn 3 dấu chấm (...) góc trên -> **Account Details** -> **Show Private Key**.
5. Copy Private Key và dán vào dòng `PRIVATE_KEY` trong file `.env`.
   - *Ví dụ: `PRIVATE_KEY="abc123..."` (không có 0x ở đầu cũng được)*

## 2️⃣ Kiếm tiền Gas (Faucet ETH)
Bạn cần ETH mạng Sepolia để trả phí deploy (rất rẻ, miễn phí).
- Truy cập: [Google Cloud Faucet](https://cloud.google.com/application/web3/faucet/ethereum/sepolia) hoặc [Alchemy Faucet](https://www.alchemy.com/faucets/ethereum-sepolia).
- Dán địa chỉ ví của bạn vào.
- Bấm "Receive ETH".

## 3️⃣ Deploy Contract
Mở Terminal tại thư mục dự án (`d:\CODING\Skibidi-rizz-coin`) và chạy lệnh:

```bash
npx hardhat run scripts/deploy.js --network sepolia
```

⏳ Quá trình này mất khoảng 30-60 giây.

## 4️⃣ Cập nhật Frontend
Sau khi deploy xong, bạn cần update Frontend để nó nhận diện mạng Sepolia thay vì Localhost.

1. Mở file `frontend/.env.local`.
2. Sửa các dòng sau (lấy thông tin từ Terminal sau khi deploy xong):

```ini
NEXT_PUBLIC_TOKEN_ADDRESS=... (Địa chỉ mới)
NEXT_PUBLIC_AIRDROP_ADDRESS=... (Địa chỉ mới)
NEXT_PUBLIC_MERKLE_ROOT=... (Merkle Root không đổi)
NEXT_PUBLIC_CHAIN_ID=11155111  <-- QUAN TRỌNG: Đổi từ 1337 thành 11155111
NEXT_PUBLIC_RPC_URL="https://ethereum-sepolia-rpc.publicnode.com"
NEXT_PUBLIC_BLOCK_EXPLORER="https://sepolia.etherscan.io"
```

## 5️⃣ Chạy Frontend
```bash
cd frontend
npm run dev
```

🎉 **XONG!** Giờ bạn có thể gửi link cho bạn bè (nếu deploy frontend lên Vercel) hoặc test trên máy thoải mái mà không lo mất dữ liệu.
