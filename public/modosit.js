const csid = sessionStorage.csid
document.getElementById("csid").innerHTML = csid
betolt()

function betolt() {
    const url = 'http://localhost:5000/admin/csoportok/' + csid;
    const token = 'Bearer: ' + sessionStorage.token
    fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': token
        }
    })
        .then((response) => response.json())
        .then(json => {
            let csoport = json[0]
            document.getElementById("kepzes").selectedIndex = csoport.kid-1
            document.getElementById("datum").value = csoport.indulas
            document.getElementById("beosztas").value = csoport.beosztas
            document.getElementById("helyszin").value = csoport.helyszin
            document.getElementById("ar").value = csoport.ar
        })
        .catch(err => console.log(err));
}

document.getElementById("modosit").onclick = function (e) {
    const url = 'http://localhost:5000/admin/csoportok/' + csid;
    const token = 'Bearer: ' + sessionStorage.token
    fetch(url, {
        method: 'PUT',
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
            document.location = "csoportok.html"
        })
        .catch(err => console.log(err));
}

document.getElementById("kijelentkezes").onclick = function () {
    delete sessionStorage.token
    document.location = "index.html"
}

document.getElementById("vissza").onclick = function () {
    document.location = "csoportok.html"
}

