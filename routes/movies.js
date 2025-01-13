import express from 'express';
import fs from "fs/promises";
import path from "path";

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

router.get('/', async (req, res) => {
    try {
        let movies = await readMoviesFromFile();
        res.json(movies);
    } catch (error) {
        res.status(500).send('Greska kod citanja podataka');
    }
});

router.get('/:id', async (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
        return res.status(400).json({ message: 'krivi id' });
    }

    try {
        const movies = await readMoviesFromFile();
        const movie = movies.find(m => m.id === id);

        if (movie) {
            res.json(movie);
        } else {
            res.status(404).json({ message: 'film nije pronaden.' });
        }
    } catch (error) {
        res.status(500).send('greska prilikom citanja podataka');
    }
});

router.post('/', async (req, res) => {
    const { id, title, description, releaseYear, genre } = req.body;

    if (!id || !title || !description || !releaseYear || !genre) {
        return res.status(400).send('Sva polja rebaju biti popunjena');
    }

    try {
        const movies = await readMoviesFromFile();

        if (movies.some(movie => movie.id === id)) {
            return res.status(400).send('Vec postoji film s tim id.');
        }

        const newMovie = { id, title, description, releaseYear, genre };
        movies.push(newMovie);
        await writeMoviesToFile(movies);

        res.status(201).send('Film uspjesno dodan.');
    } catch (error) {
        res.status(500).send('Greska prilikom spremanja.');
    }
});

router.patch('/:id', async (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
        return res.status(400).json({ message: 'Krivi id format.' });
    }

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
