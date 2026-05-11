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
				console.error('User denied account access:', error.message);
			}
			throw error;
		}
	} else if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
		// Legacy dapp browsers
		web3 = new Web3(window.web3.currentProvider);
		if (process.env.NODE_ENV === 'development') {
			console.log('Web3 initialized with legacy provider');
		}
	} else {
		// Fallback to Infura
		const infuraApiKey = process.env.INFURA_API_KEY;
		const infuraNetwork = process.env.INFURA_NETWORK || 'mainnet';
		
		if (!infuraApiKey) {
			throw new Error('INFURA_API_KEY environment variable is not set');
		}
		
		const provider = new Web3.providers.HttpProvider(
			`https://${infuraNetwork}.infura.io/v3/${infuraApiKey}`
		);
		web3 = new Web3(provider);
		if (process.env.NODE_ENV === 'development') {
			console.log('Web3 initialized with Infura provider');
		}
	}
	
	return web3;
};

// Initialize immediately for backward compatibility
if (typeof window !== 'undefined') {
	initWeb3().catch((error) => {
		if (process.env.NODE_ENV === 'development') {
			console.error('Failed to initialize Web3:', error.message);
		}
	});
} else {
	initWeb3();
}

export { initWeb3 };
export default web3;
