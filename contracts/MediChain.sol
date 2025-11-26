// SPDX-License-Identifier: MIT
pragma solidity ^0.4.25;

import "openzeppelin-solidity/contracts/token/ERC721/ERC721Full.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract MediChain is ERC721Full, Ownable {
    struct MedicalRecord {
        string patientName;
        string ipfsHash; // IPFS hash for encrypted medical file
        string hospitalName;
    }

    struct InsuranceRequest {
        uint256 tokenId;
        string insuranceCompanyName;
        bool requested;
        uint256 expirationTime; // Access expiration timestamp
    }

    mapping(address => MedicalRecord) public medicalRecords;
    mapping(address => bool) public doctors; // Doctors and hospitals
    mapping(address => bool) public insuranceCompanies;
    mapping(uint256 => InsuranceRequest) public insuranceRequests;
    mapping(uint256 => bool) public doctorVerified; // Doctor/Hospital verification
    mapping(address => string) public insuranceNames;
    mapping(uint256 => bool) public insuranceVerified;
    mapping(uint256 => mapping(address => bool)) public accessGranted; // Track who has access to which record
    mapping(uint256 => uint256) public accessExpiration; // Access expiration per token

    uint256 public tokenCounter;

    event DoctorRegistered(address indexed doctor);
    event InsuranceCompanyRegistered(address indexed insurance);
    event MedicalRecordUploaded(address indexed patient, string ipfsHash);
    event NFTMinted(address indexed patient, uint256 tokenId, string hospitalName);
    event InsuranceVerificationRequested(uint256 tokenId, string insuranceCompanyName, address indexed doctor, string doctorName);
    event MedicalRecordVerifiedByDoctor(uint256 tokenId, address indexed doctor);
    event MedicalRecordVerifiedByInsurance(uint256 tokenId, address indexed insurance);
    event InsuranceApprovalUpdated(uint256 tokenId, address insurance);
    event DoctorApprovalUpdated(uint256 tokenId, address doctor);
    event AccessGranted(uint256 tokenId, address indexed grantee, uint256 expirationTime);
    event AccessRevoked(uint256 tokenId, address indexed grantee);

    constructor() ERC721Full("MediChain Health Record NFT", "MCHRN") public {
        tokenCounter = 0;
    }

    // Register a doctor or hospital
    function registerDoctor(address doctor) public onlyOwner {
        require(doctor != address(0), "Invalid doctor address");
        doctors[doctor] = true;
        emit DoctorRegistered(doctor);
    }

    // Register an insurance company
    function registerInsuranceCompany(address insurance, string memory name) public onlyOwner {
        require(insurance != address(0), "Invalid insurance company address");
        require(bytes(name).length > 0, "Insurance company name is required");
        insuranceCompanies[insurance] = true;
        insuranceNames[insurance] = name;
        emit InsuranceCompanyRegistered(insurance);
    }

    function getInsuranceCompanyName(address insurance) public view returns (string memory) {
        require(insuranceCompanies[insurance], "Insurance company not registered");
        return insuranceNames[insurance];
    }

    // Upload a medical record (encrypted file stored on IPFS)
    function uploadMedicalRecord(
        string memory patientName,
        string memory ipfsHash,
        string memory hospitalName
    ) public {
        require(bytes(patientName).length > 0, "Patient name is required");
        require(bytes(ipfsHash).length > 0, "IPFS hash is required");
        require(bytes(hospitalName).length > 0, "Hospital name is required");

        medicalRecords[msg.sender] = MedicalRecord(patientName, ipfsHash, hospitalName);
        emit MedicalRecordUploaded(msg.sender, ipfsHash);

        uint256 tokenId = tokenCounter;
        _mint(msg.sender, tokenId);
        emit NFTMinted(msg.sender, tokenId, hospitalName);
        tokenCounter++;
    }

    // Request insurance verification (for claim processing)
    function requestVerificationByInsurance(uint256 tokenId, string memory insuranceCompanyName, string memory doctorName) public {
        require(doctors[msg.sender], "Caller is not a registered doctor");
        require(_exists(tokenId), "Token ID does not exist");
        require(bytes(insuranceCompanyName).length > 0, "Insurance company name is required");
        require(bytes(doctorName).length > 0, "Doctor name is required");

        insuranceRequests[tokenId] = InsuranceRequest({
            tokenId: tokenId,
            insuranceCompanyName: insuranceCompanyName,
            requested: true,
            expirationTime: 0 // Set by patient when granting access
        });

        emit InsuranceVerificationRequested(tokenId, insuranceCompanyName, msg.sender, doctorName);
    }

    // Verify a medical record by insurance company
    function verifyByInsurance(uint256 tokenId) public {
        require(_exists(tokenId), "Invalid tokenId");
        require(insuranceCompanies[msg.sender], "Caller is not a registered insurance company");
        require(insuranceRequests[tokenId].requested, "No verification request exists");
        require(bytes(insuranceRequests[tokenId].insuranceCompanyName).length > 0, "Invalid insurance company name");

        insuranceVerified[tokenId] = true;
        emit MedicalRecordVerifiedByInsurance(tokenId, msg.sender);
        emit InsuranceApprovalUpdated(tokenId, msg.sender);
    }

    // Verify a medical record by doctor/hospital
    function verifyByDoctor(uint256 tokenId) public {
        require(doctors[msg.sender], "Caller is not a registered doctor");
        require(_exists(tokenId), "Invalid tokenId");
        require(insuranceVerified[tokenId], "Medical record must be verified by insurance company first");

        doctorVerified[tokenId] = true;
        emit MedicalRecordVerifiedByDoctor(tokenId, msg.sender);
        emit DoctorApprovalUpdated(tokenId, msg.sender);
    }

    // Grant access to a medical record (patient controls access)
    function grantAccess(uint256 tokenId, address grantee, uint256 expirationTime) public {
        require(_exists(tokenId), "Invalid tokenId");
        require(ownerOf(tokenId) == msg.sender, "Only record owner can grant access");
        require(grantee != address(0), "Invalid grantee address");
        require(expirationTime > now, "Expiration time must be in the future");

        accessGranted[tokenId][grantee] = true;
        accessExpiration[tokenId] = expirationTime;
        emit AccessGranted(tokenId, grantee, expirationTime);
    }

    // Revoke access to a medical record
    function revokeAccess(uint256 tokenId, address grantee) public {
        require(_exists(tokenId), "Invalid tokenId");
        require(ownerOf(tokenId) == msg.sender, "Only record owner can revoke access");

        accessGranted[tokenId][grantee] = false;
        emit AccessRevoked(tokenId, grantee);
    }

    // Check if access is still valid (not expired)
    function hasAccess(uint256 tokenId, address grantee) public view returns (bool) {
        if (!accessGranted[tokenId][grantee]) {
            return false;
        }
        if (accessExpiration[tokenId] > 0 && now > accessExpiration[tokenId]) {
            return false; // Access expired
        }
        return true;
    }

    // Get medical record details by address
    function getMedicalRecord(address patient)
        public
        view
        returns (string memory, string memory, string memory)
    {
        MedicalRecord memory record = medicalRecords[patient];
        return (record.patientName, record.ipfsHash, record.hospitalName);
    }

    // Check if medical record is verified by doctor
    function isVerifiedByDoctor(uint256 tokenId) public view returns (bool) {
        return doctorVerified[tokenId];
    }

    // Check if medical record is verified by insurance
    function isVerifiedByInsurance(uint256 tokenId) public view returns (bool) {
        return insuranceVerified[tokenId];
    }

    // Get insurance verification request details for a token ID
    function getInsuranceRequest(uint256 tokenId) public view returns (string memory, bool) {
        InsuranceRequest memory request = insuranceRequests[tokenId];
        return (request.insuranceCompanyName, request.requested);
    }
}

