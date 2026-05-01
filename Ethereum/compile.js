const path = require("path");
const fs = require("fs-extra");
const solc = require("solc");

// Define expected base directory for security validation
const baseDir = path.resolve(__dirname);

/**
 * Validates that a path is within the expected base directory
 * @param {string} targetPath - Path to validate
 * @param {string} allowedBase - Allowed base directory
 * @returns {boolean} - True if path is safe
 */
function isPathSafe(targetPath, allowedBase) {
    const resolvedTarget = path.resolve(targetPath);
    const resolvedBase = path.resolve(allowedBase);
    return resolvedTarget.startsWith(resolvedBase + path.sep) || resolvedTarget === resolvedBase;
}

const buildPath = path.resolve(__dirname, 'Build');

// Validate build path is within expected directory before deletion
if (!isPathSafe(buildPath, baseDir)) {
    throw new Error('Build path is outside of expected directory');
}

fs.removeSync(buildPath); // deletes the build folder

const contractPath = path.resolve(__dirname, 'Contract', 'Election.sol');

// Validate contract path is within expected directory
if (!isPathSafe(contractPath, baseDir)) {
    throw new Error('Contract path is outside of expected directory');
}

// Check if source file exists before reading
if (!fs.existsSync(contractPath)) {
    throw new Error(`Contract file not found: ${contractPath}`);
}

const source = fs.readFileSync(contractPath, 'utf-8');

// Use modern solc JSON input/output format
const input = {
    language: 'Solidity',
    sources: {
        'Election.sol': {
            content: source
        }
    },
    settings: {
        outputSelection: {
            '*': {
                '*': ['abi', 'evm.bytecode', 'evm.deployedBytecode']
            }
        }
    }
};

const compiledOutput = JSON.parse(solc.compile(JSON.stringify(input)));

// Check for compilation errors
if (compiledOutput.errors) {
    const errors = compiledOutput.errors.filter(error => error.severity === 'error');
    if (errors.length > 0) {
        console.error('Compilation errors:');
        errors.forEach(error => console.error(error.formattedMessage));
        throw new Error('Solidity compilation failed');
    }
    
    // Log warnings
    const warnings = compiledOutput.errors.filter(error => error.severity === 'warning');
    if (warnings.length > 0) {
        console.warn('Compilation warnings:');
        warnings.forEach(warning => console.warn(warning.formattedMessage));
    }
}

// Validate contracts exist in output
if (!compiledOutput.contracts || Object.keys(compiledOutput.contracts).length === 0) {
    throw new Error('No contracts found in compilation output');
}

fs.ensureDirSync(buildPath); // checks if exists; if doesn't, create one

// Use Object.keys to avoid prototype pollution issues
Object.keys(compiledOutput.contracts).forEach(sourceFile => {
    const contracts = compiledOutput.contracts[sourceFile];
    Object.keys(contracts).forEach(contractName => {
        const contract = contracts[contractName];
        const outputPath = path.resolve(buildPath, `${contractName}.json`);
        
        // Validate output path is within build directory
        if (!isPathSafe(outputPath, buildPath)) {
            throw new Error(`Output path is outside of build directory: ${outputPath}`);
        }
        
        fs.outputJsonSync(outputPath, {
            abi: contract.abi,
            bytecode: contract.evm.bytecode.object,
            deployedBytecode: contract.evm.deployedBytecode.object
        });
        
        console.log(`Compiled: ${contractName}`);
    });
});

console.log('Compilation completed successfully');
