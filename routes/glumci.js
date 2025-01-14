import express from 'express';
import fs from "fs/promises";
import path from "path";
import { validateIfActorExists } from '../middleware/middleware.js';
import { validateId } from '../middleware/middleware.js';
import { validateNameandchange  } from '../middleware/middleware.js';
import { validateActor  } from '../middleware/middleware.js';



const router = express.Router();


const glumciFilePath = path.join('data', 'glumci.json');

export const readGlumciFromFile = async () => {
    try {
        const data = await fs.readFile(glumciFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('greska prilikom citanja glumaca:', error);
        return [];
    }
};

export const writeGlumciToFile = async (glumci) => {
    try {
        await fs.writeFile(glumciFilePath, JSON.stringify(glumci, null, 2));
    } catch (error) {
        console.error('greska prilikom pisanja glumaca:', error);
        throw error;
    }
};
let actors = await readGlumciFromFile();

router.get('/',validateNameandchange, async (req, res) => {
    
    try {
        res.json(actors);
    } catch (error) {
        res.status(500).send('Greska kod citanja podataka o glumcima');
    }
});

const uzmiGlumce=()=>actors;

router.get('/:id', validateId, validateIfActorExists(uzmiGlumce), (req, res) => {
    console.log(req.id)

    res.json(req.actor); 
});


router.post("/", validateActor, async (req, res) => {
    const { id, name, age, movies } = req.body;

   
    try {
        
        const newActor = { id, name, age, movies };
        actors.push(newActor);
        

        res.status(201).send('Actor added successfully.');
    } catch (error) {
        res.status(500).send('Error saving actor data.');
    }
});

router.patch('/glumci/:id',validateActor, async (req, res) => {
    const id = parseInt(req.params.id, 10);
    

    try {
        const actors = await readGlumciFromFile();
        const actorIndex = actors.findIndex(a => a.id === id);


        actors[actorIndex] = { ...actors[actorIndex], ...req.body };
        await writeGlumciToFile(actors);

        res.json(actors[actorIndex]);
    } catch (error) {
        res.status(500).send('Error updating actor data.');
    }
});

export default router;
