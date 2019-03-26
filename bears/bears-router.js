const router = require('express').Router();
const knex = require('knex');

const knexConfig = {
    client: 'sqlite3',
    useNullAsDefault: true,
    connection: {
        filename: './data/lambda.sqlite3.js',
    },
};

const db = knex(knexConfig);

router.get('/', (req, res) => {
    db('bears')
        .then(bears => {
            res.status(200).json(bears);
        })
        .catch(error => {
            res.status(500).json({ error: 'Could not retrieve data.' })
        });
});

router.get('/:id', (req, res) => {
    const bearId = req.params.id;

    db('bears')
        .where({ id: bearId })
        .first()
        .then(bear => {
            if(!bear) {
                res.status(400).json({ message: 'The bear with the specified ID does not exist.' })
            }
            res.status(200).json(bear)
        })
        .catch(error => {
            res.status(500).json(error)
        });
});

router.post('/', (req, res) => {
    const { name } = req.body;
    if(!name) {
        res.status(404).json({ message: 'Please provide a name.' })
    }
    db('bears')
        .insert({ name })
        .then(ids => {
            const id = ids[0];
            db('bears')
                .where({ id })
                .first()
                .then(bear => {
                    res.status(201).json(bear.id)
                })
                .catch(error => {
                    res.status(500).json(error);
                });
        })
})

router.delete('/', (req, res) => {
    db('bears')
        .where({ id: req.params.id })
        .del()
        .then(bear => {
            if(!bear) {
                res.status(400).json({ message: 'The bear with the specified ID does not exist.' })
            }
            res.status(204).json({ success: 'Bear has been successfully added to database.' })
        })
        .catch(error => {
            
        })
})

router.put('/', (req, res) => {
    
})



module.exports = router;