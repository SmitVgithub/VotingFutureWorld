import Web3 from 'web3';

let web3;

const initWeb3 = async () => {
	if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
		try {
			// Request account access using modern method
			await window.ethereum.request({ method: 'eth_requestAccounts' });
			web3 = new Web3(window.ethereum);
			
			if (process.env.NODE_ENV === 'development') {
				console.log('Web3 initialized with browser provider');
			}
		} catch (error) {
			if (process.env.NODE_ENV === 'development') {
				console.error('User denied account access or error occurred:', error);
			}
			throw error;
		}
	} else {
		// Fallback to Infura provider using environment variable
		const infuraApiKey = process.env.INFURA_API_KEY || process.env.REACT_APP_INFURA_API_KEY;
		
		if (!infuraApiKey) {
			throw new Error('INFURA_API_KEY environment variable is not set');
		}
		
		const provider = new Web3.providers.HttpProvider(
			`https://sepolia.infura.io/v3/${infuraApiKey}`
		);
		web3 = new Web3(provider);
		
		if (process.env.NODE_ENV === 'development') {
			console.log('Web3 initialized with Infura provider');
		}
	}
	
	return web3;
};

// Initialize web3 and export both the instance and the init function
const web3Promise = initWeb3();

export { initWeb3, web3Promise };
export default web3;
