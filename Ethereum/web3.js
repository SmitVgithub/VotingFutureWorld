import Web3 from 'web3';

let web3;

const initWeb3 = async () => {
	if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
		try {
			// Request account access using modern API
			await window.ethereum.request({ method: 'eth_requestAccounts' });
			web3 = new Web3(window.ethereum);
			if (process.env.NODE_ENV === 'development') {
				console.log('Web3 initialized with browser provider');
			}
		} catch (error) {
			console.error('User denied account access');
			throw error;
		}
	} else {
		// Fallback to Infura provider using environment variable
		const infuraApiKey = process.env.INFURA_API_KEY || process.env.REACT_APP_INFURA_API_KEY;
		if (!infuraApiKey) {
			throw new Error('INFURA_API_KEY environment variable is not set');
		}
		const provider = new Web3.providers.HttpProvider(`https://sepolia.infura.io/v3/${infuraApiKey}`);
		web3 = new Web3(provider);
		if (process.env.NODE_ENV === 'development') {
			console.log('Web3 initialized with Infura provider');
		}
	}
	return web3;
};

// Initialize web3 for synchronous exports (legacy support)
if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
	web3 = new Web3(window.ethereum);
} else {
	const infuraApiKey = process.env.INFURA_API_KEY || process.env.REACT_APP_INFURA_API_KEY;
	if (infuraApiKey) {
		const provider = new Web3.providers.HttpProvider(`https://sepolia.infura.io/v3/${infuraApiKey}`);
		web3 = new Web3(provider);
	}
}

export { initWeb3 };
export default web3;
