import { body, query, param, validationResult } from "express-validator";

export default function logging(appName) {
    return (req, res, next) => {
      const now = new Date();
      const date = now.toISOString().split("T")[0];
      const time = now.toTimeString().split(" ")[0];
      const method = req.method;
      const url = req.originalUrl;
  
      console.log(`[${appName}] [${date} ${time}] : ${method} ${url}`);
      next();
    };
  }

  export const validateId = [
    param("id").isInt().withMessage("ID must be an integer."),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    },
  ];
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

export const validateMovie = [
    body("title").notEmpty().withMessage("Naslov je potreban."),
    body("year")
        .isInt().withMessage("Godina mora biti broj").notEmpty().withMessage("godina fali"),
    body("genre").notEmpty().withMessage("zanr je potreban"),
    body("director").notEmpty().withMessage("Direktor fali"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
];
export const validateNameandchange = [
    query("name").optional().isString()
      .withMessage("ime mora biti string.")
      .matches(/^[a-zA-Z\s]+$/)
      .withMessage("ime mora imati samoo slova")
      .trim()
      .escape(),
  
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    },
  ];
  export const validateActor = [
    body("ime").notEmpty().withMessage("Potrebno ime.").escape(),
    body("birthYear").isInt().withMessage("godina rodenja mora biti broj").notEmpty().withMessage("Potrebna godina rodenja.")
      .escape(),
  
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    },
  ];

  export const validateRange = [
    query("min_year").optional().isInt().withMessage("min_year mora biti broj").toInt()
      .escape(),
  
    query("max_year").isInt().withMessage("max_year mora biti broj").toInt()
      .escape(),
  
    (req, res, next) => {
      const { min_year, max_year } = req.query;
  
      if (min_year && max_year && min_year >= max_year) {
        return res.status(400).json({
          errors: [
            {
              msg: "min_year mora biti manje od max_year",
              param: "min_year, max_year",
              location: "query",
            },
          ],
        });
      }
  
      next();
    },
  
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    },
  ];
  
export const validateMovieUpdate = [
    body("title").optional().notEmpty().withMessage("Naslov nesmije biti prazan."),
    body("year")
        .optional()
        .isInt({ min: 1888 }).withMessage("Mora biti integer"),
    body("genre").optional().notEmpty().withMessage("polje nesmije biti prazno"),
    body("director").optional().notEmpty().withMessage("Direktor nesmije biti prazan"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
];

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
