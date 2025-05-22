csoportok()

function csoportok() {
    const url = 'http://localhost:5000/admin/csoportok';
    const token = 'Bearer: ' + sessionStorage.token
    const tabla = document.getElementById("csoportok");
    fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': token
        }
    })
        .then((response) => response.json())
        .then(json => {
            tabla.innerHTML = "<tr><th>Azon</th><th>Képzés</th><th>Indulás</th><th>Beosztás</th>"
                + "<th>Ár (Ft)</th><th>Fő</th><th>&nbsp;</th><th>&nbsp;</th><th>&nbsp;</th></tr>";
            json.forEach(cs => {
                tabla.innerHTML += "<tr><td>" + cs.csid + "</td><td>" + cs.knev + "</td>"
                    + "</td><td>" + cs.indulas + "</td><td>" + cs.beosztas + "</td><td>"
                    + cs.ar.toLocaleString() + "</td><td>" + cs.letszam + "</td>"
                    + '<td><button class="button btn-sm btn-primary" '
                    + 'onclick="jelentkezok(' + cs.csid + ')">Jelentkezők</button></td>'
                    + '<td><button class="button btn-sm btn-primary" '
                    + 'onclick="modosit(' + cs.csid + ')">Módosítás</button></td>'
                    + '<td><button class="button btn-sm btn-outline-danger" '
                    + 'onclick="torol(' + cs.csid + ')">Törlés</button></td></tr>'
            });
        })
        .catch(err => console.log(err));
}

document.getElementById("hozzaad").onclick = function (e) {
    const url = 'http://localhost:5000/admin/csoportok';
    const token = 'Bearer: ' + sessionStorage.token
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json;charset=utf-8',
            'Authorization': token
        },
        body: JSON.stringify({
            "kid": document.getElementById("kepzes").value,
            "indulas": document.getElementById("datum").value,
            "beosztas": document.getElementById("beosztas").value,
            "helyszin": document.getElementById("helyszin").value,
            "ar": document.getElementById("ar").value
        })
    })
        .then(res => {
            csoportok()
        })
        .catch(err => console.log(err));
}

function jelentkezok(csid) {
    sessionStorage.csid = csid
    window.location = "jelentkezok.html"
}

function modosit(csid) {
    sessionStorage.csid = csid
    window.location = "modosit.html"
}

function torol(csid) {
    const token = 'Bearer: ' + sessionStorage.token
    fetch('http://localhost:5000/admin/lista/' + csid, {
        method: 'GET',
        headers: {
            'Authorization': token
        }
    })
        .then((response) => response.json())
        .then(json => {
            if (json.length > 0) {
                alert("Csak üres csoport törölhető!")
            } else {
                fetch('http://localhost:5000/admin/csoportok/' + csid, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': token
                    }
                })
                    .then(res => {
                        csoportok()
                    })
                    .catch(err => console.log(err));
            }
        })
}

document.getElementById("kijelentkezes").onclick = function () {
    delete sessionStorage.token
    document.location = "index.html"
}

