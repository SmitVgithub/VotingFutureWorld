import web3 from './web3';
import Election from './Build/Election.json';

/**
 * Creates a web3 contract instance for the Election contract
 * @param {string} address - The Ethereum address of the deployed contract
 * @returns {Object} Web3 contract instance
 * @throws {Error} If address is invalid or ABI parsing fails
 */
export default address => {
    // Validate Ethereum address format
    if (!address || typeof address !== 'string') {
        throw new Error('Contract address is required and must be a string');
    }
    
    if (!web3.utils.isAddress(address)) {
        throw new Error(`Invalid Ethereum address: ${address}`);
    }
    
    // Validate and parse the contract ABI
    let abi;
    try {
        if (!Election.interface) {
            throw new Error('Election contract interface is undefined');
        }
        abi = JSON.parse(Election.interface);
    } catch (parseError) {
        throw new Error(`Failed to parse Election contract ABI: ${parseError.message}`);
    }
    
    // Validate ABI structure
    if (!Array.isArray(abi) || abi.length === 0) {
        throw new Error('Invalid contract ABI: must be a non-empty array');
    }
    
    // Use checksum address for additional security
    const checksumAddress = web3.utils.toChecksumAddress(address);
    
    return new web3.eth.Contract(abi, checksumAddress);
};
