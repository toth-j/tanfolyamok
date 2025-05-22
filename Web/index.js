const max = 8;
let adatok;
csoportok();

function csoportok() {
    const url = 'http://localhost:5000/public/csoportok';
    const tabla = document.getElementById("csoportok");
    fetch(url)
        .then((response) => response.json())
        .then(json => {
            adatok = json;
            tabla.innerHTML = "<tr><th>Azonosító</th><th>Képzés</th><th>Indulás</th>"
                + "<th>Beosztás</th><th>Szabad hely</th><th>Ár (Ft)</th></tr>";
            json.forEach(cs => {
                tabla.innerHTML += "<tr><td>" + cs.csid + "</td><td>" + cs.knev
                    + "</td><td>" + cs.indulas + "</td><td>" + cs.beosztas
                    + "</td><td>" + (max - cs.letszam) + "</td><td>" + cs.ar.toLocaleString() + "</td></tr>"
            });
        })
        .catch(err => console.log(err));
}

function ellenoriz() {
    // nem számot írtak be
    let cs = document.getElementById("csid").value;
    if (isNaN(cs)) return "Hibás csoportazonosító!";
    // nincs ilyen csoport
    let van = false;
    let index;
    for (let i = 0; i < adatok.length; i++)
        if (adatok[i].csid == cs) {
            van = true;
            index = i;
        }
    if (!van) return "Nincs ilyen csoport!";
    // betelt a csoport
    if (adatok[index].letszam == max) return "A csoport betelt!";
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
    if (!document.getElementById("tandij").checked)
        return "Kapcsold be a pipát!"
    return "";
}

document.getElementById("gomb").onclick = function (e) {
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
            "csid": document.getElementById("csid").value,
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
            document.getElementById("uzenet").innerHTML = "Köszönjük jelentkezésedet!";
            document.getElementById("gomb").disabled = true;
        })
        .then(csoportok())
        .catch(err => console.log(err));
}

document.getElementById("login").onclick = function (e) {
    const url = 'http://localhost:5000/admin';
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({
            "password": document.getElementById("password").value,
        })
    })
        .then(res => {
            ok = res.ok
            return res.json()
        })
        .then(json => {
            document.getElementById("uzenet2").innerHTML = json.message
            if (ok) {
                sessionStorage.token = json.token
                document.location = "csoportok.html"
            }
        })
        .catch(err => console.log(err));
}
