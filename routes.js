const routes = require('next-routes')();

// Regex pattern for validating Ethereum addresses (0x followed by 40 hex characters)
// Adjust this pattern based on your specific address format requirements
const addressPattern = '0x[a-fA-F0-9]{40}';

routes
    .add('/homepage', '/homepage')
    .add('/company_login', '/company_login')
    .add('/voter_login', '/voter_login')
    .add('/election/:address/company_dashboard', '/election/company_dashboard', { address: addressPattern })
    .add('/election/:address/voting_list', '/election/voting_list', { address: addressPattern })
    .add('/election/:address/addcand', '/election/addcand', { address: addressPattern })
    .add('/election/:address/vote', '/election/vote', { address: addressPattern })
    .add('/election/:address/candidate_list', '/election/candidate_list', { address: addressPattern });

module.exports = routes;