const fs = require('fs');
const path = require('path');
const MediChain = artifacts.require('MediChain');
const MediChainArtifact = require('../build/contracts/MediChain.json');

module.exports = async function (deployer, network, accounts) {
  await deployer.deploy(MediChain, { gas: 6500000 });

  const deployedAddress = MediChain.address;
  const abi = MediChainArtifact.abi;

  // Structure the contract data - support both common Ganache network IDs
  // This ensures compatibility regardless of which network ID Ganache uses
  const contractData = {
    abi, // Add the ABI directly
    networks: {
      '1337': { address: deployedAddress },
      '5777': { address: deployedAddress },
    },
  };

  // Paths for frontend and backend contract.json
  const frontendContractPath = path.resolve(
    __dirname,
    '../frontend/src/contract.json',
  );

  const backendContractPath = path.resolve(
    __dirname,
    '../my-app-backend/contract.json',
  );

  // Ensure directories exist before writing files
  const ensureDirectoryExists = filePath => {
    const dirPath = path.dirname(filePath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  };

  // Ensure frontend directory exists
  ensureDirectoryExists(frontendContractPath);

  // Write the contract data for the frontend
  fs.writeFileSync(frontendContractPath, JSON.stringify(contractData, null, 2));

  // Ensure backend directory exists
  ensureDirectoryExists(backendContractPath);

  // Write the contract data for the backend
  fs.writeFileSync(backendContractPath, JSON.stringify(contractData, null, 2));

  console.log(`Contract deployed at address: ${deployedAddress}`);
  console.log(`Frontend contract data saved to ${frontendContractPath}`);
  console.log(`Backend contract data saved to ${backendContractPath}`);
};
