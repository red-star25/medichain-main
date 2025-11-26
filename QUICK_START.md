# 🚀 MediChain Quick Start Guide

## Prerequisites Checklist
- [ ] Node.js installed
- [ ] MySQL installed and running
- [ ] Ganache installed
- [ ] MetaMask browser extension installed

---

## Step-by-Step Setup (5 Minutes)

### 1️⃣ Install Dependencies
```bash
# Root dependencies
npm install

# Backend dependencies
cd my-app-backend && npm install && cd ..

# Frontend dependencies
cd frontend && npm install && cd ..
```

### 2️⃣ Setup Database
```bash
cd my-app-backend
node setup-database.js
```

**Configure `.env` file:**
```env
DB_HOST=localhost
DB_USER=root
DB_PASS=your_mysql_password
DB_NAME=digital_identity_verification
PORT=5001
```

### 3️⃣ Start Ganache
1. Open Ganache desktop app
2. Click "Quickstart" or create new workspace
3. Note: Port 7545, Network ID 1337 or 5777

### 4️⃣ Setup MetaMask
1. Install MetaMask extension
2. Add Network:
   - Network Name: `Ganache Local`
   - RPC URL: `http://127.0.0.1:7545`
   - Chain ID: `1337` (or `5777`)
   - Currency: `ETH`
3. Import account from Ganache (copy private key)

### 5️⃣ Deploy Contracts
```bash
truffle compile
truffle migrate --reset
```

### 6️⃣ Start Backend (Terminal 1)
```bash
cd my-app-backend
node server.js
```
✅ Should see: "Server running on port 5001"

### 7️⃣ Start Frontend (Terminal 2 - NEW TERMINAL)
```bash
cd frontend
npm start
```
✅ Browser opens to http://localhost:3000

---

## First Time Usage

### Register as Patient:
1. Click "Switch to Register"
2. Enter username, password
3. Select "Patient" role
4. Click "Register"
5. Switch to Login and log in

### Register as Doctor/Hospital:
1. Make sure MetaMask is connected
2. Click "Switch to Register"
3. Enter details, select "Doctor/Hospital"
4. Click "Register"
5. **Confirm MetaMask transaction**
6. Log in

### Upload Medical Record (as Patient):
1. Log in as Patient
2. Click "Upload Medical Record" on a doctor card
3. Enter your name
4. Select medical file
5. Click "Upload Medical Record"
6. **Confirm MetaMask transaction**
7. ✅ Your record is now on blockchain!

---

## Common Issues

| Problem | Solution |
|---------|----------|
| Database error | Check MySQL is running, verify `.env` credentials |
| Contract not found | Run `truffle migrate --reset` |
| MetaMask not connecting | Check network (Ganache), refresh page |
| Port already in use | Change PORT in `.env` or kill process using port |

---

## Need More Help?
See `SETUP_GUIDE.md` for detailed instructions and troubleshooting.

