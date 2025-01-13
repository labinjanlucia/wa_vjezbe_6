import express from "express";
import moviesRouter from './routes/movies.js';
import glumciRouter from './routes/glumci.js';

const app = express();
const PORT = 3007;
app.use(express.json());
app.use('/movies', moviesRouter);
app.use('/glumci', glumciRouter);



 
app.listen(PORT, (error) => {
if (error) {
console.error(`Greška prilikom pokretanja poslužitelja: ${error.message}`);
} else {
console.log(`Server je pokrenut na http://localhost:${PORT}`);
}
});