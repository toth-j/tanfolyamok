# Tanfolyamok backend dokumentáció

Ez a dokumentum a Tanfolyamkezelő Rendszer backend API-jának fejlesztői dokumentációját tartalmazza.

## Tartalomjegyzék

1. [Bevezetés](#1-bevezetés)
2. [Telepítés és futtatás](#2-telepítés-és-futtatás)
    * [Előfeltételek](#előfeltételek)
    * [Konfiguráció](#konfiguráció)
    * [Indítás](#indítás)
    * [Adatbázis inicializálása](#adatbázis-inicializálása)
3. [Adatbázis séma](#3-adatbázis-séma)
    * [`kepzesek` tábla](#kepzesek-tábla)
    * [`csoportok` tábla](#csoportok-tábla)
    * [`jelentkezok` tábla](#jelentkezok-tábla)
4. [Authentikáció (Admin API)](#4-authentikáció-admin-api)
5. [API Végpontok](#5-api-végpontok)
    * [Publikus API](#publikus-api)
        * [GET `/public/csoportok`](#get-publiccsoportok)
        * [POST `/public/jelentkezok`](#post-publicjelentkezok)
    * [Admin API](#admin-api)
        * [POST /admin (Bejelentkezés)](#post-admin-bejelentkezés)
        * [GET /admin/csoportok](#get-admincsoportok)
        * [POST /admin/csoportok](#post-admincsoportok)
        * [GET /admin/csoportok/:csid](#get-admincsoportokcsid)
        * [PUT /admin/csoportok/:csid](#put-admincsoportokcsid)
        * [DELETE /admin/csoportok/:csid](#delete-admincsoportokcsid)
        * [GET /admin/lista/:csid](#get-adminlistacsid)
        * [GET /admin/jelentkezok/:jid](#get-adminjelentkezokjid)
        * [PUT /admin/jelentkezok/:jid](#put-adminjelentkezokjid)
        * [DELETE /admin/jelentkezok/:jid](#delete-adminjelentkezokjid)
6. [Tesztelés](#6-tesztelés)
    * [Előfeltételek a teszteléshez](#előfeltételek-a-teszteléshez)
    * [Tesztfájlok](#tesztfájlok)
    * [Tesztek futtatása](#tesztek-futtatása)
    * [Tesztesetek felépítése](#tesztesetek-felépítése)

## 1. Bevezetés

A backend egy Node.js és Express.js alapú alkalmazás, amely SQLite adatbázist használ a tanfolyamok, csoportok és jelentkezők adatainak tárolására. Két fő API részre oszlik: egy publikus API a tanfolyamok böngészéséhez és a jelentkezéshez, valamint egy adminisztrációs API a rendszer kezeléséhez.

## 2. Telepítés és futtatás

### Előfeltételek

* Node.js (ajánlott LTS verzió)
* npm (Node.js-sel együtt települ)

### Konfiguráció

1. Klónozza vagy töltse le a repository-t.
2. Telepítse a függőségeket:

    ```bash
    npm install
    ```

3. Hozzon létre egy `.env` fájlt a projekt gyökérkönyvtárában a következő tartalommal:

    ```env
    ADMIN="bcrypt_hash_az_admin_jelszohoz"
    TOKEN_SECRET="nagyon_titkos_kulcs_a_jwt_tokenhez"
    ```

    * `ADMIN`: Az adminisztrátori jelszó bcrypt hash-e. Generálhat egyet például a következő Node.js kóddal:

        ```javascript
        // pl. generateHash.js
        const bcrypt = require('bcrypt');
        const saltRounds = 10;
        const plainPassword = 'TanfAdmin!2025'; // Cserélje le a kívánt jelszóra
        bcrypt.hash(plainPassword, saltRounds, function(err, hash) {
            if (err) {
                console.error("Hiba a hash generálásakor:", err);
                return;
            }
            console.log("ADMIN=", hash);
        });
        ```

        Futtatás: `node generateHash.js`
    * `TOKEN_SECRET`: Egyedi, titkos karaktersorozat a JWT tokenek aláírásához.

### Indítás

Az alkalmazás indítása:

```bash
node app.js
```

A szerver alapértelmezetten az `5000`-es porton indul.

### Adatbázis inicializálása

Az alkalmazás indításkor automatikusan létrehozza a `tanfolyamok.db` SQLite adatbázis fájlt és a szükséges táblákat, ha azok még nem léteznek.

A `tesztadatok.sql` fájl tartalmazza a kezdeti tesztadatokat. Ezeket manuálisan futtathatja egy SQLite böngészővel vagy az `sqlite3` parancssori eszközzel a `tanfolyamok.db` fájlon, miután az létrejött:

```bash
sqlite3 tanfolyamok.db < tesztadatok.sql
```

## 3. Adatbázis séma

Az alkalmazás SQLite adatbázist használ. A PRAGMA `foreign_keys = ON` beállítás aktív.

### `kepzesek` tábla

| Oszlop   | Típus   | Megkötések                  | Leírás          |
| :------- | :------ | :-------------------------- | :-------------- |
| `kid`    | INTEGER | PRIMARY KEY AUTOINCREMENT   | Képzés ID       |
| `knev`   | TEXT    | NOT NULL                    | Képzés neve     |
| `oraszam`| INTEGER | NOT NULL                    | Képzés óraszáma |

### `csoportok` tábla

| Oszlop     | Típus   | Megkötések                                  | Leírás                                  |
| :--------- | :------ | :------------------------------------------ | :-------------------------------------- |
| `csid`     | INTEGER | PRIMARY KEY AUTOINCREMENT                   | Csoport ID                              |
| `kid`      | INTEGER | NOT NULL, FOREIGN KEY (`kid`) REFERENCES `kepzesek` (`kid`) | Képzés ID (hivatkozás a `kepzesek` táblára) |
| `indulas`  | TEXT    | NOT NULL                                    | Indulás dátuma (YYYY-MM-DD formátumban) |
| `beosztas` | TEXT    | NOT NULL                                    | Időbeosztás (pl. "kedd-csütörtök 18-21") |
| `helyszin` | TEXT    | NOT NULL                                    | Helyszín (pl. "online", "tanterem")     |
| `ar`       | INTEGER | NOT NULL                                    | Ár                                      |

### `jelentkezok` tábla

| Oszlop    | Típus   | Megkötések                                    | Leírás                                   |
| :-------- | :------ | :-------------------------------------------- | :--------------------------------------- |
| `jid`     | INTEGER | PRIMARY KEY AUTOINCREMENT                     | Jelentkező ID                            |
| `csid`    | INTEGER | NOT NULL, FOREIGN KEY (`csid`) REFERENCES `csoportok` (`csid`) | Csoport ID (hivatkozás a `csoportok` táblára) |
| `jnev`    | TEXT    | NOT NULL                                      | Jelentkező neve                          |
| `szulnev` | TEXT    | DEFAULT NULL                                  | Születési név (ha eltér)                 |
| `szulido` | TEXT    | NOT NULL                                      | Születési idő (YYYY-MM-DD formátumban)   |
| `szulhely`| TEXT    | NOT NULL                                      | Születési hely                           |
| `anyjaneve`| TEXT   | NOT NULL                                      | Anyja neve                               |
| `cim`     | TEXT    | NOT NULL                                      | Lakcím                                   |
| `telefon` | TEXT    | NOT NULL                                      | Telefonszám                              |
| `email`   | TEXT    | NOT NULL                                      | E-mail cím                               |

![diagram](db.png)

## 4. Authentikáció (Admin API)

Az Admin API végpontjai JWT (JSON Web Token) alapú authentikációt használnak.

1. A `/admin` végponton történő sikeres bejelentkezés után a válasz tartalmaz egy JWT tokent.
2. Ezt a tokent minden további Admin API kérésnél az `Authorization` HTTP headerben kell elküldeni, `Bearer <token>` formátumban.

Példa: `Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

A token érvényességi ideje 3600 másodperc (1 óra).

## 5. API Végpontok

Alap URL: `http://localhost:5000`

### Publikus API

#### GET `/public/csoportok`

* **Leírás**: Visszaadja az aktuális dátumtól kezdődően (a jövőben) induló csoportok adatait, létszámmal együtt.
* **Authentikáció**: Nem szükséges.
* **Válasz**:
  * `200 OK`:

    ```json
    [
      {
        "csid": 3,
        "knev": "Junior Java backend fejlesztő",
        "indulas": "2025-09-07",
        "beosztas": "szerda-péntek 17-20 óráig",
        "ar": 390000,
        "letszam": 8
      }
      // ...további csoportok
    ]
    ```

  * `500 Internal Server Error`: `{ "message": "Adatbázis hiba történt." }`

#### POST `/public/jelentkezok`

* **Leírás**: Új jelentkezőt regisztrál egy csoporthoz.
* **Authentikáció**: Nem szükséges.
* **Request Body**: `application/json`

    ```json
    {
        "csid": 4,
        "jnev": "Teszt Elek Új",
        "szulnev": "Teszt Elek Új", // Opcionális, alapértelmezetten null
        "szulido": "1990-01-01",
        "szulhely": "Tesztváros",
        "anyjaneve": "Teszt Anya",
        "cim": "1234 Teszt utca 5.",
        "telefon": "36301234567",
        "email": "teszt.elek.uj@example.com"
    }
    ```

  * **Kötelező mezők a 400-as "Hiányzó kötelező mezők" hibához**: `csid`, `jnev`, `email`.
  * **További, adatbázis szinten kötelező (NOT NULL) mezők**: `szulido`, `szulhely`, `anyjaneve`, `cim`, `telefon`. Ezek hiánya 500-as adatbázis hibát eredményez.
* **Válasz**:
  * `201 Created`: `{ "message": "Sikeres jelentkezés!", "jid": <az_uj_jelentkezo_id-ja>, "changes": 1 }`
  * `400 Bad Request`: `{ "message": "Hiányzó kötelező mezők (csid, jnev, email)." }`
  * `404 Not Found`: `{ "message": "Ebbe a csoportba nem lehet jelentkezni." }` (Ha a csoport nem létezik, vagy már elindult.)
  * `409 Conflict`: `{ "message": "Ezzel az e-mail címmel már jelentkeztek erre a csoportra." }`
  * `409 Conflict`: `{ "message": "A csoport megtelt, maximum 8 fő jelentkezhet." }`
  * `500 Internal Server Error`: `{ "message": "Adatbázis hiba történt a jelentkezés rögzítésekor." }` (Pl. hiányzó `NOT NULL` mezők, vagy egyéb DB hiba.)

### Admin API

Minden Admin API végpont JWT token authentikációt igényel (lásd: Authentikáció).

#### POST `/admin` (Bejelentkezés)

* **Leírás**: Adminisztrátor bejelentkeztetése.
* **Authentikáció**: Nem szükséges.
* **Request Body**: `application/json`

    ```json
    {
        "password": "az_admin_jelszo"
    }
    ```

* **Válasz**:
  * `200 OK`: `{ "token": "<jwt_token>", "message": "Sikeres bejelentkezés." }`
  * `401 Unauthorized`: `{ "message": "Hibás jelszó!" }`

#### GET `/admin/csoportok`

* **Leírás**: Az összes csoport adatainak lekérése, létszámmal, indulási dátum szerint csökkenő sorrendben.
* **Authentikáció**: JWT Token szükséges.
* **Válasz**:
  * `200 OK`: JSON tömb a csoportokkal (hasonló a `/public/csoportok` válaszához, de itt az összes csoport szerepel).

    ```json
    [
      {
        "csid": 5,
        "knev": "Junior fullstack fejlesztő",
        "indulas": "2025-09-10",
        "beosztas": "szombatonként 10-16 óráig",
        "ar": 490000,
        "letszam": 0 // vagy a valós létszám
      }
      // ...további csoportok
    ]
    ```

  * `401 Unauthorized`: `{ "message": "Azonosítás szükséges!" }`
  * `403 Forbidden`: `{ "message": "Nincs jogosultsága!" }`
  * `500 Internal Server Error`: `{ "message": "Adatbázis hiba történt." }`

#### POST `/admin/csoportok`

* **Leírás**: Új csoport hozzáadása.
* **Authentikáció**: JWT Token szükséges.
* **Request Body**: `application/json` (Minden mező kötelező)

    ```json
    {
        "kid": 1, // Létező képzés ID
        "indulas": "2025-10-01", // YYYY-MM-DD
        "beosztas": "kedd-csütörtök 18-21",
        "helyszin": "online",
        "ar": 350000
    }
    ```

* **Válasz**:
  * `201 Created`: `{ "message": "Csoport sikeresen hozzáadva!", "id": <az_uj_csoport_id-ja>, "changes": 1 }`
  * `400 Bad Request`: `{ "message": "Hiányzó kötelező mezők." }`
  * `400 Bad Request`: `{ "message": "Érvénytelen képzés azonosító (kid)." }` (Ha `kid` nem létezik)
  * `401 Unauthorized` / `403 Forbidden`
  * `500 Internal Server Error`: `{ "message": "Adatbázis hiba történt a csoport létrehozásakor." }`

#### GET `/admin/csoportok/:csid`

* **Leírás**: Egy adott csoport adatainak lekérése.
* **Authentikáció**: JWT Token szükséges.
* **Path Paraméter**: `csid` (integer) - A csoport azonosítója.
* **Válasz**:
  * `200 OK`:

    ```json
    {
        "kid": 1,
        "indulas": "2024-09-08",
        "beosztas": "szerda-péntek 17-20 óráig",
        "helyszin": "tanterem",
        "ar": 390000
    }
    ```

  * `404 Not Found`: `{ "message": "Csoport nem található." }`
  * `401 Unauthorized` / `403 Forbidden`
  * `500 Internal Server Error`: `{ "message": "Adatbázis hiba történt." }`

#### PUT `/admin/csoportok/:csid`

* **Leírás**: Egy meglévő csoport adatainak módosítása.
* **Authentikáció**: JWT Token szükséges.
* **Path Paraméter**: `csid` (integer) - A módosítandó csoport azonosítója.
* **Request Body**: `application/json` (Minden mező kötelező a módosításhoz)

    ```json
    {
        "kid": 2,
        "indulas": "2025-10-15",
        "beosztas": "kedd-csütörtök 18-21 (módosított)",
        "helyszin": "online (módosított)",
        "ar": 360000
    }
    ```

* **Válasz**:
  * `200 OK`: `{ "message": "Csoport sikeresen módosítva.", "changes": 1 }`
  * `400 Bad Request`: `{ "message": "Hiányzó kötelező mezők." }`
  * `400 Bad Request`: `{ "message": "Érvénytelen képzés azonosító (kid)." }` (Ha `kid` nem létezik)
  * `404 Not Found`: `{ "message": "Csoport nem található vagy nem történt módosítás." }`
  * `401 Unauthorized` / `403 Forbidden`
  * `500 Internal Server Error`: `{ "message": "Adatbázis hiba történt a csoport módosításakor." }`

#### DELETE `/admin/csoportok/:csid`

* **Leírás**: Egy csoport törlése.
* **Authentikáció**: JWT Token szükséges.
* **Path Paraméter**: `csid` (integer) - A törlendő csoport azonosítója.
* **Válasz**:
  * `200 OK`: `{ "message": "Csoport sikeresen törölve.", "changes": 1 }`
  * `400 Bad Request`: `{ "message": "A csoport nem törölhető, mert vannak hozzá rendelt jelentkezők." }`
  * `404 Not Found`: `{ "message": "Csoport nem található." }`
  * `401 Unauthorized` / `403 Forbidden`
  * `500 Internal Server Error`: `{ "message": "Adatbázis hiba történt a csoport törlésekor." }`

#### GET `/admin/lista/:csid`

* **Leírás**: Egy adott csoporthoz tartozó jelentkezők listájának lekérése, név (`jnev`) szerint rendezve.
* **Authentikáció**: JWT Token szükséges.
* **Path Paraméter**: `csid` (integer) - A csoport azonosítója.
* **Válasz**:
  * `200 OK`: JSON tömb a jelentkezőkkel. Ha nincsenek jelentkezők, üres tömb (`[]`).

    ```json
    [
      {
        "jid": 1,
        "jnev": "Kiss Gizella",
        "szulnev": "Kiss Gizella",
        "szulido": "2000-06-02",
        "szulhely": "Budapest",
        "anyjaneve": "Németh Gizella",
        "cim": "1011 Budapest, Vár u. 11.",
        "telefon": "36702996724",
        "email": "kissg@freemail.hu"
      }
      // ...további jelentkezők
    ]
    ```

  * `404 Not Found`: `{ "message": "A megadott csoport nem létezik." }`
  * `401 Unauthorized` / `403 Forbidden`
  * `500 Internal Server Error`: `{ "message": "Adatbázis hiba történt." }`

#### GET `/admin/jelentkezok/:jid`

* **Leírás**: Egy adott jelentkező összes adatának lekérése.
* **Authentikáció**: JWT Token szükséges.
* **Path Paraméter**: `jid` (integer) - A jelentkező azonosítója.
* **Válasz**:
  * `200 OK`:

    ```json
    {
        "jid": 1,
        "csid": 1,
        "jnev": "Kiss Gizella",
        "szulnev": "Kiss Gizella",
        "szulido": "2000-06-02",
        "szulhely": "Budapest",
        "anyjaneve": "Németh Gizella",
        "cim": "1011 Budapest, Vár u. 11.",
        "telefon": "36702996724",
        "email": "kissg@freemail.hu"
    }
    ```

  * `404 Not Found`: `{ "message": "Jelentkező nem található." }`
  * `401 Unauthorized` / `403 Forbidden`
  * `500 Internal Server Error`: `{ "message": "Adatbázis hiba történt." }`

#### PUT `/admin/jelentkezok/:jid`

* **Leírás**: Egy meglévő jelentkező adatainak módosítása.
* **Authentikáció**: JWT Token szükséges.
* **Path Paraméter**: `jid` (integer) - A módosítandó jelentkező azonosítója.
* **Request Body**: `application/json`

    ```json
    {
        "csid": 2, // Kötelező, létező csoport ID
        "jnev": "Kiss Gizella Módosított Név", // Kötelező
        "szulnev": "Kiss Gizella", // Opcionális, lehet null
        "szulido": "2000-06-02", // Kötelező
        "szulhely": "Budapest", // Kötelező
        "anyjaneve": "Németh Gizella", // Kötelező
        "cim": "1011 Budapest, Vár u. 11. Módosított Cím", // Kötelező
        "telefon": "36702996724", // Kötelező
        "email": "kissg.modositott@freemail.hu" // Kötelező
    }
    ```

  * **Kötelező mezők**: `csid`, `jnev`, `szulido`, `szulhely`, `anyjaneve`, `cim`, `telefon`, `email`.
* **Válasz**:
  * `200 OK`: `{ "message": "Jelentkező sikeresen módosítva.", "changes": 1 }`
  * `200 OK`: `{ "message": "Jelentkező adatai nem változtak.", "changes": 0 }` (Ha nem történt módosítás, de a jelentkező létezik)
  * `400 Bad Request`: `{ "message": "Hiányzó kötelező mezők (csid, jnev, szulido, szulhely, anyjaneve, cim, telefon, email)." }`
  * `400 Bad Request`: `{ "message": "A megadott csoport (csid) nem létezik." }` (Ha a `csid` nem valid)
  * `400 Bad Request`: `{ "message": "Érvénytelen csoport azonosító (csid)." }` (Ha `csid` FK constraint-et sért)
  * `404 Not Found`: `{ "message": "Jelentkező nem található." }` (Ha a `jid` nem létezik)
  * `401 Unauthorized` / `403 Forbidden`
  * `500 Internal Server Error`: `{ "message": "Adatbázis hiba történt a jelentkező módosításakor." }`

#### DELETE `/admin/jelentkezok/:jid`

* **Leírás**: Egy jelentkező törlése.
* **Authentikáció**: JWT Token szükséges.
* **Path Paraméter**: `jid` (integer) - A törlendő jelentkező azonosítója.
* **Válasz**:
  * `200 OK`: `{ "message": "Jelentkező sikeresen törölve.", "changes": 1 }`
  * `404 Not Found`: `{ "message": "Jelentkező nem található." }`
  * `401 Unauthorized` / `403 Forbidden`
  * `500 Internal Server Error`: `{ "message": "Adatbázis hiba történt a jelentkező törlésekor." }`

## 6. Tesztelés

Az API végpontok teszteléséhez `.http` fájlok állnak rendelkezésre, amelyeket a Visual Studio Code REST Client kiegészítőjével lehet futtatni.

### Előfeltételek a teszteléshez

1. **Futó backend szerver**: Az `app.js` alkalmazásnak futnia kell (pl. `node app.js`), és elérhetőnek kell lennie a `http://localhost:5000` címen.
2. **Inicializált adatbázis**: A `tanfolyamok.db` adatbázisnak léteznie kell, és a `tesztadatok.sql` fájlban lévő adatokkal feltöltve kell lennie. Ha az adatbázis üres vagy hiányzik, az alkalmazás indításkor létrehozza a sémát, de a tesztadatokat manuálisan kell betölteni:

    ```bash
    sqlite3 tanfolyamok.db < tesztadatok.sql
    ```

3. **Konfigurált `.env` fájl**: Az adminisztrátori API teszteléséhez a `.env` fájlnak tartalmaznia kell a `ADMIN` (bcrypt hash) és `TOKEN_SECRET` változókat. A `tesztadatok.sql` és az `admin_api.http` fájlban az alapértelmezett admin jelszó `TanfAdmin!2025`. Ennek a hash-elt változatának kell szerepelnie az `ADMIN` változóban.

### Tesztfájlok

* `public_api.http`: A publikus API végpontjainak teszteseteit tartalmazza.
* `admin_api.http`: Az adminisztrációs API végpontjainak teszteseteit tartalmazza.

### Tesztek futtatása

1. Telepítse a REST Client kiterjesztést a VS Code-ban (ha szükséges).
2. Nyissa meg a `public_api.http` vagy `admin_api.http` fájlt.
3. Minden kérés felett megjelenik egy "Send Request" link. Kattintson erre a linkre a kérés elküldéséhez.
4. A válasz egy új ablakban vagy panelen jelenik meg.

### Tesztesetek felépítése

Minden teszteset a `.http` fájlokban a következőképpen van strukturálva:

* Egy vagy több sor komment (`#`), amely leírja a teszt célját és az elvárt eredményt.
* A HTTP kérés (pl. `GET {{baseUrl}}/public/csoportok`).
* Szükség esetén fejlécek (pl. `Content-Type: application/json`, `Authorization: Bearer {{authToken}}`).
* Szükség esetén request body (JSON formátumban).
* A `###` szeparátor választja el az egyes kéréseket.
* Az `admin_api.http` fájl változókat használ (`@baseUrl`, `@authToken`, `@ujCsoportId`) a kérések dinamikusabbá tételéhez és az értékek átadásához a tesztek között. Az `@authToken` például az admin bejelentkezési kérés válaszából kerül kinyerésre.

A tesztek sorrendje fontos, különösen az `admin_api.http` fájlban, ahol egy későbbi teszt egy korábbi teszt által létrehozott erőforráson (pl. új csoport) végezhet műveleteket. Javasolt a teszteket a fájlban megadott sorrendben futtatni, különösen az első alkalommal vagy az adatbázis frissítése után.
