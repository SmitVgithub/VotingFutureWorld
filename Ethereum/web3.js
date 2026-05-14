import Web3 from 'web3';

let web3;

const initWeb3 = async () => {
	if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
		try {
			// Request account access using modern method
			await window.ethereum.request({ method: 'eth_requestAccounts' });
			web3 = new Web3(window.ethereum);
			if (process.env.NODE_ENV !== 'production') {
				console.log('Web3 initialized with browser provider');
			}
		} catch (error) {
			if (process.env.NODE_ENV !== 'production') {
				console.error('User denied account access:', error);
			}
			throw error;
		}
	} else {
		const infuraApiKey = process.env.INFURA_API_KEY;
		if (!infuraApiKey) {
			throw new Error('INFURA_API_KEY environment variable is not set');
		}
		const providerUrl = process.env.WEB3_PROVIDER_URL || `https://rinkeby.infura.io/v3/${infuraApiKey}`;
		const provider = new Web3.providers.HttpProvider(providerUrl);
		web3 = new Web3(provider);
		if (process.env.NODE_ENV !== 'production') {
			console.log('Web3 initialized with HTTP provider');
		}
	}
	return web3;
};

// Initialize web3 for non-browser environments or export the initializer
if (typeof window === 'undefined') {
	const infuraApiKey = process.env.INFURA_API_KEY;
	if (infuraApiKey) {
		const providerUrl = process.env.WEB3_PROVIDER_URL || `https://rinkeby.infura.io/v3/${infuraApiKey}`;
		const provider = new Web3.providers.HttpProvider(providerUrl);
		web3 = new Web3(provider);
	}
}

export { initWeb3 };
export default web3;
