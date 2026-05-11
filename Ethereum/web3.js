import Web3 from 'web3';

let web3;

if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
	// Use modern eth_requestAccounts instead of deprecated enable()
	window.ethereum.request({ method: 'eth_requestAccounts' }).catch((err) => {
		if (process.env.NODE_ENV !== 'production') {
			console.error('User denied account access:', err);
		}
	});
	web3 = new Web3(window.ethereum);
	if (process.env.NODE_ENV !== 'production') {
		console.log('Web3 initialized with browser provider');
	}
} else {
	const infuraApiKey = process.env.INFURA_API_KEY;
	if (!infuraApiKey) {
		throw new Error('INFURA_API_KEY environment variable is not set');
	}
	const infuraNetwork = process.env.INFURA_NETWORK || 'mainnet';
	const provider = new Web3.providers.HttpProvider(`https://${infuraNetwork}.infura.io/v3/${infuraApiKey}`);
	web3 = new Web3(provider);
	if (process.env.NODE_ENV !== 'production') {
		console.log('Web3 initialized with Infura provider');
	}
}

export default web3;
