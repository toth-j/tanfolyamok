# Tanfolyamok

## Vizsgaremek (2025. május)

Iskolánk esti és hétvégi informatikai képzéseket szervez, amelyek tantermi és online csoportokban, különböző időpontokban indulnak.

A feladat olyan reszponzív webes alkalmazás elkészítése, amelyen a látogatók tájékozódhatnak a képzésekről és az induló csoportokról, és online jelentkezhetnek is ezekre.

Az adatokat egy adatbázisban kell tárolni, amelyet egy API-n keresztül lehet elérni. Az elkészített alkalmazás erről az API-ról tölti le és jeleníti meg az adatokat.

Ezen kívül kell egy felület, ahol az iskola dolgozója kezelheti a csoportok és a jelentkezők adatait.  

## Telepítés és futtatás

### Szükséges szoftverek

* Node.js (LTS verzió ajánlott)
* npm (Node.js-sel együtt települ)

### Konfiguráció

1. Klónozd a projekt repository-t.

2. Navigálj a projekt gyökérkönyvtárába.

3. Hozz létre egy `.env` fájlt a gyökérkönyvtárban a következő tartalommal (Az `ADMIN` értékét cseréld le a jelszó hash-re, a `TOKEN_SECRET` értékét pedig egytitkos kulcsra):
   
   ```env
   ADMIN="bcrypt_hash_az_admin_jelszohoz"
   TOKEN_SECRET="nagyon_titkos_kulcs_a_jwt_tokenhez"
   ```

4. Telepítsd a függőségeket: `npm install`

### Indítás

* A szerver indítása: `npm start` vagy `node server.js`
* Az alkalmazás elérhető lesz a [http://localhost:5000]() címen).

## Dokumentáció

* A specifikáció, valamint a frontend és a backend dokumentációja a [docs mappában](docs) található.

## Tesztelés

* A manuális teszteket a [tests mappában](tests) találod.
