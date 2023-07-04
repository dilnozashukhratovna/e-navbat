const pool = require("../config/db");
const DeviceHelper = require("node-device-detector/helper");
const DeviceDetector = require("node-device-detector");

const detector = new DeviceDetector({
    clientIndexes: true,
    deviceIndexes: true,
    deviceAliasCode: false,
});

const addClient = async (req, res) => {
    try {
        const {
            client_last_name,
            client_first_name,
            client_phone_number,
            client_info,
            client_photo,
        } = req.body;

        const newClient = await pool.query(
            `INSERT INTO client (client_last_name, client_first_name, client_phone_number, client_info, client_photo) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [
                client_last_name,
                client_first_name,
                client_phone_number,
                client_info,
                client_photo,
            ]
        );
        console.log(newClient);
        res.status(200).json(newClient.rows);
    } catch (error) {
        res.status(500).json(`Server is Error ${error}`);
    }
};

const getClients = async (req, res) => {
    try { 
        const userAgent = req.headers["user-agent"];
        console.log(userAgent);
        const result = detector.detect(userAgent);
        console.log("result parse", result); 
        console.log(DeviceHelper.isDesktop(result));
        const clients = await pool.query(`select * from client`);
        res.status(200).send(clients.rows);
    } catch (error) {
        res.status(500).json("Internal server error");
    }
};

const getClientById = async (req, res) => { 
    try {
        const id = req.params.id;
        const client = await pool.query(`SELECT * FROM client WHERE id=$1`, [
            id,
        ]);
        res.status(200).send(client.rows);
    } catch (error) {
        res.status(500).json("Internal server error");
    }
};

const updateClient = async (req, res) => {
    try {
        const id = req.params.id;
        const {
            client_last_name,
            client_first_name,
            client_phone_number,
            client_info,
            client_photo,
        } = req.body;

        const client = await pool.query(
            `
                UPDATE client SET client_last_name=$1, client_first_name=$2,
                client_phone_number=$3, client_info=$4, client_photo=$5
                WHERE id=$6 RETURNING *
            `,
            [
                client_last_name,
                client_first_name,
                client_phone_number,
                client_info,
                client_photo,
                id,
            ]
        );
        console.log(client);
        res.status(200).json(client.rows);
    } catch (error) {
        res.status(500).json(`Server is Error ${error}`);
    }
};

const deleteClient = async (req, res) => {
    try {
        const id = req.params.id;
        const client = await pool.query(`DELETE FROM client WHERE id = $1;`, [
            id,
        ]);
        res.status(200).send({ message: "Successfuly deleted!" });
    } catch (error) {
        res.status(500).json("Internal server error");
    }
};

module.exports = {
    addClient,
    getClients,
    getClientById,
    updateClient,
    deleteClient,
};
