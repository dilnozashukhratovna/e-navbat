const { encode, decode } = require("../services/crypt");
const pool = require("../config/db");
const { v4: uuidv4 } = require("uuid");
const otpGenerator = require("otp-generator");
const { addMinutesToDate } = require("../helpers/addMinutesToDate");
const { dates } = require("../helpers/dates");

//     new OTP
const newOtp = async (req, res) => {
    const { phone_number } = req.body;
    const otp = otpGenerator.generate(4, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
    });

    const now = new Date();
    const expiration_time = addMinutesToDate(now, 3);

    const newOtp = await pool.query(
        `INSERT INTO otp (id, otp, expiration_time) VALUES($1,$2,$3) returning id;`,
        [uuidv4(), otp, expiration_time]
    );

    const details = {
        timestamp: now,
        check: phone_number,
        success: true,
        message: "OTP sent to user",
        otp_id: newOtp.rows[0].id,
    };
    const encoded = await encode(JSON.stringify(details));
    return res.send({ Status: "Success", Details: encoded });
};

async function verifyOtp(req, res) {
    const { verification_key, otp, check } = req.body;
    let currentDate = new Date();
    let decoded;
    try {
        decoded = await decode(verification_key);
    } catch (error) {
        return res
            .status(400)
            .send({ status: "Failure", Details: "Bad request" });
    }

    const obj = JSON.parse(decoded);
    const check_obj = obj.check;
    if (check_obj != check) {
        return res.status(400).send({
            status: "Failure",
            Details: "OTP was not send this particular phone number",
        });
    }

    const otpResult = await pool.query("select * from otp where id = $1;", [
        obj.otp_id,
    ]);
    const result = otpResult.rows[0];
    if (result === null) {
        return res
            .status(400)
            .send({ status: "Failure", Details: "Bad request" });
    }
    if (result.verified) {
        return res
            .status(400)
            .send({ status: "Failure", Details: "OTP is already used" });
    }
    if (dates.compare(result.expiration_time, currentDate) !== 1) {
        return res
            .status(400)
            .send({ status: "Failure", Details: "OTP is expired" });
    }
    if (otp != result.otp) {
        console.log(otp, result.otp);
        return res
            .status(400)
            .send({ status: "Failure", Details: "OTP is not matched" });
    }
    await pool.query(`update otp set verified=$2 where id = $1`, [
        result.id,
        true,
    ]);
    const clientResult = await pool.query(
        "select * from client where client_phone_number = $1",
        [check]
    );
    if (clientResult.rows.length < 1) {
        return res
            .status(200)
            .send({ status: "Success", Details: "new", Check: check });
    } else {
        return res.status(200).send({
            status: "Success",
            Details: "old",
            ClientName: clientResult.rows[0].client_first_name,
        });
    }
}

// getotp

const getOtp = async (req, res) => {
    try {
        const otps = await pool.query(`select * from otp`);
        res.status(200).send(otps.rows);
    } catch (error) {
        res.status(500).json("Serverda xatolik");
    }
};
const getOtpById = async (req, res) => {
    try {
        const id = req.params.id;
        const otp = await pool.query(
            `
            select * from otp where id = $1
            `,
            [id]
        );
        res.status(200).send(otp.rows);
    } catch (error) {
        res.status(500).json("Serverda xatolik");
    }
};

const deleteOtp = async (req, res) => {
    try {
        const id = req.params.id;
        const otps = await pool.query(`DELETE FROM otp WHERE id = $1`, [id]);
        res.status(200).json("Successfully deleted");
    } catch (error) {
        res.status(500).json("Serverda xatolik");
    }
};

const updateOtp = async (req, res) => {
    try {
        const id = req.params.id;
        const { otp, expiration_time, verified } = req.body;

        const newOtp = await pool.query(
            `
        UPDATE otp set otp = $1,expiration_time = $2,verified = $3
            WHERE id = $4
            RETURNING *
        `,
            [otp, expiration_time, verified, id]
        );
        res.status(200).json(newOtp.rows);
    } catch (error) {
        res.status(500).json("Serverda xatolik");
        console.log(error);
    }
};

module.exports = {
    newOtp,
    verifyOtp,
    getOtp,
    getOtpById,
    updateOtp,
    deleteOtp,
};
