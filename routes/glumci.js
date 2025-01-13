import express from 'express';
import fs from "fs/promises";
import path from "path";

const router = express.Router();

const glumciFilePath = path.join('data', 'glumci.json');

const readGlumciFromFile = async () => {
    try {
        const data = await fs.readFile(glumciFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('greska prilikom citanja:', error);
        return [];
    }
};

const writeGlumciToFile = async (glumci) => {
    try {
        await fs.writeFile(glumciFilePath, JSON.stringify(glumci, null, 2));
    } catch (error) {
        console.error('greska prilikom pisanja:', error);
        throw error;
    }
};


export default router;

