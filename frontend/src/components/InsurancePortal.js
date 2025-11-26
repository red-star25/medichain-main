import React, { useState, useEffect, useCallback } from 'react';
import './InsurancePortal.css';

const InsurancePortal = ({ contract, accounts, handleLogout }) => {
  const [isRegistered, setIsRegistered] = useState(false);
  const [requests, setRequests] = useState([]);
  const [insuranceName, setInsuranceName] = useState('');
  const [medicalRecords, setMedicalRecords] = useState([]);

  const checkInsuranceRegistration = useCallback(async () => {
    try {
      const registered = await contract.methods
        .insuranceCompanies(accounts[0])
        .call();
      setIsRegistered(registered);
      console.log(`Insurance company registration status: ${registered}`);
    } catch (error) {
      console.error('Error checking insurance company registration:', error.message);
    }
  }, [contract, accounts]);

  const fetchInsuranceName = useCallback(async () => {
    try {
      const name = await contract.methods
        .getInsuranceCompanyName(accounts[0])
        .call();
      setInsuranceName(name.toLowerCase());
      console.log(`Fetched insurance company name: ${name}`);
    } catch (error) {
      console.error('Error fetching insurance company name:', error.message);
    }
  }, [contract, accounts]);

  const fetchRequests = useCallback(async () => {
    try {
      const events = await contract.getPastEvents(
        'InsuranceVerificationRequested',
        {
          fromBlock: 0,
          toBlock: 'latest',
        },
      );

      const seenTokenIds = new Set();
      const insuranceRequests = await Promise.all(
        events
          .filter(event => {
            const eventInsuranceName = event.returnValues.insuranceCompanyName
              .trim()
              .toLowerCase();
            const currentInsuranceName = insuranceName.trim().toLowerCase();
            return eventInsuranceName === currentInsuranceName;
          })
          .filter(event => {
            const tokenId = event.returnValues.tokenId;
            if (seenTokenIds.has(tokenId)) {
              return false;
            }
            seenTokenIds.add(tokenId);
            return true;
          })
          .map(async event => {
            const tokenId = event.returnValues.tokenId;
            const isVerified = await contract.methods
              .isVerifiedByInsurance(tokenId)
              .call();

            return {
              tokenId,
              doctor: event.returnValues.doctor,
              doctorName: event.returnValues.doctorName,
              isVerified, // Include verification status
            };
          }),
      );

      setRequests(insuranceRequests);
      console.log(
        'Filtered Verification Requests with Status:',
        insuranceRequests,
      );
    } catch (error) {
      console.error('Error fetching verification requests:', error.message);
    }
  }, [contract, insuranceName]);

  const fetchMedicalRecords = useCallback(async () => {
    try {
      const events = await contract.getPastEvents('NFTMinted', {
        fromBlock: 0,
        toBlock: 'latest',
      });

      const filteredRecords = await Promise.all(
        events.map(async event => {
          const tokenId = event.returnValues.tokenId;
          const patientAddress = event.returnValues.patient;

          const result = await contract.methods
            .getMedicalRecord(patientAddress)
            .call();
          if (result && result[2] === requests[0]?.doctorName) {
            // Match hospitalName
            return {
              tokenId,
              patientName: result[0],
              ipfsHash: result[1],
              hospitalName: result[2],
            };
          }
          return null;
        }),
      );

      setMedicalRecords(filteredRecords.filter(Boolean));
      console.log('Medical records matching doctor:', filteredRecords);
    } catch (error) {
      console.error('Error fetching medical records:', error.message);
    }
  }, [contract, requests]);

  const approveRequest = async tokenId => {
    try {
      await contract.methods
        .verifyByInsurance(tokenId)
        .send({ from: accounts[0] });
      alert(`Verification request for Token ID ${tokenId} approved successfully.`);
      fetchRequests(); // Refresh the list of requests after approval
    } catch (error) {
      console.error('Error approving request:', error.message);
      alert('Failed to approve request. Please try again.');
    }
  };

  useEffect(() => {
    checkInsuranceRegistration();
    fetchInsuranceName();
  }, [checkInsuranceRegistration, fetchInsuranceName]);

  useEffect(() => {
    if (insuranceName) {
      fetchRequests();
    }
  }, [insuranceName, fetchRequests]);

  useEffect(() => {
    if (requests.length > 0) {
      fetchMedicalRecords();
    }
  }, [requests, fetchMedicalRecords]);

  if (!isRegistered) {
    return (
      <div className="error-message">
        <h2>⚠️ Registration Required</h2>
        <p>You are not a registered insurance company. Please contact the administrator to register your account on the blockchain.</p>
        <p style={{ marginTop: '1rem', fontSize: '0.9rem', opacity: 0.8 }}>
          Make sure you registered with MetaMask and the transaction was confirmed.
        </p>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="logout-container">
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="insurance-portal">
        <header className="portal-header">
          <h2>Insurance Company Portal - MediChain</h2>
          <p style={{ marginTop: '0.5rem', color: '#64748b', fontSize: '0.9rem' }}>
            Review and verify medical records requested by doctors
          </p>
        </header>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3>📋 Verification Requests</h3>
          <button 
            className="refresh-button"
            onClick={() => {
              fetchRequests();
              fetchMedicalRecords();
            }}
            title="Refresh requests"
          >
            🔄 Refresh
          </button>
        </div>
        {requests.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
            No verification requests at this time. Doctors will request verification for patient records here.
          </p>
        ) : (
          <div className="list-container">
            <ul className="requests-list">
              {requests.map(request => (
                <li key={request.tokenId} className="request-card">
                  <div className="request-header">
                    <strong>Token ID:</strong> {String(request.tokenId) || 'N/A'}
                  </div>
                  <div className="request-details">
                    <strong>Requested by:</strong> {request.doctorName} ({request.doctor})
                  </div>
                  <div className="request-actions">
                    {request.isVerified ? (
                      <span className="verified-badge">✅ Verified</span>
                    ) : (
                      <button 
                        className="approve-button"
                        onClick={() => approveRequest(request.tokenId)}
                      >
                        Approve Verification
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {medicalRecords.length > 0 && (
          <>
            <h3>🏥 Medical Records for Verification</h3>
            <ul className="records-list">
              {medicalRecords.map(record => (
                <li key={record.tokenId} className="record-card">
                  <div className="record-header">
                    <strong>Token ID:</strong> {String(record.tokenId) || 'N/A'}
                    <br />
                    <strong>Patient:</strong> {record.patientName}
                    <br />
                    <strong>Hospital:</strong> {record.hospitalName}
                  </div>
                  <div className="record-actions">
                    <a
                      href={`https://gateway.pinata.cloud/ipfs/${record.ipfsHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="view-record-link"
                    >
                      📄 View Medical Record
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
};

export default InsurancePortal;
