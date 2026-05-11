import Web3 from 'web3';

let web3;

const initWeb3 = async () => {
	if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
		try {
			// Request account access using modern method
			await window.ethereum.request({ method: 'eth_requestAccounts' });
			web3 = new Web3(window.ethereum);
			console.log('Web3 initialized with browser provider');
		} catch (error) {
			console.error('User denied account access:', error);
			throw error;
		}
	} else {
		// Fallback to Infura provider using environment variable
		const infuraApiKey = process.env.INFURA_API_KEY;
		if (!infuraApiKey) {
			throw new Error('INFURA_API_KEY environment variable is not set');
		}
		const providerUrl = `https://rinkeby.infura.io/v3/${infuraApiKey}`;
		const provider = new Web3.providers.HttpProvider(providerUrl);
		web3 = new Web3(provider);
		console.log('Web3 initialized with Infura provider');
	}
	return web3;
};

// Initialize web3 instance
const web3Promise = initWeb3();

export { web3Promise };
export default web3;
