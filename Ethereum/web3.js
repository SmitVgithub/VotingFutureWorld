import Web3 from 'web3';

let web3;

if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
	if (window.ethereum) {
		window.ethereum.request({ method: 'eth_requestAccounts' }).catch((err) => {
			if (process.env.NODE_ENV === 'development') {
				console.error('User denied account access:', err);
			}
		});
	}
	web3 = new Web3(window.ethereum || window.web3.currentProvider);
	if (process.env.NODE_ENV === 'development') {
		console.log('Web3 initialized with browser provider');
	}
} else {
	const rpcUrl = process.env.WEB3_RPC_URL || process.env.INFURA_RPC_URL;
	if (!rpcUrl) {
		throw new Error('WEB3_RPC_URL environment variable is not set');
	}
	const provider = new Web3.providers.HttpProvider(rpcUrl);
	web3 = new Web3(provider);
	if (process.env.NODE_ENV === 'development') {
		console.log('Web3 initialized with HTTP provider');
	}
}

export default web3;
