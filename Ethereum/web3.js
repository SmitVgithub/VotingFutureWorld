import Web3 from 'web3';

let web3;

const initWeb3 = async () => {
	if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
		try {
			// Request account access using modern method
			await window.ethereum.request({ method: 'eth_requestAccounts' });
			web3 = new Web3(window.ethereum);
		} catch (error) {
			// User denied account access or error occurred
			throw new Error('Failed to connect to wallet. Please authorize the connection.');
		}
	} else if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
		// Legacy dapp browsers
		web3 = new Web3(window.web3.currentProvider);
	} else {
		// Fallback to Infura provider using environment variable
		const infuraApiKey = process.env.INFURA_API_KEY;
		const infuraNetwork = process.env.INFURA_NETWORK || 'mainnet';
		
		if (!infuraApiKey) {
			throw new Error('INFURA_API_KEY environment variable is not set');
		}
		
		const provider = new Web3.providers.HttpProvider(
			`https://${infuraNetwork}.infura.io/v3/${infuraApiKey}`
		);
		web3 = new Web3(provider);
	}
	
	return web3;
};

export { initWeb3 };
export default web3;
