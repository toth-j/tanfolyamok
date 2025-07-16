# Frontend fejlesztői dokumentáció

Ez a dokumentáció a tanfolyamkezelő alkalmazás frontend részének működését írja le. Az alkalmazás HTML, CSS és JavaScript technológiákat használ a felhasználói felület megjelenítésére és az interakciók kezelésére.

## Tartalomjegyzék

- [Frontend fejlesztői dokumentáció](#frontend-fejlesztői-dokumentáció)
  - [Tartalomjegyzék](#tartalomjegyzék)
  - [Használt technológiák](#használt-technológiák)
  - [Általános működés](#általános-működés)
  - [HTML fájlok leírása](#html-fájlok-leírása)
    - [**`public/index.html`**](#publicindexhtml)
    - [**`public/csoportok.html`**](#publiccsoportokhtml)
    - [**`public/jelentkezok.html`**](#publicjelentkezokhtml)
    - [**`public/modosit.html`**](#publicmodosithtml)
  - [JavaScript fájlok leírása](#javascript-fájlok-leírása)
    - [**`public/index.js`**](#publicindexjs)
    - [**`public/csoportok.js`**](#publiccsoportokjs)
    - [**`public/jelentkezok.js`**](#publicjelentkezokjs)
    - [**`public/modosit.js`**](#publicmodositjs)
    - [**`public/jmodosit.js`**](#publicjmodositjs)
  - [Frontend futtatása](#frontend-futtatása)
  - [Manuális tesztelés](#manuális-tesztelés)

## Használt technológiák

* **HTML5**: Az oldalak strukturális felépítése.
* **CSS3**: Az oldalak stílusának és megjelenésének testreszabása.
  * `public/css/style.css`: Egyedi stílusok.
* **JavaScript (ES6+)**: A kliensoldali logika, dinamikus tartalomkezelés, API kommunikáció.
* **Bootstrap 5.3**: Reszponzív design és előre elkészített UI komponensek (navigációs sáv, kártyák, űrlapok, gombok, stb.).

## Általános működés

A frontend kommunikál egy backend API-val (alapértelmezetten `http://localhost:5000`) az adatok lekérdezéséhez és módosításához. A felhasználói azonosítás `sessionStorage`-ben tárolt token segítségével történik az adminisztrációs felületeken. A reszponzív megjelenésért és az alapvető stílusokért a Bootstrap keretrendszer felel.

* * *

## HTML fájlok leírása

### **`public/index.html`**

* **Kapcsolódó JavaScript:** `public/index.js`
* **Célja:** Az alkalmazás főoldala, amely publikusan elérhető. Itt tekinthetők meg a meghirdetett képzések leírásai, az induló csoportok listája, valamint innen lehet jelentkezni a csoportokra. Ennek az oldalnak az alján található az adminisztrátori bejelentkezési felület is.
* **Fontosabb elemek és funkciók:**
  * **Fejléc (`<header>`):** Megjeleníti az iskola nevét és a képzések típusát.
  * **Navigáció (`<nav class="navbar">`):** Oldalon belüli linkeket tartalmaz a különböző képzésleírásokhoz (`#frontend`, `#backend`, `#fullstack`) és a jelentkezési szekcióhoz (`#jelentkezes`). Mobil nézetben összecsukható menüként jelenik meg.
  * **Képzésleírások (pl. `<div class="row my-4" id="frontend">`):** Bootstrap grid rendszert használva jeleníti meg az egyes képzésekhez tartozó leírásokat és illusztrációs képeket. Tartalmaznak külső linkeket a részletes követelményekhez.
  * **Induló csoportok (`<div id="jelentkezes">` -> `<table id="csoportok">`):** Egy táblázat, amelyet az `index.js` dinamikusan tölt fel a `/public/csoportok` API végpontról lekért adatokkal. Megjeleníti a csoport azonosítóját, képzés nevét, indulási dátumát, beosztását, szabad helyek számát és az árát.
  * **Jelentkezési Űrlap (`<form>` a `<div id="jelentkezes">`-en belül):**
    * Input mezők a jelentkező adatainak (csoportazonosító, név, születési adatok, cím, elérhetőségek) megadására.
    * Egy checkbox (`#tandij`) a tandíj fizetésének vállalására .
    * Egy bekezdés (`<p id="uzenet">`) a validációs vagy szerveroldali üzenetek megjelenítésére.
    * "Jelentkezem" gomb (`#jelentkezemGomb`), amely elindítja a validálási és beküldési folyamatot az `index.js` segítségével.
  * **Lábléc (`<footer>`):** Elérhetőségi információkat és ismételt navigációs linkeket tartalmaz.
  * **Adminisztrátori Bejelentkezés (`<form id="bejelentkezes">`):**
    * Jelszó beviteli mező (`#password`).
    * "Bejelentkezés" gomb (`#login`), amely az `index.js`-ben kezeli a bejelentkezési kísérletet.
    * Egy bekezdés (`<p id="uzenet2">`) a bejelentkezési eredmény (hibaüzenet) megjelenítésére.
* **Interakciók:** Az `index.js` kezeli a csoportok listázását, a jelentkezési űrlap validálását (az `ellenoriz` függvényével) és beküldését, valamint az adminisztrátori bejelentkezést.

### **`public/csoportok.html`**

* **Kapcsolódó JavaScript:** `public/csoportok.js`
* **Célja:** Az adminisztrációs felület fő oldala a bejelentkezés után. Itt listázódnak a meglévő csoportok, lehetőség van újakat hozzáadni, meglévőket módosítani, törölni, valamint innen lehet navigálni az egyes csoportok jelentkezőinek listájához.
* **Fontosabb Strukturális Elemek és Funkciók:**
  * **Kijelentkezés gomb (`#kijelentkezes`):** Lehetővé teszi az adminisztrátor számára a kijelentkezést.
  * **Cím (`<h1>Csoportok</h1>`):** Az oldal címe.
  * **Új csoport hozzáadása űrlap (`<form>`):**
    * Input mezők az új csoport adatainak (képzés típusa, indulás dátuma, beosztás, helyszín, ár) megadására.
    * A képzés kiválasztása egy `select` listából történik (`#kepzes`).
    * Az indulás dátumának alapértelmezett értéke a mai nap, amit a `csoportok.js` állít be.
    * "Hozzáadás" gomb (`#hozzaad`), amely elindítja az új csoport létrehozását a `csoportok.js` segítségével.
  * **Csoportok táblázata (`<table id="csoportok">`):**
    * Dinamikusan töltődik fel a `csoportok.js` által az `/admin/csoportok` API végpontról lekért adatokkal.
    * Megjeleníti a csoportok azonosítóját, képzés nevét, indulását, beosztását, helyszínét, árát és aktuális létszámát.
    * Minden sor tartalmaz "Jelentkezők", "Módosítás", "Törlés" gombokat, amelyek a `csoportok.js`-ben definiált funkciókat hívják meg (`jelentkezok(csid)`, `modosit(csid)`, `torol(csid)`).
* **Interakciók:** A `csoportok.js` kezeli a csoportok listázását, új csoport hozzáadását, a meglévő csoportokhoz kapcsolódó műveleti gombok (jelentkezők megtekintése, módosítás, törlés) eseményeit, és a kijelentkezést.

### **`public/jelentkezok.html`**

* **Kapcsolódó JavaScript:** `public/jelentkezok.js`
* **Célja:** Adminisztrációs felület, ahol egy kiválasztott csoporthoz tartozó jelentkezők listája jelenik meg. Lehetőség van új jelentkezőt manuálisan hozzáadni a csoporthoz, valamint a meglévő jelentkezők adatait módosítani vagy törölni őket.
* **Fontosabb elemek és funkciók:**
  * **Kijelentkezés gomb (`#kijelentkezes`):** Adminisztrátori kijelentkezés.
  * **Vissza gomb (`#vissza`):** Visszanavigál a `csoportok.html` oldalra.
  * **Csoport azonosító kijelzése :** A `jelentkezok.js` dinamikusan írja bele a `sessionStorage`-ből olvasott csoportazonosítót.
  * **Új jelentkező hozzáadása űrlap (`<form>`):**
    * Hasonló a publikus `index.html` jelentkezési űrlapjához, input mezőkkel a jelentkező adatainak megadására.
    * "Hozzáadás" gomb (`#hozzaad`), amely a `jelentkezok.js` segítségével elküldi az új jelentkező adatait.
  * **Létszám kijelzése (`<p id="letszam"></p>`):** A `jelentkezok.js` dinamikusan frissíti a csoport aktuális létszámával.
  * **Jelentkezők táblázata (`<table id="jelentkezok">`):**
    * Dinamikusan töltődik fel a `jelentkezok.js` által az `/admin/lista/{csid}` API végpontról lekért adatokkal.
    * Megjeleníti a jelentkezők nevét, születési adatait, címét, elérhetőségeit.
    * Minden sor tartalmaz "Módosítás" és "Törlés" gombokat, amelyek a `jelentkezok.js`-ben definiált funkciókat hívják meg (`modosit(jid)`, `torol(jid)`).
* **Interakciók:** A `jelentkezok.js` kezeli a kiválasztott csoport jelentkezőinek listázását, új jelentkező hozzáadását (validációval), meglévő jelentkezők módosítására való átirányítást, jelentkezők törlését, valamint a kijelentkezést és a vissza navigációt.

### **`public/modosit.html`**

* **Kapcsolódó JavaScript:** `public/modosit.js`
* **Célja:** Adminisztrációs felület egy kiválasztott csoport adatainak módosítására.
* **Fontosabb elemek és funkciók:**
  * **Kijelentkezés gomb (`#kijelentkezes`):** Adminisztrátori kijelentkezés.
  * **Vissza gomb (`#vissza`):** Visszanavigál a `csoportok.html` oldalra.
  * **Csoport azonosító kijelzése:** A `modosit.js` dinamikusan írja bele a `sessionStorage`-ből olvasott csoportazonosítót.
  * **Csoport Módosítása Űrlap (`<form>`):**
    * Input mezők a csoport adatainak (képzés típusa, indulás dátuma, beosztás, helyszín, ár) megjelenítésére és módosítására.
    * Az űrlap mezőit a `modosit.js` tölti fel a `/admin/csoportok/{csid}` API végpontról lekért aktuális csoportadatokkal.
    * "Módosítás" gomb (`#modosit`), amely elindítja a csoport adatainak frissítését a `modosit.js` segítségével.
* **Interakciók:** A `modosit.js` kezeli a kiválasztott csoport adatainak betöltését az űrlapba, az adatok módosításának elküldését a szerver felé, valamint a kijelentkezést és a vissza navigációt.

* * *

## JavaScript fájlok leírása

A frontend JavaScript logikája több fájlra van bontva, mindegyik egy adott oldalhoz vagy funkcionalitáshoz kapcsolódik.

### **`public/index.js`**

* **Célja:** A publikus főoldal logikáját tartalmazza, ahol a felhasználók megtekinthetik a meghirdetett csoportokat és jelentkezhetnek rájuk, valamint az adminisztrátorok bejelentkezhetnek.
* **Globális változók:**
  * `max = 8`: Meghatározza egy csoport maximális létszámát.
  * `adatok`: Tárolja a lekérdezett csoportok adatait.
* **Függvények:**
  * `csoportok()`: Aszinkron függvény, amely lekéri a publikus csoportok listáját a `/public/csoportok` végpontról. A válasz alapján dinamikusan felépíti a csoportokat megjelenítő HTML táblázatot. Hiba esetén hibaüzenetet jelenít meg a táblázatban.
* **Eseménykezelők:**
  * `document.getElementById("jelentkezemGomb").onclick`:
    * Meghívja az `ellenoriz()` függvényt a jelentkezési űrlap validálására.
    * Ha a validáció sikeres, összegyűjti az űrlap adatait és POST kérést küld a `/public/jelentkezok` végpontra a jelentkezés rögzítésére.
    * Sikeres jelentkezés után üzenetet jelenít meg, letiltja a gombot, és frissíti a csoportok listáját.
    * Hiba esetén hibaüzenetet jelenít meg.
  * `document.getElementById("login").onclick`:
    * Összegyűjti a jelszót a beviteli mezőből.
    * POST kérést küld az `/admin` végpontra a bejelentkezéshez.
    * Sikeres bejelentkezés esetén a kapott tokent `sessionStorage`-be menti és átirányítja a felhasználót a `csoportok.html` oldalra.
    * Hiba (pl. hibás jelszó) esetén üzenetet jelenít meg.

### **`public/csoportok.js`**

* **Célja:** Az adminisztrációs felület csoportkezelő oldalának logikáját tartalmazza. Itt lehet új csoportokat hozzáadni, meglévőket módosítani, törölni, valamint megtekinteni a csoportokhoz tartozó jelentkezőket.
* **Inicializálás:**
  * Az "Indulás" dátum mező alapértelmezett értéke a mai nap.
  * Meghívja a `csoportok()` függvényt a csoportlista betöltéséhez.
* **Függvények:**
  * `csoportok()`: Aszinkron függvény, amely GET kérést küld az `/admin/csoportok` végpontra (authentikációval) a csoportok listájának lekéréséhez. Dinamikusan felépíti a HTML táblázatot a csoportadatokkal és a hozzájuk tartozó "Jelentkezők", "Módosítás", "Törlés" gombokkal. Hiba esetén hibaüzenetet jelenít meg.
  * `jelentkezok(csid)`: A `csid` (csoport azonosító) alapján a `sessionStorage`-be menti az azonosítót, majd átirányít a `jelentkezok.html` oldalra.
  * `modosit(csid)`: A `csid` alapján a `sessionStorage`-be menti az azonosítót, majd átirányít a `modosit.html` oldalra.
  * `torol(csid)`: Aszinkron függvény.
    * Először lekérdezi a `/admin/lista/{csid}` végpontról, hogy vannak-e jelentkezők a csoporthoz.
    * Ha vannak jelentkezők, figyelmeztetést jelenít meg, hogy csak üres csoport törölhető.
    * Ha a csoport üres, megerősítést kér a törléshez.
    * Megerősítés esetén DELETE kérést küld az `/admin/csoportok/{csid}` végpontra a csoport törléséhez.
    * Sikeres törlés után frissíti a csoportok listáját.
    * Hiba esetén hibaüzenetet logol és `alert`-ben is megjeleníti.
* **Eseménykezelők:**
  * `document.getElementById("hozzaad").onclick`:
    * Összegyűjti az új csoport adatait a formról.
    * POST kérést küld az `/admin/csoportok` végpontra (authentikációval) az új csoport létrehozásához.
    * Sikeres hozzáadás után üríti a formot és frissíti a csoportok listáját.
    * Hiba esetén hibaüzenetet logol és `alert`-ben is megjeleníti.
  * `document.getElementById("kijelentkezes").onclick`: Törli a tokent a `sessionStorage`-ből és átirányít az `index.html` oldalra.

### **`public/jelentkezok.js`**

* **Célja:** Az adminisztrációs felületen egy adott csoporthoz tartozó jelentkezők listázását és kezelését (hozzáadás, módosítás, törlés) végzi.
* **Globális változók/konstansok:**
  * `csid`: A `sessionStorage`-ből kiolvasott aktuális csoport azonosítója.
  * `token`: Az authentikációs token.
  * `letszam`: A csoport aktuális létszáma.
  * `max = 8`: A csoport maximális létszáma (ismételt definíció, lásd `index.js`).
* **Inicializálás:**
  * Megjeleníti a `csid`-t az oldalon.
  * Meghívja a `jelentkezok()` függvényt.
* **Függvények:**
  * `jelentkezok()`: Aszinkron függvény, amely GET kérést küld az `/admin/lista/{csid}` végpontra (authentikációval) a csoporthoz tartozó jelentkezők lekéréséhez. Felépíti a jelentkezők adatait és a "Módosítás", "Törlés" gombokat tartalmazó HTML táblázatot. Frissíti a létszám kijelzését. Hiba esetén hibaüzenetet jelenít meg.
  * `modosit(jid)`: A `jid` (jelentkező azonosító) alapján a `sessionStorage`-be menti az azonosítót, majd átirányít a `jmodosit.html` oldalra.
  * `torol(jid)`: Aszinkron függvény.
    * Megerősítést kér a jelentkező törléséhez.
    * Megerősítés esetén DELETE kérést küld az `/admin/jelentkezok/{jid}` végpontra (authentikációval) a jelentkező törléséhez.
    * Sikeres törlés után frissíti a jelentkezők listáját.
    * Hiba esetén hibaüzenetet logol.
* **Eseménykezelők:**
  * `document.getElementById("hozzaad").onclick`:
    * Megakadályozza az űrlap alapértelmezett küldését (`e.preventDefault()`).
    * Összegyűjti az új jelentkező adatait a formról.
    * POST kérést küld a `/public/jelentkezok` végpontra az új jelentkező hozzáadásához (figyelem: ez a publikus végpont, de admin oldali hozzáadásnál is ezt használja, ami biztonsági megfontolásokat vethet fel, ha nincs szerveroldali jogosultságkezelés a kontextus alapján).
    * Sikeres hozzáadás után üríti a formot és frissíti a jelentkezők listáját.
    * Hiba esetén hibaüzenetet logol és `alert`-ben is megjeleníti.
  * `document.getElementById("kijelentkezes").onclick`: Törli a tokent és átirányít az `index.html`-re.
  * `document.getElementById("vissza").onclick`: Átirányít a `csoportok.html` oldalra.

### **`public/modosit.js`**

* **Célja:** Egy meglévő csoport adatainak módosítására szolgáló adminisztrációs oldal logikája.
* **Globális változók/konstansok:**
  * `csid`: A `sessionStorage`-ből kiolvasott módosítandó csoport azonosítója.
* **Inicializálás:**
  * Megjeleníti a `csid`-t az oldalon.
  * Meghívja a `betolt()` függvényt.
* **Függvények:**
  * `betolt()`: Aszinkron függvény, amely GET kérést küld az `/admin/csoportok/{csid}` végpontra (authentikációval) a csoport adatainak lekéréséhez. Kitölti a form mezőit a kapott adatokkal. Hiba esetén hibaüzenetet jelenít meg.
* **Eseménykezelők:**
  * `document.getElementById("modosit").onclick`:
    * Összegyűjti a módosított csoportadatokat a formról.
    * PUT kérést küld az `/admin/csoportok/{csid}` végpontra (authentikációval) az adatok frissítéséhez.
    * Sikeres módosítás esetén átirányít a `csoportok.html` oldalra.
    * Hiba esetén hibaüzenetet logol és `alert`-ben is megjeleníti.
  * `document.getElementById("kijelentkezes").onclick`: Törli a tokent és átirányít az `index.html`-re.
  * `document.getElementById("vissza").onclick`: Átirányít a `csoportok.html` oldalra.

### **`public/jmodosit.js`**

* **Célja:** Egy meglévő jelentkező adatainak módosítására szolgáló adminisztrációs oldal logikája.
* **Globális változók/konstansok:**
  * `jid`: A `sessionStorage`-ből kiolvasott módosítandó jelentkező azonosítója.
  * `token`: Az authentikációs token.
* **Inicializálás:**
  * Megjeleníti a `jid`-t az oldalon.
  * Meghívja a `betolt()` függvényt.
* **Függvények:**
  * `betolt()`: Aszinkron függvény, amely GET kérést küld az `/admin/jelentkezok/{jid}` végpontra (authentikációval) a jelentkező adatainak lekéréséhez. Kitölti a form mezőit a kapott adatokkal. Hiba esetén hibaüzenetet jelenít meg.
* **Eseménykezelők:**
  * `document.getElementById("modosit").onclick`:
    * Összegyűjti a módosított jelentkező adatokat a formról (beleértve a `csid`-t is a `sessionStorage`-ből).
    * PUT kérést küld az `/admin/jelentkezok/{jid}` végpontra (authentikációval) az adatok frissítéséhez.
    * Sikeres módosítás esetén átirányít a `jelentkezok.html` oldalra.
    * Hiba esetén hibaüzenetet logol és `alert`-ben is megjeleníti.
  * `document.getElementById("kijelentkezes").onclick`: Törli a tokent és átirányít az `index.html`-re.
  * `document.getElementById("vissza").onclick`: Átirányít a `jelentkezok.html` oldalra.

## Frontend futtatása

A frontend fájlokat a Node.js/Express backend szolgálja ki statikus fájlokként a `public` mappából. Tehát a frontend futtatásához a backend szervert kell elindítani (`npm start` vagy `node server.js`), majd a böngészőben megnyitni a `http://localhost:5000` címet.

## Manuális tesztelés

A frontend alkalmazás funkcionalitásának és felhasználói élményének ellenőrzése érdekében manuális tesztelési esetek kerültek kidolgozásra. Ezek a tesztek lefedik a főbb felhasználói utakat, a felhasználói felület elemeinek helyes működését, valamint a reszponzivitást különböző eszközökön.

A részletes manuális tesztelési esetek és a tesztelési folyamat leírása a következő dokumentumokban található:

* `tests/public_e2e.md`
* `tests/admin_e2e.md`

**Megjegyzések**:

* Ha az adatbázis már tartalmaz megőrzendő adatokat, akkor az adatbázisfájlt a tesztek futtatása előtt célszerű átnevezni.
* Utána egy új adatbázisba be kell tölteni a tesztadatokat a tesztadatok.sql futtatásával.
* A tesztek futtatása előtt győződj meg róla, hogy a szerver fut.
* Az admin funkciók teszteléséhez először be kell jelentkezni.

A tesztek futtatását a `tests/test_execution_log.xlsx` fájlban dokumentáljuk.
