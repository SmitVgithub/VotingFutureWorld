const assert = require('assert');
const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const eF = require('./Build/ElectionFact.json');

// Load sensitive configuration from environment variables
const MNEMONIC = process.env.MNEMONIC;
const INFURA_URL = process.env.INFURA_URL;

// Validate required environment variables
if (!MNEMONIC) {
	console.error('Error: MNEMONIC environment variable is not set');
	process.exit(1);
}

if (!INFURA_URL) {
	console.error('Error: INFURA_URL environment variable is not set');
	process.exit(1);
}

const provider = new HDWalletProvider(
	MNEMONIC,
	INFURA_URL
);
const web3 = new Web3(provider);

const deploy = async () => {
	try {
		// Validate contract data before deployment
		if (!eF.interface || !eF.bytecode) {
			throw new Error('Invalid contract build file: missing interface or bytecode');
		}

		let contractInterface;
		try {
			contractInterface = JSON.parse(eF.interface);
		} catch (parseError) {
			throw new Error('Failed to parse contract interface: ' + parseError.message);
		}

		if (!Array.isArray(contractInterface)) {
			throw new Error('Invalid contract interface format');
		}

		const accounts = await web3.eth.getAccounts();

		if (!accounts || accounts.length === 0) {
			throw new Error('No accounts available for deployment');
		}

		console.log('Attemping to deploy from account', accounts[0]);

		const result = await new web3.eth.Contract(contractInterface)
			.deploy({ data: '0x' + eF.bytecode })
			.send({ gas: '3000000', from: accounts[0] });

		console.log('Contract deployed to: ', result.options.address);
		
		// Properly close the provider connection
		provider.engine.stop();
		
		return result.options.address;
	} catch (error) {
		console.error('Deployment failed:', error.message);
		provider.engine.stop();
		process.exit(1);
	}
};

deploy();
