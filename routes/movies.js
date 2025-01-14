import express from 'express';
import fs from "fs/promises";
import path from "path";
import { validateIfMovieExists } from '../middleware/middleware.js';
import { validateId } from '../middleware/middleware.js';
import { validateMovie, validateMovieUpdate } from '../middleware/middleware.js';
import { validateRange } from '../middleware/middleware.js';



const router = express.Router();

const moviesFilePath = path.join('data', 'movie.json');

const readMoviesFromFile = async () => {
    try {
        const data = await fs.readFile(moviesFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('greska prilikom citanja:', error);
        return [];
    }
};

const writeMoviesToFile = async (movies) => {
    try {
        await fs.writeFile(moviesFilePath, JSON.stringify(movies, null, 2));
    } catch (error) {
        console.error('greska prilikom pisanja:', error);
        throw error;
    }
};
let movies = await readMoviesFromFile();
router.get('/',validateRange, async (req, res) => {
    try {
       
        res.json(movies);
    } catch (error) {
        res.status(500).send('Greska kod citanja podataka');
    }
});

const uzmiFilm=()=>movies;

router.get('/:id', validateId, validateIfMovieExists(uzmiFilm), (req, res) => {
    

    res.json(req.movie); 
});
router.post('/', validateMovie, async (req, res) => {
    const { id, title, year, director, genre } = req.body;

    try {

        const newMovie = { id, title, year, director, genre };
        movies.push(newMovie);

        res.status(201).send('Film uspjesno dodan.');
    } catch (error) {
        res.status(500).send('Greska prilikom spremanja.');
    }
});

router.patch('/:id',validateMovieUpdate, async (req, res) => {
    const id = parseInt(req.params.id, 10);
    

    try {
        const movies = await readMoviesFromFile();
        const movieIndex = movies.findIndex(m => m.id === id);

        if (movieIndex === -1) {
            return res.status(404).json({ message: 'film nije pronaden.' });
        }

        movies[movieIndex] = { ...movies[movieIndex], ...req.body };
        await writeMoviesToFile(movies);

        res.json(movies[movieIndex]);
    } catch (error) {
        res.status(500).send('greska prilikom updata');
    }
});

export default router;
