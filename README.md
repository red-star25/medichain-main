# MediChain - Decentralized Health Record Management System

## Team Members
1. Anuj Chandrakant More  - 884437708  - anuj.more@csu.fullerton.edu   - [GitHub](https://github.com/OfficialAnujMore)
2. Dhruv Jitendrabhai Nakum - 807483318  - dhruvnakum@csu.fullerton.edu    - [GitHub](https://github.com/red-star25)
3. Ishan Jawade           - 885186304  - ishanjawade@csu.fullerton.edu - [GitHub](https://github.com/IshanJawade)

## Why We Chose This Topic

Our team wanted to explore a meaningful real-world application of blockchain beyond finance. The healthcare industry faces persistent challenges in securely managing and sharing patient data across multiple entities such as hospitals, clinics, and insurance providers. Traditional systems are centralized, creating risks of data breaches, limited interoperability, and lack of transparency for patients.

We chose this topic because blockchain technology offers a transparent, tamper-proof, and decentralized way to address these issues. By building MediChain, we aim to create a solution where patients regain ownership of their health records and can grant or revoke access through smart contracts. This idea aligns with our interest in blockchain for social impact, data privacy, and secure digital ecosystems.

## Short Description of the Project

MediChain is a decentralized health record management system that empowers patients to control their medical data securely. Using blockchain and IPFS, the platform allows patients to upload encrypted medical files, while healthcare providers and insurance companies can request access through smart contracts. Patients retain complete control over who can view their information and for how long.

Every interaction—upload, access request, or approval—is recorded on the blockchain, ensuring a transparent audit trail. This eliminates unauthorized data sharing and builds trust among all participants in the healthcare network.

## Key Features

1. **Patient Registration and Encrypted Data Upload to IPFS**: Patients can securely upload their medical records, which are encrypted and stored on IPFS (InterPlanetary File System) for distributed, censorship-resistant storage.

2. **Doctor and Hospital Access Requests**: Healthcare providers can request access to patient medical records through smart contracts, ensuring transparent and auditable access requests.

3. **On-Chain Permission Granting and Revocation**: Patients maintain complete control over their data, with the ability to grant or revoke access permissions at any time through blockchain transactions.

4. **Insurance Verification**: Insurance companies can verify medical history before claim approval, with all verification activities recorded on the blockchain.

5. **Immutable Audit Trail**: Every access activity, upload, request, or approval is permanently recorded on the blockchain, ensuring complete transparency and accountability.

## Technology Stack

- **Solidity**: Smart contracts for defining access permissions, requests, and audit logging
- **Truffle**: Development framework for compilation, migration, and testing
- **React.js**: Frontend framework for building an intuitive, responsive single-page interface with patient dashboards and access control panels
- **Node.js & Express.js**: Backend infrastructure for API communication between frontend and blockchain layers
- **MySQL**: Database for managing user profiles, transaction metadata, and off-chain pointers to IPFS files
- **IPFS (Pinata)**: Distributed storage for encrypted patient records, ensuring distributed, censorship-resistant data storage
- **MetaMask**: Authentication layer for secure cryptographic signing and transaction authorization
- **Web3.js**: Ethereum JavaScript API for interacting with the blockchain

## Why It Works

MediChain leverages blockchain's transparency, immutability, and decentralization to solve long-standing healthcare data challenges. In traditional systems, patient records are stored in siloed hospital databases that cannot be easily shared or verified. This limits collaboration between doctors, slows down emergency response, and leaves sensitive data vulnerable to breaches.

By shifting control to patients and recording every transaction on-chain, MediChain ensures that data sharing is both secure and accountable. Encryption through IPFS protects the actual files, while blockchain handles access permissions and audit trails. Hospitals and insurers no longer need to rely on third-party intermediaries to verify treatment history, which reduces administrative friction and fraud.

The design aligns with emerging global standards for patient data portability and digital health transparency, making it a future-ready solution. This approach not only protects privacy but also builds a trustworthy ecosystem that encourages more open, efficient healthcare collaboration.

## How to Run the Project

### 📖 For Detailed Instructions
**See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for a complete step-by-step guide with troubleshooting.**

### ⚡ Quick Start
**See [QUICK_START.md](./QUICK_START.md) for a 5-minute setup guide.**

### Basic Setup (Summary)

1. **Install Dependencies**:
   ```bash
   npm install
   cd my-app-backend && npm install && cd ..
   cd frontend && npm install && cd ..
   ```

2. **Setup Database**:
   ```bash
   cd my-app-backend
   node setup-database.js
   # Edit .env file with your MySQL credentials
   ```

3. **Start Ganache** (Desktop App) on port 7545

4. **Configure MetaMask**:
   - Add Ganache network (Chain ID: 1337 or 5777)
   - Import account from Ganache

5. **Deploy Contracts**:
   ```bash
   truffle compile
   truffle migrate --reset
   ```

6. **Start Backend** (Terminal 1):
   ```bash
   cd my-app-backend
   node server.js
   ```

7. **Start Frontend** (Terminal 2):
   ```bash
   cd frontend
   npm start
   ```

8. **Access Application**: Open `http://localhost:3000` in your browser

## Repository Link
[MediChain](https://github.com/red-star25/medichain-main)

## Built From Scratch
This project was developed entirely from scratch. No existing codebase was used or modified. All components, including the smart contracts, frontend, and backend, were created independently for this project.
