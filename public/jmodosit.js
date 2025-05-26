const jid = sessionStorage.jid
document.getElementById("jid").innerHTML = jid
const token = 'Bearer: ' + sessionStorage.token
betolt()

function betolt() {
    const url = 'http://localhost:5000/admin/jelentkezok/' + jid;
    fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': token
        }
    })
        .then((response) => response.json())
        .then(json => {
            let jel = json[0]
            document.getElementById("jnev").value = jel.jnev
            document.getElementById("szulnev").value = jel.szulnev
            document.getElementById("szulido").value = jel.szulido
            document.getElementById("szulhely").value = jel.szulhely
            document.getElementById("anyjaneve").value = jel.anyjaneve
            document.getElementById("cim").value = jel.cim
            document.getElementById("telefon").value = jel.telefon
            document.getElementById("email").value = jel.email
        })
        .catch(err => console.log(err));
}

document.getElementById("modosit").onclick = function (e) {
    const url = 'http://localhost:5000/admin/jelentkezok/' + jid;
    console.log(token)
    fetch(url, {
        method: 'PUT',
        headers: {
            'Content-type': 'application/json;charset=utf-8',
            'Authorization': token
        },
        body: JSON.stringify({
            "csid": sessionStorage.csid,
            "jnev": document.getElementById("jnev").value,
            "szulnev": document.getElementById("szulnev").value,
            "szulido": document.getElementById("szulido").value,
            "szulhely": document.getElementById("szulhely").value,
            "anyjaneve": document.getElementById("anyjaneve").value,
            "cim": document.getElementById("cim").value,
            "telefon": document.getElementById("telefon").value,
            "email": document.getElementById("email").value
        })
    })
        .then(res => {
            document.location = "jelentkezok.html"
        })
        .catch(err => console.log(err));
}

document.getElementById("kijelentkezes").onclick = function () {
    delete sessionStorage.token
    document.location = "index.html"
}

document.getElementById("vissza").onclick = function () {
    document.location = "jelentkezok.html"
}

