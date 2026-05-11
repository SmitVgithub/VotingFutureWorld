import web3 from './web3';
import ElectionFactory from './Build/ElectionFact.json';

const contractAddress = process.env.ELECTION_FACTORY_ADDRESS;

if (!contractAddress) {
	throw new Error('ELECTION_FACTORY_ADDRESS environment variable is not set');
}

const instance = new web3.eth.Contract(
	JSON.parse(ElectionFactory.interface),
	contractAddress
);

export default instance;
