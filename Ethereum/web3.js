import Web3 from 'web3';

let web3;

const initializeWeb3 = async () => {
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
				console.error('User denied account access:', error);
			}
			throw error;
		}
	} else {
		const infuraUrl = process.env.INFURA_URL || process.env.REACT_APP_INFURA_URL || process.env.NEXT_PUBLIC_INFURA_URL;
		if (!infuraUrl) {
			throw new Error('INFURA_URL environment variable is not configured');
		}
		const provider = new Web3.providers.HttpProvider(infuraUrl);
		web3 = new Web3(provider);
		if (process.env.NODE_ENV === 'development') {
			console.log('Web3 initialized with Infura provider');
		}
	}
	return web3;
};

// Initialize web3 for non-browser environments or when immediate initialization is needed
if (typeof window === 'undefined') {
	const infuraUrl = process.env.INFURA_URL;
	if (infuraUrl) {
		const provider = new Web3.providers.HttpProvider(infuraUrl);
		web3 = new Web3(provider);
	}
}

export { initializeWeb3 };
export default web3;
