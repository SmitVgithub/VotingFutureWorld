import web3 from './web3';
import Election from './Build/Election.json';

/**
 * Creates a web3 contract instance for the Election contract
 * @param {string} address - The Ethereum address of the deployed contract
 * @returns {Object} Web3 contract instance
 * @throws {Error} If address is invalid or ABI is malformed
 */
export default address => {
    // Validate that address is provided and is a valid Ethereum address
    if (!address || typeof address !== 'string') {
        throw new Error('Contract address is required and must be a string');
    }
    
    // Validate Ethereum address format
    if (!web3.utils.isAddress(address)) {
        throw new Error(`Invalid Ethereum address: ${address}`);
    }
    
    // Validate that Election.interface exists
    if (!Election || !Election.interface) {
        throw new Error('Election contract ABI not found. Ensure the contract is compiled.');
    }
    
    // Safely parse the contract ABI
    let abi;
    try {
        abi = JSON.parse(Election.interface);
    } catch (parseError) {
        throw new Error(`Failed to parse Election contract ABI: ${parseError.message}`);
    }
    
    // Validate ABI structure
    if (!Array.isArray(abi) || abi.length === 0) {
        throw new Error('Invalid contract ABI: expected non-empty array');
    }
    
    // Validate ABI entries have required properties
    const isValidAbi = abi.every(item => 
        item && typeof item === 'object' && 
        (item.type === 'function' || item.type === 'event' || 
         item.type === 'constructor' || item.type === 'fallback' ||
         item.type === 'receive')
    );
    
    if (!isValidAbi) {
        throw new Error('Invalid contract ABI structure: entries must have valid type property');
    }
    
    return new web3.eth.Contract(abi, address);
};