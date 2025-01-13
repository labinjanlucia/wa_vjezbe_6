

export const logMiddleware = (req, res, next) => {
    const currentTime = new Date().toISOString();
    console.log(`[movie-server] [${currentTime}] ${req.method} ${req.originalUrl}`);
    next();
};

export function validateIfMovieExists(uzmiFilm){
    return (req, res, next) => {
    const id = parseInt(req.params.id, 10);
    try {
        const movies = uzmiFilm();
        const movie = movies.find(m => m.id === id);
        if (!movie) {
            return res.status(404).json({ message: 'Film nije pronadn' });
        }

        
        req.movie = movie;
        next();
    } catch (error) {
        console.error('Greska prilikom provjere filma', error);
        res.status(500).send('greska prilikom provjere filma.');
    }
}};

export function validateIfActorExists(uzmiGlumce){
    return (req, res, next) => {
        const id = parseInt(req.params.id, 10);
    
    try {
        const actors = uzmiGlumce();
        const actor = actors.find(a => a.id === id);
        if (!actor) {
            return res.status(404).json({ message: 'Glumac nije pronaden' });
        }

        
        req.actor = actor;
        next();
    } catch (error) {
        console.error('Greska prilikom provjere', error);
        res.status(500).send('Greska prilikom provjere');
    }
}};
