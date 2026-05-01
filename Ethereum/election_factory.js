import web3 from './web3';
import ElectionFactory from './Build/ElectionFact.json';

// Contract address should be configured via environment variable
const CONTRACT_ADDRESS = process.env.REACT_APP_ELECTION_FACTORY_ADDRESS || process.env.ELECTION_FACTORY_ADDRESS;

/**
 * Validates an Ethereum address format
 * @param {string} address - The address to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function isValidEthereumAddress(address) {
    if (!address || typeof address !== 'string') {
        return false;
    }
    return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Safely parses the contract ABI interface
 * @param {string|object} contractInterface - The contract interface to parse
 * @returns {object} - Parsed ABI
 * @throws {Error} - If parsing fails
 */
function parseContractInterface(contractInterface) {
    if (!contractInterface) {
        throw new Error('Contract interface is undefined or null');
    }
    
    // If already an object, return as-is
    if (typeof contractInterface === 'object') {
        return contractInterface;
    }
    
    try {
        return JSON.parse(contractInterface);
    } catch (error) {
        throw new Error(`Failed to parse contract interface: ${error.message}`);
    }
}

/**
 * Creates and returns the ElectionFactory contract instance
 * @returns {object} - Web3 contract instance
 */
function createContractInstance() {
    // Validate contract address
    if (!CONTRACT_ADDRESS) {
        throw new Error('Election Factory contract address is not configured. Set REACT_APP_ELECTION_FACTORY_ADDRESS or ELECTION_FACTORY_ADDRESS environment variable.');
    }
    
    if (!isValidEthereumAddress(CONTRACT_ADDRESS)) {
        throw new Error(`Invalid Ethereum address format: ${CONTRACT_ADDRESS}`);
    }
    
    // Parse and validate contract interface
    const abi = parseContractInterface(ElectionFactory.interface);
    
    // Create and return contract instance
    return new web3.eth.Contract(abi, CONTRACT_ADDRESS);
}

const instance = createContractInstance();

export default instance;
