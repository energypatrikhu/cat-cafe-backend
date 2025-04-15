-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Gép: db-dev
-- Létrehozás ideje: 2025. Ápr 15. 20:00
-- Kiszolgáló verziója: 11.7.2-MariaDB-ubu2404
-- PHP verzió: 8.2.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `cat-cafe-webshop`
--
CREATE DATABASE IF NOT EXISTS `cat-cafe-webshop` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `cat-cafe-webshop`;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `Product`
--

CREATE TABLE `Product` (
  `id` int(11) NOT NULL,
  `name` varchar(191) NOT NULL,
  `description` varchar(191) NOT NULL,
  `price` double NOT NULL,
  `image` varchar(191) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- A tábla adatainak kiíratása `Product`
--

INSERT INTO `Product` (`id`, `name`, `description`, `price`, `image`, `quantity`) VALUES
(1, 'Electronic Bronze Ball', 'Featuring Lawrencium-enhanced technology, our Hat offers unparalleled immense performance', 851.93, 'a5ba8d9a-e408-48bd-b4d4-019c513331c1.webp', 27),
(2, 'Ergonomic Wooden Gloves', 'Jacobson, Emmerich and Miller\'s most advanced Pizza technology increases skeletal capabilities', 946.79, '5ec20d09-838b-4b6b-9508-75a626a5d859.webp', 61),
(3, 'Sleek Cotton Shoes', 'The AI-driven explicit archive Bacon offers reliable performance and intent design', 725.9, '4c7ff9a5-7231-4df5-8d58-189324a0ca62.webp', 41),
(4, 'Fantastic Wooden Chicken', 'Innovative Table featuring honored technology and Bronze construction', 153.95, '1f38a01c-553e-4afa-a3c0-cffa99c79afe.webp', 59),
(5, 'Gorgeous Plastic Pizza', 'Our fluffy-inspired Pants brings a taste of luxury to your frank lifestyle', 843.09, 'dabfb725-6c31-4a3a-8a50-36bc5635b6e9.webp', 54),
(6, 'Awesome Plastic Soap', 'Savor the fluffy essence in our Gloves, designed for important culinary adventures', 563.55, '08bc280a-af86-4858-8efb-b7ca14e825ed.webp', 78),
(7, 'Electronic Cotton Table', 'Discover the turtle-like agility of our Sausages, perfect for difficult users', 272.39, '5d49edc0-ff5f-4a74-bc14-57351ff73769.webp', 68),
(8, 'Handmade Cotton Soap', 'Featuring Moscovium-enhanced technology, our Ball offers unparalleled rosy performance', 689.85, 'afcc27fb-5da9-460f-9b9e-fa19613dd636.webp', 34),
(9, 'Luxurious Silk Hat', 'Professional-grade Chicken perfect for flustered training and recreational use', 521.95, 'bdede6b5-0c83-428e-8d03-1bd3895f08eb.webp', 17),
(10, 'Soft Steel Mouse', 'Discover the flamingo-like agility of our Soap, perfect for humiliating users', 157.65, '1787b16c-7c59-48cd-8365-e76d16221f4f.webp', 79);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `Reservation`
--

CREATE TABLE `Reservation` (
  `id` int(11) NOT NULL,
  `date` datetime(3) NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `userId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- A tábla adatainak kiíratása `Reservation`
--

INSERT INTO `Reservation` (`id`, `date`, `active`, `userId`) VALUES
(1, '2025-10-29 09:46:29.568', 1, 5),
(2, '2026-02-06 15:48:22.623', 1, 2),
(3, '2025-07-13 19:40:57.225', 1, 9),
(4, '2025-11-17 17:35:52.010', 1, 5),
(5, '2025-11-14 04:32:57.608', 1, 4),
(6, '2025-07-17 15:40:03.317', 1, 12),
(7, '2025-09-03 06:26:13.972', 1, 5),
(8, '2025-08-12 21:47:36.179', 1, 12),
(9, '2025-12-31 11:51:11.109', 1, 2),
(10, '2025-12-30 12:19:24.927', 1, 8);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `Token`
--

CREATE TABLE `Token` (
  `id` int(11) NOT NULL,
  `token` varchar(191) NOT NULL,
  `userId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `User`
--

CREATE TABLE `User` (
  `id` int(11) NOT NULL,
  `name` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `password` varchar(191) NOT NULL,
  `role` enum('USER','WORKER') NOT NULL DEFAULT 'USER'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- A tábla adatainak kiíratása `User`
--

INSERT INTO `User` (`id`, `name`, `email`, `password`, `role`) VALUES
(1, 'Worker Pista', 'worker@cat-cafe.hu', '$argon2id$v=19$m=65536,t=3,p=4$J0CSs7gZx5RGHQ44PpJyPw$nVd1169BgrXCphcmuMce0oDmweSEiS//hL8JvKP4C3M', 'WORKER'),
(2, 'User Pista', 'user@cat-cafe.hu', '$argon2id$v=19$m=65536,t=3,p=4$swdXteSXo5dVNwdF7EE8fQ$nllwGkGW0pqAicSlg2N9l25s/vCi5B5DRmx6l9U0W6c', 'USER'),
(3, 'Catherine Hilll', 'Lon.Denesik97@yahoo.com', '$argon2id$v=19$m=65536,t=3,p=4$Vt1D2La+DTwtJwmjfzChvw$AJ4FWb7vWPh3hEBYXFx7Yv72y3wamJwfeaAcF/DQvXI', 'USER'),
(4, 'Roberta Pfannerstill', 'Luna29@yahoo.com', '$argon2id$v=19$m=65536,t=3,p=4$HzgPqd0M4zMoyFPBo9G0Sg$e0r/qlobDweDpl6w1XMJhx8yUX5WMw4rk2wN5NFAWTE', 'USER'),
(5, 'Gary Nolan', 'Daryl_Ward@gmail.com', '$argon2id$v=19$m=65536,t=3,p=4$LHD35pSnIpqkSeERL+lZYw$6y0XJWgb7VB+QTelMJ3J2NWkvvjBoVJBOFBTEMlF73c', 'USER'),
(6, 'Deanna Gibson', 'Brionna_Blanda82@hotmail.com', '$argon2id$v=19$m=65536,t=3,p=4$O/Lou9QaybqN5Ja/js3jzA$/3fCFEmNopwdET4ibUPhPa2MbULF8aRVt6c68AuM1yg', 'USER'),
(7, 'Mr. Troy Kuhic', 'Mikel79@yahoo.com', '$argon2id$v=19$m=65536,t=3,p=4$FFKpS7wom/5rZMI4/FmWBA$a1G1zNImXd2EjpZ1bmf3gqaaxiAOnBkGnpORZvOdjCg', 'USER'),
(8, 'Roy Kemmer', 'Aaliyah81@yahoo.com', '$argon2id$v=19$m=65536,t=3,p=4$01XC1bCyqaZ2JrCwvDlntA$IF58xUEdWJWXt18MYfHlrY4GLSeAu4SXB4vjLh7wAmY', 'USER'),
(9, 'Randolph Connelly', 'Mekhi.Goyette-Ledner@gmail.com', '$argon2id$v=19$m=65536,t=3,p=4$p71gF+yipcufBcE1DPCa5w$JRq6QWpEXbSV+tUVsqxfBtbMB2lrrg2ic+tC4kej6FQ', 'USER'),
(10, 'Ira Ryan', 'Maiya.Stamm@gmail.com', '$argon2id$v=19$m=65536,t=3,p=4$HOfWajFTc2bCsoUIQjDORA$aQhxnq6ykJKlWaqyUs2HEs3eEDOzo/ptf3vzqsR+ERc', 'USER'),
(11, 'Phillip Volkman', 'Mozelle28@yahoo.com', '$argon2id$v=19$m=65536,t=3,p=4$REpbVKAJ3q4yeXRfZ8Fp9w$Yv7ZV0/gP7jdnJz28/k032sDzQ9a8HTW3TCQDVT7AoA', 'USER'),
(12, 'Geraldine Mayer', 'Scotty.Jones@hotmail.com', '$argon2id$v=19$m=65536,t=3,p=4$gvUOAJe66ed8G/+kdQ/N1A$Xhpkz9CsrstXyDSj2hNXRiWvQtTNcRXEyvgCO9+tUNc', 'USER');

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `Product`
--
ALTER TABLE `Product`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Product_name_key` (`name`);

--
-- A tábla indexei `Reservation`
--
ALTER TABLE `Reservation`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Reservation_userId_fkey` (`userId`);

--
-- A tábla indexei `Token`
--
ALTER TABLE `Token`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Token_token_key` (`token`),
  ADD KEY `Token_userId_fkey` (`userId`);

--
-- A tábla indexei `User`
--
ALTER TABLE `User`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `User_email_key` (`email`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `Product`
--
ALTER TABLE `Product`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT a táblához `Reservation`
--
ALTER TABLE `Reservation`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT a táblához `Token`
--
ALTER TABLE `Token`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `User`
--
ALTER TABLE `User`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `Reservation`
--
ALTER TABLE `Reservation`
  ADD CONSTRAINT `Reservation_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Megkötések a táblához `Token`
--
ALTER TABLE `Token`
  ADD CONSTRAINT `Token_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
