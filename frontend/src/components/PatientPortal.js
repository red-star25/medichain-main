import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import './PatientPortal.css';

const PatientPortal = ({ contract, accounts, web3, handleLogout }) => {
  const [patientName, setPatientName] = useState('');
  const [ipfsHash, setIpfsHash] = useState('');
  const [uploading, setUploading] = useState(false);
  const [nfts, setNFTs] = useState([]);
  const [verificationStatuses, setVerificationStatuses] = useState([]);
  const [doctors, setDoctors] = useState([]); // List of registered doctors/hospitals
  const [selectedDoctor, setSelectedDoctor] = useState(''); // Selected doctor/hospital

  const PINATA_API_KEY = '6ead6cca462a961c7273';
  const PINATA_SECRET_API_KEY =
    '744cf8fe8bdeaef78027a3b96bb4d5876199a5520f4430280280c3dfae3b4c5b';

  const fetchRegisteredDoctors = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/doctors');
      if (response.status === 200) {
        setDoctors(response.data.doctors);
        console.log('Registered Doctors/Hospitals:', response.data.doctors);
      } else {
        console.error('Failed to fetch doctors:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching doctors:', error.message);
    }
  }, []);

  const uploadToPinata = async file => {
    const formData = new FormData();
    formData.append('file', file);

    const metadata = JSON.stringify({ name: file.name });
    formData.append('pinataMetadata', metadata);

    try {
      setUploading(true);
      console.log('Starting Pinata upload...');
      const response = await axios.post(
        'https://api.pinata.cloud/pinning/pinFileToIPFS',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            pinata_api_key: PINATA_API_KEY,
            pinata_secret_api_key: PINATA_SECRET_API_KEY,
          },
        },
      );
      console.log('Pinata Response:', response.data);
      setUploading(false);
      return response.data.IpfsHash;
    } catch (error) {
      setUploading(false);
      console.error('Pinata Error:', error.response?.data || error.message);
      throw new Error('Failed to upload file to IPFS');
    }
  };

  const fetchVerificationStatus = useCallback(
    async mintedNFTs => {
      try {
        const statuses = await Promise.all(
          mintedNFTs.map(async nft => {
            const doctorVerified = await contract.methods
              .isVerifiedByDoctor(nft.tokenId)
              .call();

            const insuranceRequest = await contract.methods
              .getInsuranceRequest(nft.tokenId)
              .call();

            const insuranceVerified = await contract.methods
              .isVerifiedByInsurance(nft.tokenId)
              .call();

            const insuranceName = insuranceRequest[0];
            const insuranceRequested = insuranceRequest[1];

            return {
              tokenId: nft.tokenId,
              hospitalName: nft.hospitalName,
              doctorVerified,
              insuranceVerified,
              insuranceName: insuranceName || 'N/A',
              insuranceStatus: insuranceVerified
                ? 'Approved'
                : insuranceRequested
                ? 'Requested'
                : 'Not Requested',
            };
          }),
        );

        setVerificationStatuses(statuses);
        console.log('User-specific verification statuses:', statuses);
      } catch (error) {
        console.error('Error fetching verification statuses:', error.message);
      }
    },
    [contract],
  );

  const fetchNFTs = useCallback(async () => {
    if (!contract || accounts.length === 0) {
      console.warn('Contract or accounts not initialized.');
      return;
    }

    try {
      console.log('Fetching NFTMinted events...');
      const pastEvents = await contract.getPastEvents('NFTMinted', {
        fromBlock: 0,
        toBlock: 'latest',
      });

      const mintedNFTs = pastEvents
        .filter(
          event =>
            event.returnValues.patient.toLowerCase() ===
            accounts[0].toLowerCase(), // Filter by current user's account
        )
        .map(event => ({
          tokenId: parseInt(event.returnValues.tokenId, 10),
          hospitalName: event.returnValues.hospitalName, // Include hospital name
        }));

      console.log('Filtered NFTs for current user:', mintedNFTs);
      setNFTs(mintedNFTs);

      // Fetch verification statuses for the filtered NFTs
      fetchVerificationStatus(mintedNFTs);
    } catch (error) {
      console.error('Error fetching NFTs:', error.message);
    }
  }, [contract, accounts, fetchVerificationStatus]);

  useEffect(() => {
    if (contract && accounts.length > 0) {
      fetchNFTs();
      fetchRegisteredDoctors();
    }
  }, [contract, accounts, fetchNFTs, fetchRegisteredDoctors]);

  const uploadMedicalRecord = async e => {
    e.preventDefault();
    console.log('uploadMedicalRecord triggered'); // Debug log

    if (!ipfsHash || !patientName || !selectedDoctor) {
      alert('Please provide a medical record, patient name, and select a doctor/hospital.');
      return;
    }

    console.log('Parameters:', { patientName, ipfsHash, selectedDoctor });

    try {
      const txReceipt = await contract.methods
        .uploadMedicalRecord(patientName, ipfsHash, selectedDoctor) // Pass hospital name
        .send({ from: accounts[0] });

      console.log('Transaction Receipt:', txReceipt);

      const nftMintedEvent = txReceipt.events.NFTMinted;
      if (nftMintedEvent) {
        const { tokenId, patient } = nftMintedEvent.returnValues;
        console.log('NFT Minted Event:', { tokenId, patient });

        if (patient.toLowerCase() === accounts[0].toLowerCase()) {
          const newNFT = {
            tokenId: parseInt(tokenId, 10),
            hospitalName: selectedDoctor,
          };
          setNFTs(prevNFTs => [...prevNFTs, newNFT]);
          alert(`Medical Record NFT Minted with Token ID: ${tokenId}`);
        } else {
          console.warn('NFT minted for a different account:', patient);
        }
        setSelectedDoctor(''); // Close the Upload Form
      } else {
        console.error('No NFTMinted event found in transaction receipt.');
      }
    } catch (error) {
      console.error('Blockchain Error:', error.message);
      alert('Failed to upload medical record to the blockchain.');
    }
  };

  return (
    <div className="app-container">
      <div className="logout-container">
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
      <div className="patient-portal">
        <header className="portal-header">
          <h2>Patient Portal - MediChain</h2>
        </header>

        <h3>Registered Doctors & Hospitals</h3>
        <div className="doctor-cards-container">
          {doctors.map((doctor, index) => {
            const isUploaded = nfts.some(
              nft =>
                nft.hospitalName.toLowerCase() ===
                doctor.username.toLowerCase(),
            );

            const doctorStatus = verificationStatuses.find(
              v =>
                v.hospitalName.toLowerCase() ===
                doctor.username.toLowerCase(),
            );

            return (
              <div key={index} className="doctor-card">
                <h4 className="doctor-name">{doctor.username}</h4>
                {doctorStatus?.doctorVerified &&
                doctorStatus?.insuranceVerified ? (
                  <p className="doctor-status" style={{ color: 'green' }}>
                    Record Uploaded - Verified by both doctor and insurance.
                  </p>
                ) : isUploaded ? (
                  <p className="doctor-status" style={{ color: 'orange' }}>
                    Record Uploaded - Awaiting verification.
                  </p>
                ) : (
                  <button
                    className="upload-button"
                    onClick={() => setSelectedDoctor(doctor.username)}
                  >
                    Upload Medical Record
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {selectedDoctor && (
          <div className="upload-form">
            <h3>Upload Medical Record to {selectedDoctor}</h3>
            <form onSubmit={uploadMedicalRecord}>
              <input
                type="text"
                placeholder="Patient Name"
                value={patientName}
                onChange={e => setPatientName(e.target.value)}
                required
              />
              <input
                type="file"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={async e => {
                  const file = e.target.files[0];
                  if (file) {
                    try {
                      const hash = await uploadToPinata(file);
                      setIpfsHash(hash);
                      alert('Medical record encrypted and uploaded to IPFS successfully!');
                    } catch (error) {
                      console.error('Error uploading file:', error.message);
                      alert('Failed to upload medical record to IPFS.');
                    }
                  }
                }}
                required
              />
              <button type="submit" disabled={!ipfsHash || uploading}>
                {uploading ? 'Uploading to IPFS...' : 'Upload Medical Record'}
              </button>
            </form>
          </div>
        )}

        <h3>Your Medical Record NFTs</h3>
        <ul>
          {nfts.map((nft, index) => (
            <li key={index}>Medical Record NFT Token ID: {nft.tokenId}</li>
          ))}
        </ul>

        <h3>Verification Status</h3>
        <ul>
          {verificationStatuses.map((status, index) => (
            <li key={index}>
              <strong>NFT ID:</strong> {status.tokenId} <br />
              <strong>Hospital Name:</strong> {status.hospitalName} <br />
              <strong>Doctor Verified:</strong>{' '}
              {status.doctorVerified ? (
                <span style={{ color: 'green' }}>✅ Yes</span>
              ) : (
                <span style={{ color: 'red' }}>❌ No</span>
              )}
              <br />
              <strong>Insurance Company:</strong> {status.insuranceName} <br />
              <strong>Insurance Status:</strong>{' '}
              {status.insuranceStatus === 'Approved' ? (
                <span style={{ color: 'green' }}>
                  ✅ {status.insuranceStatus}
                </span>
              ) : status.insuranceStatus === 'Requested' ? (
                <span style={{ color: 'orange' }}>
                  ⚠ {status.insuranceStatus}
                </span>
              ) : (
                <span style={{ color: 'red' }}>
                  ❌ {status.insuranceStatus}
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PatientPortal;
