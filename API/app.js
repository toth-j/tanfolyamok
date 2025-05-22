const express = require("express");
const app = express();
app.use(express.json());
require('dotenv').config();
const cors = require("cors");
app.use(cors());
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const mysql = require('mysql');

const pool = mysql.createPool({
    host: process.env.HOST,
    port: process.env.PORT,
    database: process.env.DATABASE,
    user: process.env.USER,
    password: process.env.PASSWORD,
    dateStrings: true
});

// *** publikus API *** //

// visszaadja az ezután induló csoportok adatait
app.get("/public/csoportok", function (req, res) {
    const q = "SELECT csoportok.csid,kepzesek.knev,indulas,beosztas,ar,"
        + "COUNT(jid) AS letszam "
        + "FROM kepzesek JOIN csoportok ON csoportok.kid=kepzesek.kid "
        + "LEFT JOIN jelentkezok ON csoportok.csid = jelentkezok.csid "
        + "WHERE indulas >= date(now()) GROUP BY csid";
    pool.query(q, function (error, results) {
        if (!error) {
            res.send(results);
        } else {
            res.send(error);
        }
    });
});

// létrehoz egy új jelentkezőt a küldött adatokkal
app.post("/public/jelentkezok", function (req, res) {
    const q = "INSERT INTO jelentkezok (csid, jnev, szulnev, szulido, "
        + "szulhely, anyjaneve, cim, telefon, email) "
        + "VALUES (?,?,?,?,?,?,?,?,?)";
    pool.query(q,
        [req.body.csid,
        req.body.jnev,
        req.body.szulnev,
        req.body.szulido,
        req.body.szulhely,
        req.body.anyjaneve,
        req.body.cim,
        req.body.telefon,
        req.body.email],
        function (error, results) {
            if (!error) {
                res.send(results);
            } else {
                res.send(error);
            }
        });
});

// *** admin API *** //

// admin bejelentkezés
app.post("/admin", function (req, res) {
    const hash = process.env.ADMIN;
    if (!bcrypt.compareSync(req.body.password, hash))
        return res.status(401).send({ message: "Hibás jelszó!" })
    const token = jwt.sign(
        { password: req.body.password }, 
        process.env.TOKEN_SECRET, 
        { expiresIn: 3600 })
    res.json({ token: token, message: "Sikeres bejelentkezés." })
});

// token ellenőrzése (middleware)
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (!token)
        return res.status(401).send({ message: "Azonosítás szükséges!" })
    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        if (err)
            return res.status(403).send({ message: "Nincs jogosultsága!" })
        req.user = user
        next()
    })
}

// az összes csoport adatainak lekérése
app.get("/admin/csoportok", authenticateToken, function (req, res) {
    const q = "SELECT csoportok.csid,kepzesek.knev,indulas,beosztas,ar,"
        + "COUNT(jid) AS letszam "
        + "FROM kepzesek JOIN csoportok ON csoportok.kid=kepzesek.kid "
        + "LEFT JOIN jelentkezok ON csoportok.csid = jelentkezok.csid "
        + "GROUP BY csid ORDER BY indulas DESC";
    pool.query(q, function (error, results) {
        if (!error) {
            res.send(results);
        } else {
            res.send(error);
        }
    });
});

// új csoport hozzáadása
app.post("/admin/csoportok", authenticateToken, function (req, res) {
    const q = "INSERT INTO csoportok (kid, indulas, beosztas, helyszin, ar) "
            + "VALUES(?,?,?,?,?)"
    pool.query(q, 
        [req.body.kid,
        req.body.indulas,
        req.body.beosztas,
        req.body.helyszin,
        req.body.ar],
        function (error, results) {
        if (!error) {
            res.send(results);
        } else {
            res.send(error);
        }
    });
})

// egy csoport beolvasása
app.get("/admin/csoportok/:csid", authenticateToken, function (req, res) {
    const q = "SELECT kid, indulas, beosztas, helyszin, ar "
            + "FROM csoportok WHERE csid=?";
    pool.query(q, [req.params.csid], function (error, results) {
        if (!error) {
            res.send(results);
        } else {
            res.send(error);
        }
    });
});

// csoport módosítása
app.put("/admin/csoportok/:csid", authenticateToken, function (req, res) {
    const q = "UPDATE csoportok "
            + "SET kid=?, indulas=?, beosztas=?, helyszin=?, ar=? "
            + "WHERE csid=?"
    pool.query(q, 
        [req.body.kid,
        req.body.indulas,
        req.body.beosztas,
        req.body.helyszin,
        req.body.ar,
        req.params.csid],
        function (error, results) {
        if (!error) {
            res.send(results);
        } else {
            res.send(error);
        }
    });
})

// csoport törlése
app.delete("/admin/csoportok/:csid", authenticateToken, function (req, res) {
    const q = "DELETE FROM csoportok WHERE csid=?";
    pool.query(q, [req.params.csid], function (error, results) {
        if (!error) {
            res.send(results);
        } else {
            res.send(error);
        }
    });
});

// egy csoport jelentkezőinek listája
app.get("/admin/lista/:csid", authenticateToken, function (req, res) {
    const q = "SELECT jid, jnev, szulnev, szulido, szulhely, anyjaneve, " 
            + "cim, telefon, email FROM jelentkezok WHERE csid=? ORDER BY jnev";
    pool.query(q, [req.params.csid], function (error, results) {
        if (!error) {
            res.send(results);
        } else {
            res.send(error);
        }
    });
});

// egy jelentkező adatai
app.get("/admin/jelentkezok/:jid", authenticateToken, function (req, res) {
    const q = "SELECT * FROM jelentkezok WHERE jid=?";
    pool.query(q, [req.params.jid], function (error, results) {
        if (!error) {
            res.send(results);
        } else {
            res.send(error);
        }
    });
});

// módosítja egy jelentkező adatait
app.put("/admin/jelentkezok/:jid", function (req, res) {
    const q = "UPDATE jelentkezok "
            + "SET csid=?, jnev=?, szulnev=?, szulido=?, "
            + "szulhely=?, anyjaneve=?, cim=?, telefon=?, email=? "
            + "WHERE jid=?";
    pool.query(q,
        [req.body.csid,
        req.body.jnev,
        req.body.szulnev,
        req.body.szulido,
        req.body.szulhely,
        req.body.anyjaneve,
        req.body.cim,
        req.body.telefon,
        req.body.email,
        req.params.jid],
        function (error, results) {
            if (!error) {
                res.send(results);
            } else {
                res.send(error);
            }
        });
});

// jelentkező törlése
app.delete("/admin/jelentkezok/:id", authenticateToken, function (req, res) {
    const q = "DELETE FROM jelentkezok WHERE jid=?";
    pool.query(q, [req.params.id], function (error, results) {
        if (!error) {
            res.send(results);
        } else {
            res.send(error);
        }
    });
});

app.listen(5000, function () {
    console.log("Server elindítva az 5000-es porton...");
});
