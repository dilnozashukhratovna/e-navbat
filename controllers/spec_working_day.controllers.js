const pool = require("../config/db");

const addSpec_working_day = async (req, res) => {
    try {
        const {
            spec_id,
            day_of_week,
            start_time,
            finish_time,
            rest_start_time,
            rest_finish_time,
        } = req.body;

        const newSpec_working_day = await pool.query(
            `INSERT INTO spec_working_day(
            spec_id,
            day_of_week,
            start_time,
            finish_time,
            rest_start_time,
            rest_finish_time) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [
                spec_id,
                day_of_week,
                start_time,
                finish_time,
                rest_start_time,
                rest_finish_time,
            ]
        );
        console.log(newSpec_working_day);
        res.status(200).json(newSpec_working_day.rows);
    } catch (error) {
        res.status(500).json(`Server is Error ${error}`);
    }
};


const getSpec_working_days = async (req, res) => {
    try {
        const spec_working_days = await pool.query(
            `select * from spec_working_day`
        );
        res.status(200).send(spec_working_days.rows);
    } catch (error) {
        res.status(500).json("Internal server error");
    }
};

const getSpec_working_dayById = async (req, res) => {
    try {
        const id = req.params.id;
        const spec_working_day = await pool.query(
            `SELECT * FROM spec_working_day WHERE id=$1`,
            [id]
        );
        res.status(200).send(spec_working_day.rows);
    } catch (error) {
        res.status(500).json("Internal server error");
    }
};

const updateSpec_working_day = async (req, res) => {
    try {
        const id = req.params.id;
        const {
            spec_id,
            day_of_week,
            start_time,
            finish_time,
            rest_start_time,
            rest_finish_time,
        } = req.body;

        const spec_working_day = await pool.query(
            `
                UPDATE spec_working_day SET spec_id=$1, 
                day_of_week=$2, start_time=$3, finish_time=$4, rest_start_time=$5, rest_finish_time=$6
                WHERE id=$7 RETURNING *
            `,
            [
                spec_id,
                day_of_week,
                start_time,
                finish_time,
                rest_start_time,
                rest_finish_time,
                id,
            ]
        );
        console.log(spec_working_day);
        res.status(200).json(spec_working_day.rows);
    } catch (error) {
        res.status(500).json(`Server is Error ${error}`);
    }
};

const deleteSpec_working_day = async (req, res) => {
    try {
        const id = req.params.id;
        const spec_working_day = await pool.query(
            `DELETE FROM spec_working_day WHERE id = $1;`,
            [id]
        );
        res.status(200).send({ message: "Successfuly deleted!" });
    } catch (error) {
        res.status(500).json("Internal server error");
    }
};

module.exports = {
    addSpec_working_day,
    getSpec_working_days,
    getSpec_working_dayById,
    updateSpec_working_day,
    deleteSpec_working_day,
};
