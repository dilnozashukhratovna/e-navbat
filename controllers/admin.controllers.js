const pool = require("../config/db");

const addAdmin = async (req, res) => {
    try {
        const {
            admin_name,
            admin_phone_number,
            admin_hashed_password,
            admin_is_active,
            admin_is_creator,
        } = req.body;

        const newAdmin = await pool.query(
            `INSERT INTO admin (admin_name, admin_phone_number, admin_hashed_password, admin_is_active, admin_is_creator) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [
                admin_name,
                admin_phone_number,
                admin_hashed_password,
                admin_is_active,
                admin_is_creator,
            ]
        );
        console.log(newAdmin);
        res.status(200).json(newAdmin.rows);
    } catch (error) {
        res.status(500).json(`Server is Error ${error}`);
    }
};

const getAdmins = async (req, res) => {
    try {
        const admins = await pool.query(`select * from admin`);
        res.status(200).send(admins.rows);
    } catch (error) {
        res.status(500).json("Internal server error");
    }
};

const getAdminById = async (req, res) => {
    try {
        const id = req.params.id;
        const admin = await pool.query(`SELECT * FROM admin WHERE id=$1`, [id]);
        res.status(200).send(admin.rows);
    } catch (error) {
        res.status(500).json("Internal server error");
    }
};

const updateAdmin = async (req, res) => {
    try {
        const id = req.params.id;
        const {
            admin_name,
            admin_phone_number,
            admin_hashed_password,
            admin_is_active,
            admin_is_creator,
        } = req.body;

        const admin = await pool.query(
            `
                UPDATE admin SET admin_name=$1, admin_phone_number=$2, admin_hashed_password==$3, admin_is_active=$4, admin_is_creator=$5
                WHERE id=$6 RETURNING *
            `,
            [
                admin_name,
                admin_phone_number,
                admin_hashed_password,
                admin_is_active,
                admin_is_creator,
                id,
            ]
        );
        console.log(admin);
        res.status(200).json(admin.rows);
    } catch (error) {
        res.status(500).json(`Server is Error ${error}`);
    }
};

const deleteAdmin = async (req, res) => {
    try {
        const id = req.params.id;
        const admin = await pool.query(`DELETE FROM admin WHERE id = $1;`, [
            id,
        ]);
        res.status(200).send({ message: "Successfuly deleted!" });
    } catch (error) {
        res.status(500).json("Internal server error");
    }
};

module.exports = {
    addAdmin,
    getAdmins,
    getAdminById,
    updateAdmin,
    deleteAdmin,
};
