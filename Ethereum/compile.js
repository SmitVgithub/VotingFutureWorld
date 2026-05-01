const path = require("path");
const fs = require("fs-extra");
const solc = require("solc");

// Validate that a path is within the expected base directory
function validatePath(resolvedPath, baseDir) {
    const normalizedPath = path.normalize(resolvedPath);
    const normalizedBase = path.normalize(baseDir);
    if (!normalizedPath.startsWith(normalizedBase)) {
        throw new Error(`Path traversal detected: ${resolvedPath} is outside ${baseDir}`);
    }
    return normalizedPath;
}

const projectDir = __dirname;
const buildPath = validatePath(path.resolve(projectDir, 'Build'), projectDir);
const contractDir = validatePath(path.resolve(projectDir, 'Contract'), projectDir);
const contractPath = validatePath(path.resolve(contractDir, 'Election.sol'), contractDir);

try {
    // Safely remove build directory after validation
    fs.removeSync(buildPath);
} catch (err) {
    console.error(`Error removing build directory: ${err.message}`);
    process.exit(1);
}

let source;
try {
    // Validate file exists before reading
    if (!fs.existsSync(contractPath)) {
        throw new Error(`Contract file not found: ${contractPath}`);
    }
    source = fs.readFileSync(contractPath, 'utf-8');
} catch (err) {
    console.error(`Error reading contract file: ${err.message}`);
    process.exit(1);
}

// Use modern JSON-based compilation API
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
                '*': ['abi', 'evm.bytecode']
            }
        }
    }
};

let output;
try {
    output = JSON.parse(solc.compile(JSON.stringify(input)));
} catch (err) {
    console.error(`Compilation failed: ${err.message}`);
    process.exit(1);
}

// Check for compilation errors
if (output.errors) {
    const errors = output.errors.filter(e => e.severity === 'error');
    const warnings = output.errors.filter(e => e.severity === 'warning');
    
    if (warnings.length > 0) {
        console.warn('Compilation warnings:');
        warnings.forEach(w => console.warn(w.formattedMessage));
    }
    
    if (errors.length > 0) {
        console.error('Compilation errors:');
        errors.forEach(e => console.error(e.formattedMessage));
        process.exit(1);
    }
}

if (!output.contracts || Object.keys(output.contracts).length === 0) {
    console.error('No contracts compiled');
    process.exit(1);
}

try {
    fs.ensureDirSync(buildPath);
} catch (err) {
    console.error(`Error creating build directory: ${err.message}`);
    process.exit(1);
}

try {
    for (const fileName in output.contracts) {
        for (const contractName in output.contracts[fileName]) {
            // Sanitize contract name to prevent path traversal in output
            const sanitizedName = contractName.replace(/[^a-zA-Z0-9_-]/g, '');
            const outputPath = validatePath(
                path.resolve(buildPath, `${sanitizedName}.json`),
                buildPath
            );
            
            fs.outputJsonSync(outputPath, output.contracts[fileName][contractName]);
            console.log(`Compiled: ${sanitizedName}.json`);
        }
    }
} catch (err) {
    console.error(`Error writing contract output: ${err.message}`);
    process.exit(1);
}

console.log('Compilation completed successfully');
