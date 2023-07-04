const { encode, decode } = require("../services/crypt");
const pool = require("../config/db");
const { v4: uuidv4 } = require("uuid");
const otpGenerator = require("otp-generator");
const { addMinutesToDate } = require("../helpers/addMinutesToDate");
const { dates } = require("../helpers/dates");
const myJwt = require("../services/JwtService");
const bcrypt = require("bcrypt");
const DeviceDetector = require("node-device-detector");
const config = require("config")

const detector = new DeviceDetector({
    clientIndexes: true,
    deviceIndexes: true,
    deviceAliasCode: false,
});

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

// async function verifyOtp(req, res) {
//     const { verification_key, otp, check } = req.body;
//     let currentDate = new Date();
//     let decoded;
//     try {
//         decoded = await decode(verification_key);
//     } catch (error) {
//         return res
//             .status(400)
//             .send({ status: "Failure", Details: "Bad request" });
//     }

//     const obj = JSON.parse(decoded);
//     const check_obj = obj.check;
//     if (check_obj != check) {
//         return res.status(400).send({
//             status: "Failure",
//             Details: "OTP was not send this particular phone number",
//         });
//     }

//     const otpResult = await pool.query("select * from otp where id = $1;", [
//         obj.otp_id,
//     ]);
//     const result = otpResult.rows[0];
//     if (result === null) {
//         return res
//             .status(400)
//             .send({ status: "Failure", Details: "Bad request" });
//     }
//     if (result.verified) {
//         return res
//             .status(400)
//             .send({ status: "Failure", Details: "OTP is already used" });
//     }
//     if (dates.compare(result.expiration_time, currentDate) !== 1) {
//         return res
//             .status(400)
//             .send({ status: "Failure", Details: "OTP is expired" });
//     }
//     if (otp != result.otp) {
//         console.log(otp, result.otp);
//         return res
//             .status(400)
//             .send({ status: "Failure", Details: "OTP is not matched" });
//     }
//     await pool.query(`update otp set verified=$2 where id = $1`, [
//         result.id,
//         true,
//     ]);
//     const clientResult = await pool.query(
//         "select * from client where client_phone_number = $1",
//         [check]
//     );
//     let client_id, details;

//     if (clientResult.rows.length == 0) {
//         const newClient = await pool.query(
//             `INSERT INTO client (client_phone_number, otp_id) VALUES ($1, $2) returning id`,
//             [check, obj.otp_id]
//         );
//         client_id = newClient.rows[0].id;
//         details = "new";
//     } else {
//         client_id = clientResult.rows[0].id;
//         details = "old";
//         await pool.query(`UPDATE client SET otp_id=$2 WHERE id=$1`, [
//             client_id,
//             obj.otp_id,
//         ]);
//     }

//     const payload = {
//         id: client_id,
//     };
//     const tokens = myJwt.generateTokens(payload);
//     const hashedRefreshToken = bcrypt.hashSync(tokens.refreshToken, 7);
//     const userAgent = req.headers["user-agent"];
//     const resUserAgent = detector.detect(userAgent);
//     const { os, client, device } = resUserAgent;

//     await pool.query(
//         `INSERT INTO token(table_name, user_id, user_os, user_device, \
//             user_browser, hashed_refresh_token) VALUES($1, $2, $3, $4, $5, $6) returning id`
//     );
//     ["client", client_id, os, device, client, hashedRefreshToken];

//     res.cookie("refreshToken", tokens.refreshToken, {
//         maxAge: config.get("refresh_ms"),
//         httpOnly: true,
//     });

    
//     const response = {
//         Status: "Success",
//         Details: details,
//         Check: check,
//         ClientID: client_id,
//         tokens: tokens,
//     };

//     return res.status(200).send(response);
// }

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
    if (check_obj !== check) {
        return res.status(400).send({
            status: "Failure",
            Details: "OTP was not sent to this particular phone number",
        });
    }

    const otpResult = await pool.query("SELECT * FROM otp WHERE id = $1;", [
        obj.otp_id,
    ]);
    const result = otpResult.rows[0];
    if (!result) {
        return res
            .status(400)
            .send({ status: "Failure", Details: "Bad request" });
    }
    if (result.verified) {
        return res
            .status(400)
            .send({ status: "Failure", Details: "OTP has already been used" });
    }
    if (dates.compare(result.expiration_time, currentDate) !== 1) {
        return res
            .status(400)
            .send({ status: "Failure", Details: "OTP has expired" });
    }
    if (otp !== result.otp) {
        console.log(otp, result.otp);
        return res
            .status(400)
            .send({ status: "Failure", Details: "OTP does not match" });
    }
    await pool.query(`UPDATE otp SET verified = $2 WHERE id = $1`, [
        result.id,
        true,
    ]);
    const clientResult = await pool.query(
        "SELECT * FROM client WHERE client_phone_number = $1",
        [check]
    );
    let client_id, details;

    if (clientResult.rows.length === 0) {
        const newClient = await pool.query(
            `INSERT INTO client (client_phone_number, otp_id) VALUES ($1, $2) RETURNING id`,
            [check, obj.otp_id]
        );
        client_id = newClient.rows[0].id;
        details = "new";
    } else {
        client_id = clientResult.rows[0].id;
        details = "old";
        await pool.query(`UPDATE client SET otp_id = $2 WHERE id = $1`, [
            client_id,
            obj.otp_id,
        ]);
    }

    const payload = {
        id: client_id,
    };
    const tokens = myJwt.generateTokens(payload);
    const hashedRefreshToken = bcrypt.hashSync(tokens.refreshToken, 7);
    const userAgent = req.headers["user-agent"];
    const resUserAgent = detector.detect(userAgent);
    const { os, client, device } = resUserAgent;

    const insertedToken = await pool.query(
        `INSERT INTO token(table_name, user_id, user_os, user_device, user_browser, hashed_refresh_token) VALUES($1, $2, $3, $4, $5, $6) RETURNING id`,
        ["client", client_id, os, device, client, hashedRefreshToken]
    );

    res.cookie("refreshToken", tokens.refreshToken, {
        maxAge: config.get("refresh_ms"),
        httpOnly: true,
    });

    const response = {
        Status: "Success",
        Details: details,
        Check: check,
        ClientID: client_id,
        tokens: tokens,
    };

    return res.status(200).send(response);
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
