const csid = sessionStorage.csid
document.getElementById("csid").innerHTML = csid
const token = 'Bearer: ' + sessionStorage.token
let letszam
const max = 8
jelentkezok()

function jelentkezok() {
    const url = 'http://localhost:5000/admin/lista/' + csid;
    const tabla = document.getElementById("jelentkezok");
    fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': token
        }
    })
        .then((response) => response.json())
        .then(json => {
            tabla.innerHTML = "<tr><th>Név</th><th>Születési név</th><th>Idő</th>"
                + "<th>Hely</th><th>Anyja neve</th><th>Cím</th><th>Telefon</th>"
                + "<th>email</th><th>&nbsp;</th><th>&nbsp;</th><th>&nbsp;</th></tr>";
            json.forEach(j => {
                tabla.innerHTML += "<tr><td>" + j.jnev + "</td><td>" + j.szulnev + "</td>"
                    + "<td>" + j.szulido + "</td><td>" + j.szulhely + "</td>"
                    + "<td>" + j.anyjaneve + "</td><td>" + j.cim + "</td>"
                    + "<td>" + j.telefon + "</td><td>" + j.email + "</td>"
                    + '<td><button class="button btn-sm btn-primary" onclick="modosit('
                    + j.jid + ')">Módosítás</button></td>'
                    + '<td><button class="button btn-sm btn-outline-danger" onclick="torol('
                    + j.jid + ')">Törlés</button></td>'
                    + "</td></tr>"
            })
            letszam = json.length
            document.getElementById("letszam").innerHTML = " Létszám: " + letszam + " fő"
        })
        .catch(err => console.log(err));
}

document.getElementById("hozzaad").onclick = function (e) {
    e.preventDefault()
    let valasz = ellenoriz();
    document.getElementById("uzenet").innerHTML = valasz;
    if (valasz) return;
    const url = 'http://localhost:5000/public/jelentkezok';
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({
            "csid": Number(csid),
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
        .then(resp => {
            document.getElementById("uzenet").innerHTML = "Felvéve.";
        })
        .then(resp => jelentkezok())
        .catch(err => console.log(err));
}

function modosit(jid) {
    sessionStorage.jid = jid
    window.location = "jmodosit.html"
}

function torol(jid) {
    if (confirm("Biztosan törölni szeretnéd ezt a jelentkezőt?")) {
        fetch('http://localhost:5000/admin/jelentkezok/' + jid, {
            method: 'DELETE',
            headers: {
                'Authorization': token
            }
        })
            .then(res => {
                jelentkezok()
            })
            .catch(err => console.log(err));
    }
}

document.getElementById("kijelentkezes").onclick = function () {
    delete sessionStorage.token
    document.location = "index.html"
}

document.getElementById("vissza").onclick = function () {
    document.location = "csoportok.html"
}

function ellenoriz() {
    // betelt a csoport
    if (letszam == max) return "A csoport betelt!";
    //hibás név
    let nev = document.getElementById("jnev").value.trim();
    if (nev.length < 5 || nev.length > 60)
        return "Hibás név! (5-60 karakter lehet)"
    // hiányzó dátum
    let d = document.getElementById("szulido").value;
    if (d == "") return "Add meg a születési időt!";
    // 18 évnél fiatalabb
    let szev = d.substring(0, 4);
    let ev = new Date().getFullYear();
    if (szev >= ev - 18 || szev <= ev - 65)
        return "Hibás születési idő! (18-65 év közötti lehetsz)"
    // hibás születési hely
    let hely = document.getElementById("szulhely").value.trim();
    if (hely.length < 3 || hely.length > 60)
        return "Hibás születési hely! (3-60 karakter lehet)"
    // anyja neve hibás
    let an = document.getElementById("anyjaneve").value.trim();
    if (an.length < 5 || an.length > 60)
        return "Anyja neve hibás! (5-60 karakter lehet)"
    // cím hibás
    let cim = document.getElementById("cim").value.trim();
    if (cim.length < 15 || cim.length > 80)
        return "Hibás cím! (15-80 karakter lehet)"
    // telefon hibás
    let telefon = document.getElementById("telefon").value.trim();
    if (telefon.length < 8 || telefon.length > 15)
        return "Hibás telefonszám! (8-15 karakter lehet)"
    // pipa
    return "";
}
