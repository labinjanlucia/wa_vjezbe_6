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
        console.error('greska prilikom citanja glumaca:', error);
        return [];
    }
};

const writeGlumciToFile = async (glumci) => {
    try {
        await fs.writeFile(glumciFilePath, JSON.stringify(glumci, null, 2));
    } catch (error) {
        console.error('greska prilikom pisanja glumaca:', error);
        throw error;
    }
};

router.get('/', async (req, res) => {
    try {
        let actors = await readGlumciFromFile();
        res.json(actors);
    } catch (error) {
        res.status(500).send('Greska kod citanja podataka o glumcima');
    }
});

router.get('/:id', async (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
        return res.status(400).json({ message: 'krivi id' });
    }

    try {
        const actors = await readGlumciFromFile();
        const actor = actors.find(a => a.id === id);

        if (actor) {
            res.json(actor);
        } else {
            res.status(404).json({ message: 'glumac nije pronaden.' });
        }
    } catch (error) {
        res.status(500).send('greska prilikom citanja podataka o glumcima');
    }
});

router.post("/", async (req, res) => {
    const { id, name, age, movies } = req.body;

    if (!id || !name || !age || !movies) {
        return res.status(400).send('All fields are required: id, name, age, movies.');
    }

    try {
        const actors = await readGlumciFromFile();

        if (actors.some(actor => actor.id === id)) {
            return res.status(400).send('Actor with the same ID already exists.');
        }

        const newActor = { id, name, age, movies };
        actors.push(newActor);
        await writeGlumciToFile(actors);

        res.status(201).send('Actor added successfully.');
    } catch (error) {
        res.status(500).send('Error saving actor data.');
    }
});

router.patch('/glumci/:id', async (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid ID format.' });
    }

    try {
        const actors = await readGlumciFromFile();
        const actorIndex = actors.findIndex(a => a.id === id);

        if (actorIndex === -1) {
            return res.status(404).json({ message: 'Actor not found.' });
        }

        actors[actorIndex] = { ...actors[actorIndex], ...req.body };
        await writeGlumciToFile(actors);

        res.json(actors[actorIndex]);
    } catch (error) {
        res.status(500).send('Error updating actor data.');
    }
});

export default router;
