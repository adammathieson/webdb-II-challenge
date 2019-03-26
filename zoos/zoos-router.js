const router = require('express').Router();
const knex = require('knex');

const knexConfig = {
    client: 'sqlite3',
    useNullAsDefault: true,
    connection: {
        filename: './data/lambda.sqlite3',
    },
};

const db = knex(knexConfig);

router.get('/', (req, res) => {
    db('zoos')
        .then(zoos => {
            res.status(200).json(zoos);
        })
        .catch(error => {
            res.status(500).json(error);
        })
})

router.get('/:id', (req, res) => {
    const zooId = req.params.id;

    db('zoos')
        .where({ id: zooId })
        .first()
        .then(zoo => {
            if(!zoo) {
                res.status(400).json({ message: 'The zoo with specified ID does not exist.' })
            }
            res.status(200).json(zoo);
        })
        .catch(error => {
            res.status(500).json(error);
        });
});

router.post('/', (req, res) => {
    const { name } = req.body;
    if(!name) {
        res.status(404).json({ message: 'Please provide a name.' })
    }
    db('zoos')
        .insert({ name })
        .then(ids => {
            const id = ids[0];
            db('zoos')
                .where({ id })
                .first()
                .then(zoo => {
                    res.status(201).json(zoo.id)
                })
                .catch(error => {
                    res.status(500).json(error);
                });
        })
})

router.delete('/:id', (req, res) => {
    db('zoos')
        .where({ id: req.params.id })
        .del()
        .then(zoo => {
            if(!zoo) {
                res.status(404).json({ message: 'The zoo with the specified ID does not exist.' })
            }
            res.status(204).json({ success: 'Zoo has been removed from the database.' })
        })
        .catch(error => {
            res.status(500).json(error);
        });
});

router.put('/:id', (req, res) => {
    const { name } = req.body;
    if(!name) {
        res.status(400).json({ message: 'Please provide a name to update.' })
    }
    db('zoos')
        .where({ id: req.params.id })
        .update({ name })
        .then(zoo => {
            res.status(200).json(zoo)
        })
        .catch(error => {
            res.status(500).json(error);
        });
        
})

module.exports = router;