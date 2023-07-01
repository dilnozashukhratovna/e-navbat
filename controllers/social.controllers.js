const pool = require("../config/db");

const addSocial = async (req, res) => {
    try {
        const { social_name, social_icon_file } = req.body;

        const newSocial = await pool.query(
            `INSERT INTO social (social_name, social_icon_file) VALUES ($1, $2) RETURNING *`,
            [social_name, social_icon_file]
        );
        console.log(newSocial);
        res.status(200).json(newSocial.rows);
    } catch (error) {
        res.status(500).json(`Server is Error ${error}`);
    }
};

const getSocials = async (req, res) => {
    try {
        const socials = await pool.query(`select * from social`);
        res.status(200).send(socials.rows);
    } catch (error) {
        res.status(500).json("Internal server error");
    }
};

const getSocialById = async (req, res) => {
    try {
        const id = req.params.id;
        const social = await pool.query(
            `SELECT * FROM social WHERE id=$1`,
            [id]
        );
        res.status(200).send(social.rows);
    } catch (error) {
        res.status(500).json("Internal server error");
    }
};

const updateSocial = async (req, res) => {
    try {
        const id = req.params.id;
        const { social_name, social_icon_file } = req.body;

        const social = await pool.query(
            `
                UPDATE social SET social_name=$1, social_icon_file=$2
                WHERE id=$3 RETURNING *
            `,
            [social_name, social_icon_file, id]
        );
        console.log(social);
        res.status(200).json(social.rows);
    } catch (error) {
        res.status(500).json(`Server is Error ${error}`);
    }
};

const deleteSocial = async (req, res) => {
    try {
        const id = req.params.id;
        const social = await pool.query(
            `DELETE FROM social WHERE id = $1;`,
            [id]
        );
        res.status(200).send({ message: "Successfuly deleted!" });
    } catch (error) {
        res.status(500).json("Internal server error");
    }
};

module.exports = {
    addSocial,
    getSocials,
    getSocialById,
    updateSocial,
    deleteSocial,
};
