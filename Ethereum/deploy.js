const assert = require('assert');
const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const eF = require('./Build/ElectionFact.json');

// Validate required environment variables
if (!process.env.MNEMONIC) {
	console.error('Error: MNEMONIC environment variable is required');
	process.exit(1);
}

if (!process.env.INFURA_URL) {
	console.error('Error: INFURA_URL environment variable is required');
	process.exit(1);
}

const provider = new HDWalletProvider(
	process.env.MNEMONIC,
	process.env.INFURA_URL
);
const web3 = new Web3(provider);

const deploy = async () => {
	try {
		// Validate contract artifacts
		if (!eF.interface || !eF.bytecode) {
			throw new Error('Invalid contract artifacts: missing interface or bytecode');
		}

		let contractInterface;
		try {
			contractInterface = JSON.parse(eF.interface);
		} catch (parseError) {
			throw new Error('Failed to parse contract interface: ' + parseError.message);
		}

		if (!Array.isArray(contractInterface)) {
			throw new Error('Contract interface must be an array');
		}

		const accounts = await web3.eth.getAccounts();

		if (!accounts || accounts.length === 0) {
			throw new Error('No accounts available for deployment');
		}

		console.log('Attempting to deploy from account', accounts[0]);

		const result = await new web3.eth.Contract(contractInterface)
			.deploy({ data: '0x' + eF.bytecode })
			.send({ gas: '3000000', from: accounts[0] });

		console.log('Contract deployed to:', result.options.address);
		
		// Properly close the provider connection
		provider.engine.stop();
		
		return result.options.address;
	} catch (error) {
		console.error('Deployment failed:', error.message);
		// Ensure provider is stopped even on error
		if (provider && provider.engine) {
			provider.engine.stop();
		}
		process.exit(1);
	}
};

deploy();
