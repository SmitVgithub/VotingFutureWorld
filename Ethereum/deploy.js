const assert = require('assert');
const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const eF = require('./Build/ElectionFact.json');

// Validate required environment variables
if (!process.env.WALLET_MNEMONIC) {
	throw new Error('WALLET_MNEMONIC environment variable is required');
}
if (!process.env.INFURA_ENDPOINT) {
	throw new Error('INFURA_ENDPOINT environment variable is required');
}

const provider = new HDWalletProvider(
	process.env.WALLET_MNEMONIC,
	process.env.INFURA_ENDPOINT
);
const web3 = new Web3(provider);

const deploy = async () => {
	const accounts = await web3.eth.getAccounts();

	console.log('Attemping to deploy from account', accounts[0]);

	const result = await new web3.eth.Contract(JSON.parse(eF.interface))
		.deploy({ data: '0x' + eF.bytecode })
		.send({ gas: '3000000', from: accounts[0] });

	console.log('Contract deployed to: ', result.options.address);
};
deploy();
