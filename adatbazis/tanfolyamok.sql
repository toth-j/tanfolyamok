-- phpMyAdmin SQL Dump
-- version 4.9.0.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2021. Dec 28. 10:13
-- Kiszolgáló verziója: 10.4.6-MariaDB
-- PHP verzió: 7.3.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `tanf-szervezes`
--
CREATE DATABASE IF NOT EXISTS tanfolyamok;
USE tanfolyamok;

-- --------------------------------------------------------
--
-- Tábla szerkezet ehhez a táblához `kepzesek`
--

CREATE TABLE `kepzesek` (
  `kid` int(11) NOT NULL,
  `knev` varchar(60) COLLATE utf8mb4_hungarian_ci NOT NULL,
  `oraszam` int(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;


--
-- Tábla szerkezet ehhez a táblához `csoportok`
--

CREATE TABLE `csoportok` (
  `csid` int(11) NOT NULL,
  `kid` int(11) NOT NULL,
  `indulas` date NOT NULL,
  `beosztas` varchar(60) COLLATE utf8mb4_hungarian_ci NOT NULL,
  `helyszin` varchar(30) COLLATE utf8mb4_hungarian_ci NOT NULL,
  `ar` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;


--
-- Tábla szerkezet ehhez a táblához `jelentkezok`
--

CREATE TABLE `jelentkezok` (
  `jid` int(11) NOT NULL,
  `csid` int(11) NOT NULL,
  `jnev` varchar(60) COLLATE utf8mb4_hungarian_ci NOT NULL,
  `szulnev` varchar(60) COLLATE utf8mb4_hungarian_ci DEFAULT NULL,
  `szulido` date NOT NULL,
  `szulhely` varchar(60) COLLATE utf8mb4_hungarian_ci NOT NULL,
  `anyjaneve` varchar(60) COLLATE utf8mb4_hungarian_ci NOT NULL,
  `cim` varchar(80) COLLATE utf8mb4_hungarian_ci NOT NULL,
  `telefon` varchar(15) COLLATE utf8mb4_hungarian_ci NOT NULL,
  `email` varchar(50) COLLATE utf8mb4_hungarian_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;


-- --------------------------------------------------------
--
-- A tábla indexei `kepzesek`
--
ALTER TABLE `kepzesek`
  ADD PRIMARY KEY (`kid`);


--
-- A tábla indexei `csoportok`
--
ALTER TABLE `csoportok`
  ADD PRIMARY KEY (`csid`),
  ADD KEY `kid` (`kid`);

--
-- A tábla indexei `jelentkezok`
--
ALTER TABLE `jelentkezok`
  ADD PRIMARY KEY (`jid`),
  ADD KEY `csid` (`csid`);

--
-- AUTO_INCREMENT a táblához `kepzesek`
--
ALTER TABLE `kepzesek`
  MODIFY `kid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `csoportok`
--
ALTER TABLE `csoportok`
  MODIFY `csid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `jelentkezok`
--
ALTER TABLE `jelentkezok`
  MODIFY `jid` int(11) NOT NULL AUTO_INCREMENT;

--
-- Megkötések a táblához `csoportok`
--
ALTER TABLE `csoportok`
  ADD CONSTRAINT `csoportok_ibfk_1` FOREIGN KEY (`kid`) REFERENCES `kepzesek` (`kid`);

--
-- Megkötések a táblához `jelentkezok`
--
ALTER TABLE `jelentkezok`
  ADD CONSTRAINT `jelentkezok_ibfk_1` FOREIGN KEY (`csid`) REFERENCES `csoportok` (`csid`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
