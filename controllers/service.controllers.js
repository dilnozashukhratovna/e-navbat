const pool = require("../config/db");

const addService = async (req, res) => {
    try {
        const { service_name, service_price } = req.body;

        const newService = await pool.query(
            `INSERT INTO service (service_name, service_price) VALUES ($1, $2) RETURNING *`,
            [service_name, service_price]
        );
        console.log(newService);
        res.status(200).json(newService.rows);
    } catch (error) {
        res.status(500).json(`Server is Error ${error}`);
    }
};

const getServices = async (req, res) => {
    try {
        const services = await pool.query(`select * from service`);
        res.status(200).send(services.rows);
    } catch (error) {
        res.status(500).json("Internal server error");
    }
};

const getServiceById = async (req, res) => {
    try {
        const id = req.params.id;
        const service = await pool.query(`SELECT * FROM service WHERE id=$1`, [
            id,
        ]);
        res.status(200).send(service.rows);
    } catch (error) {
        res.status(500).json("Internal server error");
    }
};

const updateService = async (req, res) => {
    try {
        const id = req.params.id;
        const { service_name, service_price } = req.body;

        const service = await pool.query(
            `
                UPDATE service SET service_name=$1, service_price=$2
                WHERE id=$3 RETURNING *
            `,
            [service_name, service_price, id]
        );
        console.log(service);
        res.status(200).json(service.rows);
    } catch (error) {
        res.status(500).json(`Server is Error ${error}`);
    }
};

const deleteService = async (req, res) => {
    try {
        const id = req.params.id;
        const service = await pool.query(`DELETE FROM service WHERE id = $1;`, [
            id,
        ]);
        res.status(200).send({ message: "Successfuly deleted!" });
    } catch (error) {
        res.status(500).json("Internal server error");
    }
};

module.exports = {
    addService,
    getServices,
    getServiceById,
    updateService,
    deleteService,
};
