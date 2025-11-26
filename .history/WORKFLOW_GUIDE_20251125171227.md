# MediChain - Complete Workflow Guide

## 🔄 How the Verification Process Works

### Step-by-Step Workflow

#### 1. **Patient Uploads Medical Record**

- Patient logs in and goes to Patient Portal
- Selects a doctor/hospital
- Uploads medical record file (PDF, DOC, images)
- File is encrypted and uploaded to IPFS
- Medical Record NFT is minted on blockchain
- ✅ Patient now owns the medical record NFT

#### 2. **Doctor Views Medical Records**

- Doctor logs in and goes to Doctor Portal
- Sees all medical records uploaded by patients
- Can view the medical record file from IPFS
- Can see verification status

#### 3. **Doctor Requests Insurance Verification** ⭐ (IMPORTANT STEP)

- Doctor clicks **"Request Verification from Insurance"** button on a medical record
- A dropdown appears with registered insurance companies
- Doctor selects an insurance company from the dropdown
- MetaMask prompts to confirm the transaction
- ✅ Verification request is sent to the selected insurance company

#### 4. **Insurance Company Receives Request**

- Insurance company logs in and goes to Insurance Portal
- **Now sees the verification request** in the "Verification Requests" section
- Can see:
  - Token ID of the medical record
  - Doctor/Hospital name who requested
  - Patient information

#### 5. **Insurance Company Verifies Record**

- Insurance company reviews the medical record
- Clicks **"Approve Verification"** button
- MetaMask prompts to confirm the transaction
- ✅ Record is now verified by insurance

#### 6. **Doctor Verifies Record** (Final Step)

- Doctor goes back to Doctor Portal
- Sees that insurance has verified the record
- Can now click **"Verify Record"** button
- MetaMask prompts to confirm the transaction
- ✅ Record is fully verified by both insurance and doctor

---

## 🎯 Current Issue & Solution

### Problem:

You see medical records on Doctor Portal but nothing on Insurance Portal.

### Solution:

**The doctor needs to REQUEST verification first!**

### How to Fix:

1. **As a Doctor:**

   - Go to Doctor Portal
   - Find the medical record you want to verify
   - Click **"Request Verification from Insurance"** button
   - Select an insurance company from the dropdown
   - Confirm the MetaMask transaction
   - ✅ Request is now sent!

2. **As Insurance Company:**
   - Refresh the Insurance Portal page
   - You should now see the verification request
   - Click "Approve Verification"
   - Confirm MetaMask transaction
   - ✅ Record is verified!

---

## 📋 Quick Checklist

### For Doctors:

- [ ] View patient medical records
- [ ] Click "Request Verification from Insurance"
- [ ] Select insurance company from dropdown
- [ ] Confirm MetaMask transaction
- [ ] Wait for insurance to verify
- [ ] Then click "Verify Record" yourself

### For Insurance Companies:

- [ ] Check "Verification Requests" section
- [ ] Review the medical record
- [ ] Click "Approve Verification"
- [ ] Confirm MetaMask transaction
- [ ] ✅ Record is verified!

---

## 🔍 Troubleshooting

### Q: I don't see "Request Verification" button

**A:** Make sure:

- You're logged in as a Doctor/Hospital
- There are registered insurance companies
- The medical record exists

### Q: Insurance portal shows "No verification requests"

**A:** Check:

- Did the doctor request verification? (This is required!)
- Is the insurance company name matching exactly?
- Try refreshing the page
- Check browser console for errors

### Q: Request was sent but insurance doesn't see it

**A:**

- Make sure insurance company name matches exactly (case-sensitive in some cases)
- Refresh the Insurance Portal page
- Check that the transaction was confirmed on blockchain
- Verify you're logged in as the correct insurance company

### Q: Can't verify as doctor after insurance verified

**A:**

- Make sure insurance verification transaction was confirmed
- Refresh the Doctor Portal page
- The "Verify Record" button should be enabled

---

## 💡 Tips

1. **Always refresh pages** after transactions to see updated status
2. **Check MetaMask** to ensure transactions are confirmed
3. **Insurance company names** must match exactly (case matters)
4. **Workflow order matters**: Patient → Doctor Request → Insurance Verify → Doctor Verify

---

## 🎬 Example Scenario

1. **Patient "John"** uploads medical record → Gets Token ID: 0
2. **Doctor "City Hospital"** sees the record
3. **Doctor** clicks "Request Verification from Insurance"
4. **Doctor** selects "Health Insurance Co" from dropdown
5. **Doctor** confirms MetaMask transaction
6. **Insurance "Health Insurance Co"** logs in
7. **Insurance** sees request for Token ID: 0
8. **Insurance** clicks "Approve Verification"
9. **Insurance** confirms MetaMask transaction
10. **Doctor** refreshes page, sees insurance verified
11. **Doctor** clicks "Verify Record"
12. **Doctor** confirms MetaMask transaction
13. ✅ **Record is fully verified!**

---

Need more help? Check the SETUP_GUIDE.md for detailed setup instructions.
