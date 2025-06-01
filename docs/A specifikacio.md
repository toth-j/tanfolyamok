# Tanfolyamok alkalmazás specifikáció

## 1. Bevezetés

### 1.1. A projekt célja

Az alkalmazás célja egy reszponzív webes felület biztosítása, ahol a látogatók tájékozódhatnak az iskola által szervezett informatikai képzésekről, az induló csoportokról, és online jelentkezhetnek ezekre. Az alkalmazásnak továbbá rendelkeznie kell egy adminisztrációs felülettel az iskola dolgozói számára a csoportok és jelentkezők adatainak kezelésére.

### 1.2. Főbb funkciók

* Képzések és induló csoportok publikus megjelenítése.
* Online jelentkezés a csoportokra.
* Felhasználói authentikáció az adminisztrációs felülethez.
* Adminisztrátori felület a csoportok adatainak menedzselésére (létrehozás, listázás, módosítás, törlés).
* Adminisztrátori felület a jelentkezők adatainak menedzselésére (listázás csoportonként, létrehozás, módosítás, törlés).

## 2. Felhasználói szerepkörök és felületek

### 2.1. Látogató (publikus felület - `index.html`)

A látogatók számára elérhető felület, authentikáció nélkül.

* **Funkciók:**
  * Képzésleírások megtekintése.
  * Ezután induló, még szabad helyekkel rendelkező csoportok listájának megtekintése.
  * Online jelentkezési űrlap kitöltése és beküldése egy kiválasztott csoportra.
  * Adminisztrátori bejelentkezési lehetőség.

### 2.2. Adminisztrátor (admin felület - `csoportok.html`, `jelentkezok.html`, `modosit.html`, `jmodosit.html`)

Az iskola dolgozói számára elérhető, jelszóval védett felület.

* **Funkciók:**
  * Bejelentkezés a rendszerbe.
  * Az összes meghirdetett csoport listázása, részletes adatokkal és aktuális létszámmal.
  * Új csoportok hozzáadása.
  * Meglévő csoportok adatainak módosítása.
  * Csoportok törlése (ha nincs jelentkezője).
  * Egy adott csoporthoz tartozó jelentkezők listázása.
  * Új jelentkező manuális hozzáadása egy csoporthoz.
  * Meglévő jelentkezők adatainak módosítása.
  * Jelentkezők törlése egy csoportból.
  * Kijelentkezés a rendszerből.

## 3. Részletes funkcionális követelmények

### 3.1. Publikus felület (`index.html`)

#### 3.1.1. Képzések és csoportok megjelenítése

* Az oldalon meg kell jeleníteni az iskola által kínált képzések leírását.
* Dinamikusan kell listázni azokat a csoportokat, amelyek indulási dátuma a jövőben van (`GET /public/csoportok`).
* A listázott csoportoknál meg kell jeleníteni:
  * Csoport azonosítója
  * Képzés neve
  * Indulás dátuma
  * Időbeosztás
  * Ár
  * Aktuális szabad helyek száma (egy csoportba legfeljebb 8 fő jelentkezhet).

#### 3.1.2. Jelentkezés csoportra (`POST /public/jelentkezok`)

* A látogatóknak lehetőséget kell biztosítani egy kiválasztott csoportra való jelentkezésre egy űrlapon keresztül.
* **Űrlap adatai:** Csoportazonosító, Név, Születési név (opcionális), Születési idő, Születési hely, Anyja neve, Lakcím, Telefonszám, E-mail cím, Tandíj fizetésének vállalása (checkbox).
* **Validációk jelentkezéskor (kliens- és szerveroldalon):**
  * Minden kötelező mező kitöltése.
  * A kiválasztott csoport létezik és az indulási dátuma a jövőben van.
  * Az adott csoportban az adott e-mail címmel még nem történt jelentkezés.
  * A csoportban van még szabad hely (maximum 8 fő/csoport).
* Sikeres jelentkezés esetén a rendszer rögzíti a jelentkezőt és visszajelzést ad a felhasználónak.
* Sikertelen jelentkezés esetén hibaüzenet jelenik meg.

#### 3.1.3. Adminisztrátori bejelentkezés (`POST /admin`)

* Az oldalon lehetőséget kell biztosítani az adminisztrátoroknak a bejelentkezésre egy jelszó megadásával.
* Sikeres bejelentkezés esetén a rendszer egy authentikációs tokent generál, és átirányítja az adminisztrátort a csoportkezelő (`csoportok.html`) oldalra. A token `sessionStorage`-ben tárolódik.
* Sikertelen bejelentkezés (pl. hibás jelszó) esetén hibaüzenet jelenik meg.

