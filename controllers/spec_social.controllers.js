const pool = require("../config/db");

const addSpec_social = async (req, res) => {
    try {
        const { spec_id, social_id } = req.body;

        const newSpec_social = await pool.query(
            `INSERT INTO spec_social (spec_id, social_id) VALUES ($1, $2) RETURNING *`,
            [spec_id, social_id]
        );
        console.log(newSpec_social);
        res.status(200).json(newSpec_social.rows);
    } catch (error) {
        res.status(500).json(`Server is Error ${error}`);
    }
};

const getSpec_socials = async (req, res) => {
    try {
        const spec_socials = await pool.query(`select * from spec_social`);
        res.status(200).send(spec_socials.rows);
    } catch (error) {
        res.status(500).json("Internal server error");
    }
};

const getSpec_socialById = async (req, res) => {
    try {
        const id = req.params.id;
        const spec_social = await pool.query(`SELECT * FROM spec_social WHERE id=$1`, [
            id,
        ]);
        res.status(200).send(spec_social.rows);
    } catch (error) {
        res.status(500).json("Internal server error");
    }
};

const updateSpec_social = async (req, res) => {
    try {
        const id = req.params.id;
        const { spec_id, social_id } = req.body;

        const spec_social = await pool.query(
            `
                UPDATE spec_social SET spec_id=$1, social_id=$2
                WHERE id=$3 RETURNING *
            `,
            [spec_id, social_id, id]
        );
        console.log(spec_social);
        res.status(200).json(spec_social.rows);
    } catch (error) {
        res.status(500).json(`Server is Error ${error}`);
    }
};

const deleteSpec_social = async (req, res) => {
    try {
        const id = req.params.id;
        const spec_social = await pool.query(`DELETE FROM spec_social WHERE id = $1;`, [
            id,
        ]);
        res.status(200).send({ message: "Successfuly deleted!" });
    } catch (error) {
        res.status(500).json("Internal server error");
    }
};

module.exports = {
    addSpec_social,
    getSpec_socials,
    getSpec_socialById,
    updateSpec_social,
    deleteSpec_social,
};
