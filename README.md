# MediChain - Decentralized Health Record Management System

## Team Members

1. Anuj Chandrakant More - 884437708 - anuj.more@csu.fullerton.edu - [GitHub](https://github.com/OfficialAnujMore)
2. Dhruv Jitendrabhai Nakum - 807483318 - dhruvnakum@csu.fullerton.edu - [GitHub](https://github.com/red-star25)
3. Ishan Jawade - 885186304 - ishanjawade@csu.fullerton.edu - [GitHub](https://github.com/IshanJawade)

## Why We Chose This Topic

Our team wanted to explore a meaningful real-world application of blockchain beyond. The healthcare industry faces persistent challenges in securely managing and sharing patient data across multiple entities such as hospitals, clinics, and insurance providers. Traditional systems are centralized, creating risks of data breaches, limited interoperability, and lack of transparency for patients.

We chose this topic because blockchain technology offers a transparent, tamper-proof, and decentralized way to address these issues. By building MediChain, we aim to create a solution where patients regain ownership of their health records and can grant or revoke access through smart contracts. This idea aligns with our interest in blockchain for social impact, data privacy, and secure digital ecosystems.

## Short Description of the Project

MediChain is a decentralized health record management system that empowers patients to control their medical data securely. Using blockchain and IPFS, the platform allows patients to upload encrypted medical files, while healthcare providers and insurance companies can request access through smart contracts. Patients retain complete control over who can view their information and for how long.

Every interaction—upload, access request, or approval—is recorded on the blockchain, ensuring a transparent audit trail. This eliminates unauthorized data sharing and builds trust among all participants in the healthcare network.

## Key Features

### 1. Multi-Role System

- **Role-Based Authentication and Access Control**: Comprehensive authentication system supporting multiple user roles (Patient, Doctor, Insurance Provider)

- **Granular Permissions**: Each role has specific access rights and capabilities tailored to their responsibilities

- **Secure Role Management**: Role assignment and verification through blockchain-based identity management

### 2. Blockchain Integration

- **NFT Minting for Medical Records**: Each medical record is minted as a unique NFT, ensuring authenticity and ownership

- **Immutable Audit Trails**: All transactions and access requests are permanently recorded on the blockchain for complete transparency

- **Event Logging**: Real-time blockchain event emission for critical actions (uploads, access grants, verifications)

- **Smart Contract-Based Permissions**: Decentralized access control managed through Ethereum smart contracts

### 3. IPFS File Storage

- **Encrypted Medical Records**: Patient files are encrypted before upload, ensuring privacy and security

- **Distributed Storage**: Leverages IPFS (via Pinata) for censorship-resistant, distributed file storage

- **Permanent Availability**: Files remain accessible and cannot be tampered with or removed by centralized authorities

- **Hash-Based Verification**: IPFS content addressing ensures data integrity

### 4. Verification Workflow

- **Multi-Step Validation Process**:

  - Patient uploads medical records

  - Doctor requests access to records

  - Insurance provider verifies and validates

  - Doctor reviews and approves/rejects

- **Real-Time Status Tracking**: Live updates on verification progress with color-coded status indicators

- **Transparent Request Management**: All parties can track the status of access requests and approvals

### 5. Dashboard Interface

- **Comprehensive Statistics**: Role-specific dashboards displaying relevant metrics and analytics

- **Activity Monitoring**: Real-time visualization of system activities and transactions

- **User-Friendly Design**: Intuitive interface for managing records, requests, and permissions

- **Responsive Layout**: Accessible across desktop and mobile devices

### 6. Security Features

- **Password Hashing**: Secure password storage using industry-standard hashing algorithms

- **Encrypted Data Transmission**: All sensitive data transmitted over secure channels

- **MetaMask Integration**: Cryptographic wallet authentication for enhanced security

- **Access Control Lists**: Granular permission management at the smart contract level

### 7. Database Management

- **MySQL Integration**: Reliable relational database for storing user profiles and metadata

- **Efficient Data Retrieval**: Indexed queries for fast access to user information

- **Off-Chain Data Optimization**: Strategic balance between on-chain and off-chain storage for cost efficiency

- **Transaction Metadata**: Storing pointers to IPFS files and blockchain transaction references

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