### 3.2. Adminisztrációs felület

#### 3.2.1. Authentikáció

* Minden adminisztrációs funkcióhoz érvényes JWT token szükséges, amelyet a HTTP kérések `Authorization` fejlécében kell továbbítani.
* Lejárt vagy érvénytelen token esetén a rendszer hibaüzenetet ad és/vagy átirányít a bejelentkezési oldalra.

#### 3.2.2. Csoportok kezelése

* **Listázás (`GET /admin/csoportok`)**
  
  * Az összes rendszerben lévő csoport listázása táblázatos formában.
  * Megjelenített adatok: Csoportazonosító, Képzés neve, Indulás dátuma, Beosztás, Helyszín, Ár, Aktuális létszám.
  * A lista indulási dátum szerint csökkenő sorrendben jelenik meg.
  * Minden csoport mellett műveleti gombok: "Jelentkezők", "Módosítás", "Törlés".

* **Létrehozás (`POST /admin/csoportok`)**
  
  * Űrlap új csoport adatainak megadására: Képzés típusa (kiválasztás listából), Indulás dátuma, Beosztás, Helyszín, Ár.
  * **Validációk:**
    * Minden kötelező mező kitöltése.
    * Az ár nem lehet negatív.
    * A kiválasztott képzés (`kid`) létezik.
  * Sikeres létrehozás után a csoportlista frissül.

* **Módosítás (`GET /admin/csoportok/:csid`, `PUT /admin/csoportok/:csid`)**
  
  * A kiválasztott csoport adatainak betöltése egy szerkesztő űrlapra.
  * Az űrlapon módosíthatók a csoport adatai (Képzés típusa, Indulás dátuma, Beosztás, Helyszín, Ár).
  * **Validációk mentéskor:**
    * Minden kötelező mező kitöltése.
    * Az ár nem lehet negatív.
    * A kiválasztott képzés (`kid`) létezik.
  * Sikeres módosítás után visszanavigálás a csoportlistához, ahol a frissített adatok láthatók.

* **Törlés (`DELETE /admin/csoportok/:csid`)**
  
  * Csoport törlése azonosító alapján.
  * **Feltétel:** Csoport csak akkor törölhető, ha nincsenek hozzárendelt aktív jelentkezők. Ezt a rendszer ellenőrzi (pl. a `/admin/lista/:csid` lekérdezésével a frontend oldalon, illetve a backend oldalon adatbázis idegen kulcs kényszerrel).
  * Törlés előtt megerősítő kérdés.
  * Sikeres törlés után a csoportlista frissül.

#### 3.2.3. Jelentkezők kezelése

* **Listázás (`GET /admin/lista/:csid`)**
  
  * Egy kiválasztott csoporthoz tartozó összes jelentkező listázása táblázatos formában.
  * Megjelenített adatok: Jelentkező neve, Születési adatok, Cím, Elérhetőségek.
  * A lista a jelentkező neve szerint ábécé sorrendben jelenik meg.
  * Minden jelentkező mellett műveleti gombok: "Módosítás", "Törlés".
  * Az oldalon kijelzésre kerül a csoport aktuális és maximális létszáma.

* **Létrehozás (manuális, admin által - `POST /public/jelentkezok`)**
  
  * Űrlap új jelentkező adatainak megadására egy adott csoporthoz.
  * Az űrlap adatai megegyeznek a publikus jelentkezési űrlapéval.
  * **Validációk:** Hasonlóak a publikus jelentkezéshez (kötelező mezők, csoport létezik, email egyediség csoportonként, csoport nem telt be, csoport nem indult el).
  * Sikeres létrehozás után a jelentkezők listája frissül.

* **Módosítás (`GET /admin/jelentkezok/:jid`, `PUT /admin/jelentkezok/:jid`)**
  
  * A kiválasztott jelentkező adatainak betöltése egy szerkesztő űrlapra.
  * Az űrlapon módosíthatók a jelentkező adatai (beleértve azt is, hogy melyik csoporthoz tartozik - `csid`).
  * **Validációk mentéskor:**
    * Minden kötelező mező kitöltése.
    * A megadott új csoport (`csid`) létezik.
    * *Megjegyzés: A backend jelenlegi implementációja szerint a jelentkező módosításakor a célcsoport maximális létszámát nem ellenőrzi.*
  * Sikeres módosítás után visszanavigálás a jelentkezők listájához, ahol a frissített adatok láthatók.

