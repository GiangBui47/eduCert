import pinataSDK from '@pinata/sdk';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';

dotenv.config();

// Initialize Pinata with JWT
let { PINATA_JWT } = process.env;
if (!PINATA_JWT || typeof PINATA_JWT !== 'string' || PINATA_JWT.trim().length === 0) {
    console.error('PINATA_JWT is missing or empty. Please set PINATA_JWT in your environment without quotes.');
}
// Sanitize common misconfigurations: remove surrounding quotes and accidental 'Bearer ' prefix
if (PINATA_JWT) {
    const trimmed = PINATA_JWT.trim();
    const withoutQuotes = (trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith('\'') && trimmed.endsWith('\''))
        ? trimmed.slice(1, -1)
        : trimmed;
    const withoutBearer = withoutQuotes.startsWith('Bearer ')
        ? withoutQuotes.slice('Bearer '.length)
        : withoutQuotes;
    PINATA_JWT = withoutBearer;
    if (PINATA_JWT.split('.').length < 3) {
        console.warn('PINATA_JWT does not look like a JWT (missing dot segments). Please verify the token value.');
    }
}
const pinata = new pinataSDK({ pinataJWTKey: PINATA_JWT });

/**
 * Upload content to IPFS via Pinata
 * @param {string|Buffer} content - File path or buffer to upload
 * @param {string} [filename] - Optional filename for buffer uploads
 */
async function uploadToPinata(content, filename) {
    try {
        let readableStream;
        let options = { pinataMetadata: {} };

        if (Buffer.isBuffer(content)) {
            // Handle buffer input
            readableStream = Readable.from(content);
            options.pinataMetadata.name = filename || `certificate_${Date.now()}.png`;
            console.log('Uploading buffer to Pinata...');
        } else if (typeof content === 'string') {
            // Handle file path input
            console.log('Reading file from:', content);
            readableStream = fs.createReadStream(content);
            options.pinataMetadata.name = path.basename(content);
            console.log('Uploading file to Pinata...');
        } else {
            throw new Error('Invalid input: must be a file path or buffer');
        }

        const result = await pinata.pinFileToIPFS(readableStream, options);
        console.log('Upload result:', result);
        return result;
    } catch (error) {
        const status = error?.response?.status;
        const data = error?.response?.data;
        const message = error?.message || String(error);
        console.error('Error uploading to Pinata:', {
            status,
            message,
            details: data || (error?.details || undefined)
        });
        throw error;
    }
}

export { uploadToPinata };
