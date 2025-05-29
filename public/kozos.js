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
    return "";
}

document.getElementById("kijelentkezes").onclick = function () {
    delete sessionStorage.token
    document.location.href = "index.html"
}
