const express = require('express');

const secret = "KDUvJKcOzgnfNSkZTcZR38ZmLWEdlWfa";

const jwt = require("jsonwebtoken");
const app = express();
const port = 3000

app.use(express.static('publicHomeBank'));
app.use(express.json());

app.post('/login', (req, res) => {
    console.log("Ricevuto una login con questi dati:", req.body);
    if(req.body.username == "diego" && req.body.password == "bonura") {
        console.log("L'utente " + req.body.username + " ha effettuato correttamente il login")
        // Ok va tutto bene

        // Genero token jwt
        const userInfo = {
            name: req.body.username,
            role: 'user' // or admin
        };

        const jwtToken = jwt.sign(userInfo, secret);
        // Ritorno il token come risposta
        const response = {
            accessToken: jwtToken
        };

        res.json(response);
    } else {
        console.log("Errore login")
        res.clearCookie("cookieAutenticazione");
        res.status("403", "Login errato").send();
    }
});

app.post('/effettuaBonifico', (req, res) => {
    // Verifico presenza del token
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (!token) {
        // Access token non trovato
        console.log("Jwt non trovato");
        res.status("403", "Accesso negato").send();
        return;
    }

    console.log("Devo verificare il token:" + token, authHeader);

    jwt.verify(token, secret, (err, user) => {
        if (err) {
            console.log(err);
            console.log("Jwt non valido");
            return res.sendStatus(403)
        }
        
        console.log("user:", user);
        // Ok posso eseguire la richiesta
        console.log("Ricevuto bonifico dalla banca correttamente:", req.body);
        res.send("Ok");
      })
});

app.listen(port, () => {
    console.log(`HomeBanking listening at http://localhost:${port}`)
});