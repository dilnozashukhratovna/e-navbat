const pool = require("../config/db");

const addQueue = async (req, res) => {
    try {
        const { spec_service_id, client_id, queue_date_time, queue_number } =
            req.body;

        const newQueue = await pool.query(
            `INSERT INTO queue (spec_service_id, client_id, queue_date_time, queue_number) VALUES ($1, $2, $3, $4) RETURNING *`,
            [spec_service_id, client_id, queue_date_time, queue_number]
        );
        console.log(newQueue);
        res.status(200).json(newQueue.rows);
    } catch (error) {
        res.status(500).json(`Server is Error ${error}`);
    }
};

const getQueues = async (req, res) => {
    try {
        const queues = await pool.query(`select * from queue`);
        res.status(200).send(queues.rows);
    } catch (error) {
        res.status(500).json("Internal server error");
    }
};

const getQueueById = async (req, res) => {
    try {
        const id = req.params.id;
        const queue = await pool.query(`SELECT * FROM queue WHERE id=$1`, [id]);
        res.status(200).send(queue.rows);
    } catch (error) {
        res.status(500).json("Internal server error");
    }
};

const updateQueue = async (req, res) => {
    try {
        const id = req.params.id;
        const { spec_service_id, client_id, queue_date_time, queue_number } =
            req.body;

        const queue = await pool.query(
            `
                UPDATE queue SET spec_service_id=$1, client_id=$2, queue_date_time=$3, queue_number=$4
                WHERE id=$5 RETURNING *
            `,
            [spec_service_id, client_id, queue_date_time, queue_number, id]
        );
        console.log(queue);
        res.status(200).json(queue.rows);
    } catch (error) {
        res.status(500).json(`Server is Error ${error}`);
    }
};

const deleteQueue = async (req, res) => {
    try {
        const id = req.params.id;
        const queue = await pool.query(`DELETE FROM queue WHERE id = $1;`, [
            id,
        ]);
        res.status(200).send({ message: "Successfuly deleted!" });
    } catch (error) {
        res.status(500).json("Internal server error");
    }
};

module.exports = {
    addQueue,
    getQueues,
    getQueueById,
    updateQueue,
    deleteQueue,
};