* **Törlés (`DELETE /admin/jelentkezok/:jid`)**
  
  * Jelentkező törlése azonosító alapján.
  * Törlés előtt megerősítő kérdés.
  * Sikeres törlés után a jelentkezők listája frissül.

#### 3.2.4. Kijelentkezés

* Lehetőséget kell biztosítani az adminisztrátornak a kijelentkezésre.
* Kijelentkezéskor a `sessionStorage`-ből törlődik az authentikációs token, és a felhasználó átirányításra kerül a publikus főoldalra (`index.html`).

## 4. Nem funkcionális követelmények

* **Reszponzivitás:** Az alkalmazásnak helyesen kell megjelennie és használhatónak kell lennie különböző képernyőméreteken (desktop, tablet, mobil).
* **Adattárolás:** Az adatokat egy központi adatbázisban kell tárolni (a projekt SQLite-ot használ).
* **API Kommunikáció:** A frontend és a backend között a kommunikáció HTTP alapú API-n keresztül történik JSON adatformátummal.
* **Biztonság:** Az adminisztrációs felülethez való hozzáférés JWT token alapú authentikációval védett.

## 5. Adatmodell

Az alkalmazás a következő főbb entitásokat és kapcsolataikat kezeli:

### 5.1. `kepzesek` tábla

| Oszlop    | Típus   | Megkötések                | Leírás          |
|:--------- |:------- |:------------------------- |:--------------- |
| `kid`     | INTEGER | PRIMARY KEY AUTOINCREMENT | Képzés ID       |
| `knev`    | TEXT    | NOT NULL                  | Képzés neve     |
| `oraszam` | INTEGER | NOT NULL                  | Képzés óraszáma |

### 5.2. `csoportok` tábla

| Oszlop     | Típus   | Megkötések                                                  | Leírás                                      |
|:---------- |:------- |:----------------------------------------------------------- |:------------------------------------------- |
| `csid`     | INTEGER | PRIMARY KEY AUTOINCREMENT                                   | Csoport ID                                  |
| `kid`      | INTEGER | NOT NULL, FOREIGN KEY (`kid`) REFERENCES `kepzesek` (`kid`) | Képzés ID (hivatkozás a `kepzesek` táblára) |
| `indulas`  | TEXT    | NOT NULL                                                    | Indulás dátuma (YYYY-MM-DD formátumban)     |
| `beosztas` | TEXT    | NOT NULL                                                    | Időbeosztás (pl. "kedd-csütörtök 18-21")    |
| `helyszin` | TEXT    | NOT NULL                                                    | Helyszín (pl. "online", "tanterem")         |
| `ar`       | INTEGER | NOT NULL                                                    | Ár                                          |

### 5.3. `jelentkezok` tábla

| Oszlop      | Típus   | Megkötések                                                     | Leírás                                        |
|:----------- |:------- |:-------------------------------------------------------------- |:--------------------------------------------- |
| `jid`       | INTEGER | PRIMARY KEY AUTOINCREMENT                                      | Jelentkező ID                                 |
| `csid`      | INTEGER | NOT NULL, FOREIGN KEY (`csid`) REFERENCES `csoportok` (`csid`) | Csoport ID (hivatkozás a `csoportok` táblára) |
| `jnev`      | TEXT    | NOT NULL                                                       | Jelentkező neve                               |
| `szulnev`   | TEXT    | DEFAULT NULL                                                   | Születési név (ha eltér)                      |
| `szulido`   | TEXT    | NOT NULL                                                       | Születési idő (YYYY-MM-DD formátumban)        |
| `szulhely`  | TEXT    | NOT NULL                                                       | Születési hely                                |
| `anyjaneve` | TEXT    | NOT NULL                                                       | Anyja neve                                    |
| `cim`       | TEXT    | NOT NULL                                                       | Lakcím                                        |
| `telefon`   | TEXT    | NOT NULL                                                       | Telefonszám                                   |
| `email`     | TEXT    | NOT NULL                                                       | E-mail cím                                    |

## 6. Technológiák

* **Frontend:**
  * HTML5
  * CSS3 (egyedi stílusok + Bootstrap 5.3)
  * JavaScript (ES6+)
* **Backend:**
  * Node.js
  * Express.js
* **Adatbázis:**
  * SQLite
* **Authentikáció:**
  * JWT (JSON Web Token)
