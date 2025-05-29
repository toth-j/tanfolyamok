const max = 8;
let adatok;
csoportok();

async function csoportok() {
    const url = 'http://localhost:5000/public/csoportok';
    const tabla = document.getElementById("csoportok");
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(response.status);
        }
        const json = await response.json();
        adatok = json;
        tabla.innerHTML = "<tr><th>Azonosító</th><th>Képzés</th><th>Indulás</th>"
            + "<th>Beosztás</th><th>Szabad hely</th><th>Ár (Ft)</th></tr>";
        json.forEach(cs => {
            tabla.innerHTML += "<tr><td>" + cs.csid + "</td><td>" + cs.knev
                + "</td><td>" + cs.indulas + "</td><td>" + cs.beosztas
                + "</td><td>" + (max - cs.letszam) + "</td><td>" + cs.ar.toLocaleString() + "</td></tr>"
        });
    } catch (err) {
        console.error("Hiba a csoportok feldolgozása közben:", err.message);
        tabla.innerHTML = `<tr><td colspan="6">Hiba történt a csoportok betöltésekor. Kérjük, próbálja újra később.</td></tr>`;
    }
}

document.getElementById("jelentkezemGomb").onclick = async function (e) {
    let valasz = ellenoriz();
    const uzenetElem = document.getElementById("uzenet");
    uzenetElem.innerHTML = valasz;
    if (valasz) return;

    const url = 'http://localhost:5000/public/jelentkezok';
    const payload = {
        "csid": document.getElementById("csid").value,
        "jnev": document.getElementById("jnev").value,
        "szulnev": document.getElementById("szulnev").value,
        "szulido": document.getElementById("szulido").value,
        "szulhely": document.getElementById("szulhely").value,
        "anyjaneve": document.getElementById("anyjaneve").value,
        "cim": document.getElementById("cim").value,
        "telefon": document.getElementById("telefon").value,
        "email": document.getElementById("email").value
    };
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(payload)
        });
        const responseData = await response.json();
        if (!response.ok) {
            throw new Error(response.status);
        }
        uzenetElem.innerHTML = responseData.message || "Köszönjük jelentkezésedet!";
        document.getElementById("jelentkezemGomb").disabled = true;
        csoportok();
    } catch (err) {
        console.error("Hiba jelentkezéskor:", err.message);
        uzenetElem.innerHTML = "Hálózati hiba vagy a szerver nem válaszol.";
    }
};

document.getElementById("login").onclick = async function (e) {
    const url = 'http://localhost:5000/admin';
    const uzenet2Elem = document.getElementById("uzenet2");
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({
                "password": document.getElementById("password").value,
            })
        });
        const json = await response.json();
        uzenet2Elem.innerHTML = json.message;
        if (!response.ok) {
            throw new Error(response.status);
        }
        sessionStorage.token = json.token
        document.location.href = "csoportok.html"
    } catch (err) {
        console.error("Fetch hiba a bejelentkezésnél:", err.message);
        uzenet2Elem.innerHTML = "Hibás jelszó!";
    }
};
