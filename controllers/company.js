const CompanyModel = require('../models/company');
const bcrypt = require('bcrypt');
const validator = require('validator');

const SALT_ROUNDS = 12;

// Helper function to sanitize string input for MongoDB
function sanitizeInput(input) {
    if (typeof input !== 'string') {
        return null;
    }
    return input.trim();
}

// Validate email format
function isValidEmail(email) {
    return email && typeof email === 'string' && validator.isEmail(email);
}

// Validate password requirements
function isValidPassword(password) {
    return password && typeof password === 'string' && password.length >= 8;
}

module.exports = {
    create: async function(req, res, cb) {
        try {
            const email = sanitizeInput(req.body.email);
            const password = sanitizeInput(req.body.password);

            // Input validation
            if (!isValidEmail(email)) {
                return res.status(400).json({status: "error", message: "Invalid email format", data: null});
            }

            if (!isValidPassword(password)) {
                return res.status(400).json({status: "error", message: "Password must be at least 8 characters", data: null});
            }

            const existingCompany = await CompanyModel.findOne({email: email}).exec();
            
            if (existingCompany) {
                return res.json({status: "error", message: "Company already exists", data: null});
            }

            // Hash password before storing
            const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

            const newCompany = await CompanyModel.create({
                email: email,
                password: hashedPassword
            });

            res.json({
                status: "success",
                message: "Company added successfully!!!",
                data: {id: newCompany._id}
            });

        } catch (err) {
            cb(err);
        }
    },

    authenticate: async function(req, res, cb) {
        try {
            const email = sanitizeInput(req.body.email);
            const password = sanitizeInput(req.body.password);

            // Input validation
            if (!isValidEmail(email) || !password) {
                return res.status(400).json({status: "error", message: "Invalid email/password!!!", data: null});
            }

            const CompanyInfo = await CompanyModel.findOne({email: email}).exec();

            // Use constant-time comparison to prevent timing attacks
            // Always perform password comparison even if user not found
            const dummyHash = '$2b$12$dummy.hash.for.timing.attack.prevention';
            const hashToCompare = CompanyInfo ? CompanyInfo.password : dummyHash;
            
            const isPasswordValid = await bcrypt.compare(password, hashToCompare);

            if (CompanyInfo && isPasswordValid) {
                res.json({
                    status: "success",
                    message: "Company found!!!",
                    data: {
                        id: CompanyInfo._id,
                        email: CompanyInfo.email
                    }
                });
            } else {
                // Generic error message to prevent user enumeration
                res.status(401).json({status: "error", message: "Invalid email/password!!!", data: null});
            }

        } catch (err) {
            cb(err);
        }
    }
};
