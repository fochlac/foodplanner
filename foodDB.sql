-- MySQL dump 10.16  Distrib 10.2.11-MariaDB, for Linux (x86_64)
--
-- Host: localhost    Database: food
-- ------------------------------------------------------
-- Server version	10.2.11-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `authentication`
--

DROP TABLE IF EXISTS `authentication`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `authentication` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user` int(11) NOT NULL,
  `hash` varchar(150) DEFAULT NULL,
  `salt` varchar(150) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user` (`user`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `authentication`
--

LOCK TABLES `authentication` WRITE;
/*!40000 ALTER TABLE `authentication` DISABLE KEYS */;
INSERT INTO `authentication` VALUES (1,10,'HkdwXCO32vzgpviOTiLjHp5+svPUJO8tqFQYAybrD7A=','Nr6YITzrMoYi1CVbtV1QZQ=='),(2,11,'sWA0hrjUmXoN5AO9xbQg/niWbcwVLE88jWYTEQ411qw=','jDlbFXALjCTINGonjOH5pA=='),(3,16,NULL,NULL),(4,17,'19f3PWDUc9zT5mEkymejMiZ9KZzWJNyr3hBp9QHgeOM=','3OkwMsbO45qJx+fRyca9bQ=='),(5,19,NULL,NULL),(6,21,NULL,NULL),(7,22,'0oGP6UUCy7x7vpWzcWulMfrrFtbI/JWw/rFNzZmBsIc=','6iVjZoCWMF3+4CJK+xu1ug=='),(8,23,NULL,NULL),(9,24,NULL,NULL),(10,25,NULL,NULL),(11,26,NULL,NULL),(12,27,NULL,NULL),(13,28,NULL,NULL),(14,29,NULL,NULL),(15,30,NULL,NULL),(16,34,NULL,NULL),(17,35,'aJhedRv4JFNKBzUS9+1miRDKjRB27U/UPDyYW7khtKc=','X94OUL75a4wtdPZW3qcfyw=='),(18,37,NULL,NULL),(19,47,NULL,NULL),(20,48,NULL,NULL),(21,49,'Dwg4KQkM1j2gWs4G4wfXHaCRpQHxZYF58DnBtgklnXI=','FYFi2oNNJRPhARJOX/L4gg=='),(32,52,'W0SEphYCCB4FQNoyB/TcT6FPVyvFIj5Q/MFNwawW3lw=','gYkitCqDOFFXLkV7GDvkzw=='),(33,54,'ROVxHVTBUr/sOcZc3jpxpqBbFFcVRTWNL6u19XxRIj8=','cClYAflfTf2SJlyBstUeTQ=='),(34,55,NULL,NULL),(35,56,'GEqQTwyhf9IPyozMaiq+YOZkTrX3htwin9XTcTydmBc=','jepQgbFFu4RjhRqTHrdIZw==');
/*!40000 ALTER TABLE `authentication` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `datefinder`
--

DROP TABLE IF EXISTS `datefinder`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `datefinder` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `creator` int(11) NOT NULL,
  `deadline` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `datefinder`
--

LOCK TABLES `datefinder` WRITE;
/*!40000 ALTER TABLE `datefinder` DISABLE KEYS */;
INSERT INTO `datefinder` VALUES (1,10,1520960400000),(2,10,1523358000000);
/*!40000 ALTER TABLE `datefinder` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `datefinder_dates`
--

DROP TABLE IF EXISTS `datefinder_dates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `datefinder_dates` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `datefinder` int(11) NOT NULL,
  `time` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `date` (`datefinder`,`time`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `datefinder_dates`
--

LOCK TABLES `datefinder_dates` WRITE;
/*!40000 ALTER TABLE `datefinder_dates` DISABLE KEYS */;
INSERT INTO `datefinder_dates` VALUES (3,1,1520958600000),(4,1,1521045000000),(5,1,1521131400000),(9,1,1521477000000),(10,2,1522767600000),(11,2,1522854000000),(12,2,1522940400000),(13,2,1523286000000),(14,2,1523372400000),(15,2,1523458800000),(16,2,1523545200000),(17,2,1523890800000),(18,2,1523977200000),(19,2,1524063600000),(20,2,1524150000000);
/*!40000 ALTER TABLE `datefinder_dates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `datefinder_participants`
--

DROP TABLE IF EXISTS `datefinder_participants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `datefinder_participants` (
  `user` int(11) NOT NULL,
  `datefinder` int(11) NOT NULL,
  UNIQUE KEY `user` (`user`,`datefinder`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `datefinder_participants`
--

LOCK TABLES `datefinder_participants` WRITE;
/*!40000 ALTER TABLE `datefinder_participants` DISABLE KEYS */;
INSERT INTO `datefinder_participants` VALUES (10,1),(10,2),(48,1),(49,1),(56,1);
/*!40000 ALTER TABLE `datefinder_participants` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `datefinder_signups`
--

DROP TABLE IF EXISTS `datefinder_signups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `datefinder_signups` (
  `user` int(11) NOT NULL,
  `date` int(11) NOT NULL,
  UNIQUE KEY `user` (`user`,`date`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `datefinder_signups`
--

LOCK TABLES `datefinder_signups` WRITE;
/*!40000 ALTER TABLE `datefinder_signups` DISABLE KEYS */;
INSERT INTO `datefinder_signups` VALUES (10,1),(10,2),(10,3),(10,4),(10,5),(10,6),(10,7),(10,8),(10,9),(10,10),(10,11),(10,12),(10,13),(10,14),(10,15),(10,16),(10,17),(10,18),(10,19),(10,20),(48,8),(49,4),(49,5),(56,3),(56,6),(56,7),(56,8);
/*!40000 ALTER TABLE `datefinder_signups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mailingList`
--

DROP TABLE IF EXISTS `mailingList`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `mailingList` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  `mail` varchar(150) NOT NULL,
  `deadlineReminder` int(11) DEFAULT 0,
  `creationNotice` int(11) DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `mail` (`mail`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mailingList`
--

LOCK TABLES `mailingList` WRITE;
/*!40000 ALTER TABLE `mailingList` DISABLE KEYS */;
INSERT INTO `mailingList` VALUES (10,'Florian R.','f.riedel@epages.com',0,1),(11,'Friedrich G.','f.gehring@epages.com',1,1),(16,'Nico Lachmann','n.lachmann@epages.com',0,1),(17,'Regine','r.schmidt@epages.com',1,1),(19,'Marcel J.','m.jaeger@epages.com',1,1),(20,'Florian R.','fochlac@gmail.com',0,1),(21,'Timo H.','t.haapakoski@epages.com',1,0),(22,'Heiko A.','h.ahnert@epages.com',0,0),(23,'Michael S.','m.schroeck@epages.com',1,1),(24,'Michael H.','m.hoehn@epages.com',1,1),(25,'Fouad N.','nabhan@epages.com',1,1),(26,'Peter D.','p.domin@epages.com',1,1),(27,'Karsten','k.peskova@epages.com',0,1),(28,'AG','ag17@gmx.de',1,1),(29,'Robin G.','r.gessner@epages.com',1,1),(30,'Theresa Gessner','theresa.gessner90@gmail.com',0,1),(31,'Markus H.','m.hoellein@epages.com',1,1),(34,'Andreas H.','aheidrich@epages.com',1,1),(35,'Maik Z.','m.zeyen@epages.com',1,1);
/*!40000 ALTER TABLE `mailingList` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mealOptionValues`
--

DROP TABLE IF EXISTS `mealOptionValues`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `mealOptionValues` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `mealId` int(11) NOT NULL,
  `mealOptionId` int(11) NOT NULL,
  `name` varchar(150) NOT NULL,
  `price` float(10,2) NOT NULL DEFAULT 0.00,
  PRIMARY KEY (`id`),
  UNIQUE KEY `mealOptionId` (`mealOptionId`,`name`)
) ENGINE=InnoDB AUTO_INCREMENT=187 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mealOptionValues`
--

LOCK TABLES `mealOptionValues` WRITE;
/*!40000 ALTER TABLE `mealOptionValues` DISABLE KEYS */;
INSERT INTO `mealOptionValues` VALUES (9,72,4,'Rind',0.00),(10,72,4,'Schwein',0.00),(11,72,5,'Doppel',0.00),(12,72,5,'Kürbiskern',0.00),(13,72,5,'Mohn',0.00),(14,72,5,'Normal',0.00),(15,72,5,'Roggen',0.00),(16,72,5,'Weltmeister',0.00),(17,73,7,'Baguette',0.00),(18,73,7,'Mischbrot',0.00),(19,77,8,'Rind',5.00),(20,77,8,'Schwein',3.00),(21,77,9,'Doppel',0.00),(22,77,9,'Kürbiskern',0.00),(23,77,9,'Mohn',0.00),(24,77,9,'Normal',0.00),(25,77,9,'Roggen',0.00),(26,77,9,'Weltmeister',0.00),(27,79,11,'Rind',5.00),(28,79,11,'Schwein',3.00),(29,79,12,'Doppel',0.00),(30,79,12,'Kürbiskern',0.00),(31,79,12,'Mohn',0.00),(32,79,12,'Normal',0.00),(33,79,12,'Roggen',0.00),(34,79,12,'Weltmeister',0.00),(35,83,14,'Rind',5.00),(36,83,14,'Schwein',3.00),(37,83,15,'Doppel',0.00),(38,83,15,'Kürbiskern',0.00),(39,83,15,'Mohn',0.00),(40,83,15,'Normal',0.00),(41,83,15,'Roggen',0.00),(42,83,15,'Weltmeister',0.00),(43,84,17,'Rind',5.00),(44,84,17,'Schwein',3.00),(45,84,18,'Doppel',0.00),(46,84,18,'Kürbiskern',0.00),(47,84,18,'Mohn',0.00),(48,84,18,'Normal',0.00),(49,84,18,'Roggen',0.00),(50,84,18,'Weltmeister',0.00),(51,87,20,'Rind',5.00),(52,87,20,'Schwein',3.00),(53,87,21,'Doppel',0.00),(54,87,21,'Kürbiskern',0.00),(55,87,21,'Mohn',0.00),(56,87,21,'Normal',0.00),(57,87,21,'Roggen',0.00),(58,87,21,'Weltmeister',0.00),(59,90,23,'Rind',5.00),(60,90,23,'Schwein',3.00),(61,90,24,'Doppel',0.00),(62,90,24,'Kürbiskern',0.00),(63,90,24,'Mohn',0.00),(64,90,24,'Normal',0.00),(65,90,24,'Roggen',0.00),(66,90,24,'Weltmeister',0.00),(67,93,26,'Burgerbrötchen',0.00),(68,93,26,'Roggenbrötchen',0.00),(93,96,36,'Rind',5.00),(94,96,36,'Schwein',3.00),(95,96,37,'Doppel',0.00),(96,96,37,'Kürbiskern',0.00),(97,96,37,'Mohn',0.00),(98,96,37,'Normal',0.00),(99,96,37,'Roggen',0.00),(100,96,37,'Weltmeister',0.00),(101,99,39,'Rind',5.00),(102,99,39,'Schwein',3.00),(103,99,40,'Doppel',0.00),(104,99,40,'Kürbiskern',0.00),(105,99,40,'Mohn',0.00),(106,99,40,'Normal',0.00),(107,99,40,'Roggen',0.00),(108,99,40,'Weltmeister',0.00),(109,101,42,'Burgerbrötchen',0.00),(110,101,42,'Roggenbrötchen',0.00),(119,105,46,'Rind',5.00),(120,105,46,'Schwein',3.00),(121,105,47,'Doppel',0.00),(122,105,47,'Kürbiskern',0.00),(123,105,47,'Mohn',0.00),(124,105,47,'Normal',0.00),(125,105,47,'Roggen',0.00),(126,105,47,'Weltmeister',0.00),(127,107,49,'Burgerbrötchen',0.00),(128,107,49,'Roggenbrötchen',0.00),(129,109,50,'Rind',5.00),(130,109,50,'Schwein',3.00),(131,109,51,'Doppel',0.00),(132,109,51,'Kürbiskern',0.00),(133,109,51,'Mohn',0.00),(134,109,51,'Normal',0.00),(135,109,51,'Roggen',0.00),(136,109,51,'Weltmeister',0.00),(145,113,56,'Rind',5.00),(146,113,56,'Schwein',3.00),(147,113,57,'Doppel',0.00),(148,113,57,'Kürbiskern',0.00),(149,113,57,'Mohn',0.00),(150,113,57,'Normal',0.00),(151,113,57,'Roggen',0.00),(152,113,57,'Weltmeister',0.00),(153,114,59,'Burgerbrötchen',0.00),(154,114,59,'Roggenbrötchen',0.00),(163,117,63,'Rind',5.00),(164,117,63,'Schwein',3.00),(165,117,64,'Doppel',0.00),(166,117,64,'Kürbiskern',0.00),(167,117,64,'Mohn',0.00),(168,117,64,'Normal',0.00),(169,117,64,'Roggen',0.00),(170,117,64,'Weltmeister',0.00),(171,119,66,'Rind',5.00),(172,119,66,'Schwein',3.00),(173,119,67,'Doppel',0.00),(174,119,67,'Kürbiskern',0.00),(175,119,67,'Mohn',0.00),(176,119,67,'Normal',0.00),(177,119,67,'Roggen',0.00),(178,119,67,'Weltmeister',0.00),(179,125,69,'Rind',5.00),(180,125,69,'Schwein',3.00),(181,125,70,'Doppel',0.00),(182,125,70,'Kürbiskern',0.00),(183,125,70,'Mohn',0.00),(184,125,70,'Normal',0.00),(185,125,70,'Roggen',0.00),(186,125,70,'Weltmeister',0.00);
/*!40000 ALTER TABLE `mealOptionValues` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mealOptions`
--

DROP TABLE IF EXISTS `mealOptions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `mealOptions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `mealId` int(11) NOT NULL,
  `name` varchar(150) NOT NULL,
  `type` varchar(150) NOT NULL,
  `price` float(10,2) NOT NULL DEFAULT 0.00,
  PRIMARY KEY (`id`),
  UNIQUE KEY `mealId` (`mealId`,`name`)
) ENGINE=InnoDB AUTO_INCREMENT=72 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mealOptions`
--

LOCK TABLES `mealOptions` WRITE;
/*!40000 ALTER TABLE `mealOptions` DISABLE KEYS */;
INSERT INTO `mealOptions` VALUES (4,72,'Hackfleisch','select',0.00),(5,72,'Brötchen','count',0.00),(6,72,'Zwiebel','toggle',0.00),(7,73,'Brotsorte','select',0.00),(8,77,'Hackfleisch','select',0.00),(9,77,'Brötchen','count',0.00),(10,77,'Zwiebel','toggle',0.00),(11,79,'Hackfleisch','select',0.00),(12,79,'Brötchen','count',0.00),(13,79,'Zwiebel','toggle',0.00),(14,83,'Hackfleisch','select',0.00),(15,83,'Brötchen','count',0.00),(16,83,'Zwiebel','toggle',0.00),(17,84,'Hackfleisch','select',0.00),(18,84,'Brötchen','count',0.00),(19,84,'Zwiebel','toggle',0.00),(20,87,'Hackfleisch','select',0.00),(21,87,'Brötchen','count',0.00),(22,87,'Zwiebel','toggle',0.00),(23,90,'Hackfleisch','select',0.00),(24,90,'Brötchen','count',0.00),(25,90,'Zwiebel','toggle',0.00),(26,93,'Brötchen','select',0.00),(36,96,'Hackfleisch','select',0.00),(37,96,'Brötchen','count',0.00),(38,96,'Zwiebel','toggle',0.00),(39,99,'Hackfleisch','select',0.00),(40,99,'Brötchen','count',0.00),(41,99,'Zwiebel','toggle',0.00),(42,101,'Brötchen','select',0.00),(46,105,'Hackfleisch','select',0.00),(47,105,'Brötchen','count',0.00),(48,105,'Zwiebel','toggle',0.00),(49,107,'Brötchen','select',0.00),(50,109,'Hackfleisch','select',0.00),(51,109,'Brötchen','count',0.00),(52,109,'Zwiebel','toggle',0.00),(56,113,'Hackfleisch','select',0.00),(57,113,'Brötchen','count',0.00),(58,113,'Zwiebel','toggle',0.00),(59,114,'Brötchen','select',0.00),(63,117,'Hackfleisch','select',0.00),(64,117,'Brötchen','count',0.00),(65,117,'Zwiebel','toggle',0.00),(66,119,'Hackfleisch','select',0.00),(67,119,'Brötchen','count',0.00),(68,119,'Zwiebel','toggle',0.00),(69,125,'Hackfleisch','select',0.00),(70,125,'Brötchen','count',0.00),(71,125,'Zwiebel','toggle',0.00);
/*!40000 ALTER TABLE `mealOptions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `meals`
--

DROP TABLE IF EXISTS `meals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `meals` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  `description` text DEFAULT NULL,
  `creator` varchar(150) NOT NULL,
  `time` bigint(20) NOT NULL,
  `deadline` bigint(20) NOT NULL,
  `signupLimit` int(11) DEFAULT NULL,
  `image` varchar(150) DEFAULT NULL,
  `creatorId` int(11) NOT NULL,
  `price` float(10,2) NOT NULL DEFAULT 0.00,
  `locked` int(11) DEFAULT 0,
  `datefinder` int(11) DEFAULT 0,
  `datefinderLocked` int(11) DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=126 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `meals`
--

LOCK TABLES `meals` WRITE;
/*!40000 ALTER TABLE `meals` DISABLE KEYS */;
INSERT INTO `meals` VALUES (14,'Spirelli Bolognese','Spirelli mit Bolognesesauce und Käse','Florian R.',1511262000000,1511262000000,0,'/static/images/meals/meal_14.jpg',10,0.00,0,0,0),(35,'Chilli con Carne','mit Baguette','Florian R.',1511434800000,1511366400000,14,'/static/images/meals/meal_35.jpg',10,0.00,0,0,0),(61,'Mettwoch','Wie immer ','Florian R.',1511348400000,1511348400000,0,'/static/images/meals/meal_61.jpg',10,0.00,0,0,0),(70,'Gemischter Salat','Gemischter Salat (Eisbergsalat, Tomate, Gurke, Paprika, Feta, Mais) mit Baguette und Kräuterbutter.','Florian R.',1511778600000,1511775000000,0,'/static/images/meals/meal_70.jpg',10,0.00,0,0,0),(71,'Rindfleischburger','Rindfleischburger mit 300 g Fleisch pro Person','AG',1511521200000,1511431200000,6,'/static/images/meals/meal_71.jpg',10,0.00,0,0,0),(72,'Mettwoch','Wie immer, diesmal leider keine Zwiebel aus Rücksicht auf das Treffen mit Datev.','Florian R.',1511951400000,1511942400000,0,'/static/images/meals/meal_72.jpg',10,0.00,0,0,0),(73,'Linsensuppe mit Bockwurst','Linsensuppe mit Bockwurst und Brot','Florian R.',1511865000964,1511861400964,0,'/static/images/meals/meal_73.jpg',10,0.00,0,0,0),(74,'Haare schön machen für die Weihnachtsfeier','Männer 10 Euro\r\nFrauen auf Anfrage','Robin',1512475200000,1512475200000,0,'/static/images/meals/meal_74.jpg',29,0.00,0,0,0),(75,'Gemischter Salat','Gemischter Salat (Eisbergsalat, Tomate, Gurke, Paprika, Feta, Mais) mit Baguette und Kräuterbutter.','Florian R.',1512379800000,1512379800000,0,'/static/images/meals/meal_75.jpg',10,0.00,0,0,0),(76,'Spirelli mit Bolognese','','Florian R.',1512469800964,1512466200000,0,'/static/images/meals/meal_76.JPG',10,2.50,1,0,0),(77,'Mettwoch','Wie immer','Florian R.',1512556200000,1512547200000,0,'/static/images/meals/meal_77.jpg',10,0.00,1,0,0),(78,'Gemischter Salat','Gemischter Salat (Eisbergsalat, Tomate, Gurke, Paprika, Feta, Mais) mit Baguette und Kräuterbutter.','Florian R.',1512988200000,1512984600000,0,'/static/images/meals/meal_78.jpg',10,3.50,1,0,0),(79,'Mettwoch','wie immer','Florian R.',1513161000000,1513152000000,0,'/static/images/meals/meal_79.jpg',10,0.00,1,0,0),(80,'Spirelli mit Bolognese','Nudeln mit Hackfleischsauce und Käse!','Florian R.',1513251000000,1513240200000,0,'/static/images/meals/meal_80.JPG',10,3.00,1,0,0),(81,'Salatmontag','Gemischter Salat (Eisbergsalat, Tomate, Gurke, Paprika, Feta, Mais) mit Baguette und Kräuterbutter.','Florian R.',1513594800000,1513591200000,0,'/static/images/meals/meal_81.jpg',10,3.00,1,0,0),(82,'Hackbraten mit Knödeln','Hackbraten mit Knödeln und Erbsen und Möhren ','Florian R.',1513681200000,1513677600000,14,'/static/images/meals/meal_82.jpg',10,3.00,1,0,0),(83,'Mettwoch','','Florian R.',1513767600000,1513756800000,0,'/static/images/meals/meal_83.jpg',10,0.00,1,0,0),(84,'Mettwoch','Wie immer','Florian R.',1514975400779,1514966400779,0,'/static/images/meals/meal_84.jpg',10,0.00,1,0,0),(85,'Käsespätzle','','Florian R.',1515148200813,1515142800000,6,'/static/images/meals/meal_85.jpg',10,1.50,1,0,0),(86,'Salatmontag','Gemischter Salat mit Joghurtsauce','Florian R.',1515409200000,1515402000000,0,'/static/images/meals/meal_86.jpg',10,3.00,1,0,0),(87,'Mettwoch','','Florian R.',1515582000000,1515571200000,0,'/static/images/meals/meal_87.jpg',10,0.00,1,0,0),(88,'Friseur kommt','Alles wie immer','Robin G.',1516096800000,1516096800000,0,'/static/images/meals/meal_88.jpg',29,0.00,0,0,0),(89,'Salatmontag','Gemischter Salat mit Buttermilch und Essig-Öl-Dressing','Florian R.',1516014000000,1516010400000,0,'/static/images/meals/meal_89.jpg',10,3.00,1,0,0),(90,'Mettwoch','','Florian R.',1516186800000,1516177800000,0,'/static/images/meals/meal_90.jpg',10,0.00,1,0,0),(91,'Salatmontag','Gemischter Salat der Saison, Kräuterbutterbaguette','Robin',1516618800000,1516615200000,0,'/static/images/meals/meal_91.jpg',29,12.00,1,0,0),(92,'PulledPork Burger','Burger mit Pulled Pork (fertig gekauft) und Krautsalat (fertig gekauft)','Florian R.',1516359600000,1516348800000,0,'/static/images/meals/meal_92.jpg',10,3.00,1,0,0),(93,'Pulled Pork Burger','frisches Pulled Pork mit selbstgemachtem Krautsalat','Florian R.',1516878000000,1516789800190,7,'/static/images/meals/meal_93.jpg',10,5.50,1,0,0),(94,'Linsensuppe ','Mit Bockwurst und Graubrot','Florian R.',1517482800053,1517477400000,0,'/static/images/meals/meal_94.jpg',10,1.50,1,0,0),(95,'Salatmontag','Wie immer, diesmal auch mit Gurkensalat','Florian R.',1517826600000,1517826600000,0,'/static/images/meals/meal_95.jpg',10,3.50,1,0,0),(96,'Mettwoch','','Florian R.',1518001200000,1517990400000,0,'/static/images/meals/meal_96.jpg',10,0.00,1,0,0),(97,'Lauch-Hackfleisch-Suppe','Käse-Lauch-Suppe mit Hackfleisch und Baguette','Florian R.',1517914800295,1517913000295,12,'/static/images/meals/meal_97.jpeg',10,3.30,1,0,0),(98,'Salatmontag','Salat der Saison','Florian R.',1518433200000,1518431400000,0,'/static/images/meals/meal_98.jpg',10,3.30,1,0,0),(99,'Mettwoch','','Florian R.',1518606000000,1518595200000,0,'/static/images/meals/meal_99.jpg',10,0.00,1,0,0),(100,'Spieleabend','Spieleabend nach der Arbeit,\r\nbitte im Kommentarfeld eintragen welche Spiele mitgebracht werden, damit wir Dopplung vermeiden können.','Florian R.',1519228800000,1519228800000,0,'/static/images/meals/meal_100.jpg',10,0.00,0,0,0),(101,'Pulled Pork Burger','Pulled Pork (gekauft) + Krautsalat (gekauft)','Florian R.',1518174000675,1518166800000,0,'/static/images/meals/meal_101.jpg',10,3.00,1,0,0),(102,'Kartoffelsuppe','Kartoffelsuppe mit Bockwurst','Florian R.',1518690600000,1518620400000,0,'/static/images/meals/meal_102.jpg',10,2.50,1,0,0),(103,'Friseurin kommt','alles wie immer','Robin G.',1519034400000,1519034400000,0,'/static/images/meals/meal_103.jpg',29,0.00,0,0,0),(104,'Salatmontag','','Florian R.',1519038000000,1519030800000,8,'/static/images/meals/meal_104.jpg',10,3.50,1,0,0),(105,'Mettwoch','','Florian R.',1519210800000,1519200000000,0,'/static/images/meals/meal_105.jpg',10,0.00,1,0,0),(106,'Spätzle mit Pilz-Hackfleischsauce','Spätzle (gekauft) mit Pilz-Hackfleischsauce und Erbsen & Möhrchen (aus der Dose)','Florian R.',1519124400000,1519119000000,0,'/static/images/meals/meal_106.jpg',10,3.00,1,0,0),(107,'Pulled Pork Burger','','Florian R.',1519297200000,1519291800000,0,'/static/images/meals/meal_107.jpeg',10,3.20,1,0,0),(108,'Salatmontag','','Florian R.',1519642800000,1519639200000,0,'/static/images/meals/meal_108.jpg',10,3.00,1,0,0),(109,'Mettwoch','','Florian R.',1519815600000,1519804800000,0,'/static/images/meals/meal_109.jpg',10,0.00,1,0,0),(110,'Spirelli Bolognese','','Florian R.',1519902000000,1519893000000,0,'/static/images/meals/meal_110.JPG',10,3.00,1,0,0),(111,'Grießbrei','mit Zucker und Zimt\r\nund je nach Teilnehmerzahl mit heißen Kirschen, Heidelbeeren und was gewüncht wird.','Heiko A.',1521111600000,1521104400000,0,'/static/images/meals/meal_111.png',22,2.70,1,0,0),(112,'Salatmontag','','Florian R.',1520247600000,1520242200000,0,'/static/images/meals/meal_112.jpg',10,4.00,1,0,0),(113,'Mettwoch','','Florian R.',1520420400000,1520411400000,0,'/static/images/meals/meal_113.jpg',10,0.00,1,0,0),(114,'Pulled Pork Burger','','Florian R.',1520334000000,1520323200000,0,'/static/images/meals/meal_114.jpg',10,3.00,1,0,0),(116,'Salatmontag','','Florian R.',1520852400000,1520848800000,0,'/static/images/meals/meal_116.jpg',10,2.50,1,0,0),(117,'Mettwoch','','Florian R.',1521025200000,1521012600000,0,'/static/images/meals/meal_117.jpg',10,0.00,1,0,0),(118,'Salatmontag','','Florian R.',1521457200000,1521455400000,0,'/static/images/meals/meal_118.jpg',10,3.00,1,0,0),(119,'Mettwoch','','Florian R.',1522231200000,1522220400000,0,'/static/images/meals/meal_119.jpg',10,0.00,1,0,0),(120,'Salatmontag','','Florian R.',1522058400000,1522056600000,0,'/static/images/meals/meal_120.jpg',10,3.30,1,0,0),(121,'Linsensuppe mit Bockwurst ','','Florian R.',1522144800155,1522139400000,0,'/static/images/meals/meal_121.jpg',10,2.00,1,0,0),(122,'Friseurin kommt','','Robin G.',1523354400000,1523354400000,0,'/static/images/meals/meal_122.jpg',29,0.00,0,0,0),(123,'Spieleabend','Gemeinsamer Brettspielabend nach der Arbeit','Florian R.',1522317600332,3600000,0,'/static/images/meals/meal_123.jpg',10,0.00,0,2,0),(124,'Salatdienstag','','Florian R.',1522749600000,1522746000000,0,'/static/images/meals/meal_124.jpg',10,0.00,0,0,0),(125,'Mettwoch','','Florian R.',1522836000000,1522825200000,0,'/static/images/meals/meal_125.jpg',10,0.00,1,0,0);
/*!40000 ALTER TABLE `meals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notificationList`
--

DROP TABLE IF EXISTS `notificationList`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `notificationList` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `hash` varchar(150) NOT NULL,
  `type` varchar(150) NOT NULL,
  `subscription` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `hash` (`hash`)
) ENGINE=InnoDB AUTO_INCREMENT=1690 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notificationList`
--

LOCK TABLES `notificationList` WRITE;
/*!40000 ALTER TABLE `notificationList` DISABLE KEYS */;
INSERT INTO `notificationList` VALUES (146,'21b16d8bdf9e02853c1a1ea96f67b88d','gcm','{\"endpoint\":\"https://fcm.googleapis.com/fcm/send/eTOgmnuYBVA:APA91bH5_3pskf3x5p2Gjm4Yauc0VFlzwZX8g5SLj-1fdgvp8AdhztEhTIIXk5xQFrzrUg7XmfeCY5h0Z58GcqyxwQGy5oiUJzKnIpI3VXSSTVZ-1X0LgtdMAm1pxH3acPjTCbWklu5d\",\"expirationTime\":null,\"keys\":{\"p256dh\":\"BHyDnsEy2m8VumcI-eSeItshULlyeqfkVpJnWaYYYdjjWOvzzXfWbfPHfRvArglpan6bHAGtbLPl8X3ftpBG5eM=\",\"auth\":\"0g0djpMh38K6E1UoVo5pUQ==\"}}'),(147,'6c70aff6d4ecdf29d08258da9d31eb75','gcm','{\"endpoint\":\"https://fcm.googleapis.com/fcm/send/etNWNFfBCU8:APA91bG-XNkOb8fz2MHrc9iCzQppR1K-eEqNBvYJDf0RMwwmO4Fqu_CsMucrpD3mzDbxIe9yjGNoSxfFs0cePZzC_TLs_JL0RY-0PxvzDNDvKYZGidiijGdaD4UdojyWOdHt21NDd9xQ\",\"expirationTime\":null,\"keys\":{\"p256dh\":\"BMdDItga2xPHgpn_mhUpdVKxJChOQuhyUesXLbPDM9Eq_qpIoeiRNi-QVmS-FCj9wKYfo57Wx2HMErqfFzJw7rI=\",\"auth\":\"Tw5tVapszZkmyFxfs0B-7w==\"}}'),(153,'91a47edc51608c9af0e8265e23d55aef','gcm','{\"endpoint\":\"https://fcm.googleapis.com/fcm/send/elsMj_5ucFs:APA91bEhYHr9L0I0B8Q22ypCsbfn8TsQAG5nFhLasY_fovj0kuSQZfRhPNljFoOSOkVRZhBtIKYAdvM4sR50Y8BEEybYdaTvbVNzYqE-rtfgr-qwTNLORma1CLpgTrSungfAY-x5K3ld\",\"expirationTime\":null,\"keys\":{\"p256dh\":\"BJQdqcU8hUiHRQ1sHnULj_atCYsPq99hUCVKcu8USy-DE7LoTssXW947n5OY3oSJZJzGlmVaZEmNlfOFFPIq5NQ=\",\"auth\":\"6ddCR2fu1HwxHfyL4RB7IQ==\"}}'),(174,'0990672f73f72a9fdbbf3943a915463b','gcm','{\"endpoint\":\"https://fcm.googleapis.com/fcm/send/fgWV17-Zg7Q:APA91bEIjKa3gioG-irSJMErrN6K6LTEmYeCp1GvUuTd92lxTNbvazfY2iNz9J2lTswSn0U_gcMq9osnKpkPKVpuRfKxMuou9VWImfoRJOxE6YN83PBfvwYI7LG2uuqvKgQY7E81GOj_\",\"expirationTime\":null,\"keys\":{\"p256dh\":\"BCyOofVzsDa-tctewq8V6jeR97x6gEeTU34lxIAxz35SH1XBgU8gZrmRwrxJYUH7B7M3tNDmk8mMc88ciQzIUhw=\",\"auth\":\"BedOibNBltZpc8eYq0Px8w==\"}}'),(210,'44476e39aeaa40971deb56a2ab30e7b3','gcm','{\"endpoint\":\"https://fcm.googleapis.com/fcm/send/da2fIAMVHbQ:APA91bEra4q07b5X7tykYCPMvSmUCCUEYhj0cFESScwXZSkHmrLKxXxUU-kOUE1DWSvgOZiS3D7Egsm5hcDheLECp0MiISlLL4rxMiisg0Dp18yuO9EfUFJrNveDIoewLLj-ZW_9I4vp\",\"expirationTime\":null,\"keys\":{\"p256dh\":\"BCeCCvrlUhzoFfUVInk45G6oI2FCZzrSsviQj8mFeq6V_9heBezGQWl3rvjSEvQIG84e0HtESjmYJo6kwrkOzyA=\",\"auth\":\"m-VxRx5qAB0QiyQVMkPUXg==\"}}'),(271,'829c855a081b3e011996d39e912bb6c7','gcm','{\"endpoint\":\"https://fcm.googleapis.com/fcm/send/e5uTRkPGkv8:APA91bExWUX67YY0X-LnJwxSUqmLdiigSWV2Plpapz5FZ9uct82vXCBNFrvzqZg1Sld7E4pQskAwzo1SgjtKZUmOYDrqMquMoBBRQxwfXXIKu_QK2Dtys_-UBZ79wlIQJQcx9biFUcoV\",\"expirationTime\":null,\"keys\":{\"p256dh\":\"BCRp_TJkrDGut336oY0TiNlr4lPlrrfttqG04Y2eHy-sQO8BCt3cD6D0ALT57CJZ4icbPzlnJ9eUxEQ-SP0OUPM=\",\"auth\":\"Tou_gerLUqYY7STQnte7HA==\"}}'),(278,'ad4c15fb49ddb501029149728ead7c45','gcm','{\"endpoint\":\"https://fcm.googleapis.com/fcm/send/f4YPKUT4pVI:APA91bEAUl6Ue0cRGmxJgacNhoCxrGG0g2rzk_hra8VexGMY67fqPPmgkWYgek2P37NNpqUCrtHS5weAc3_jy9vIrfnUpO_K9_0nocJDm2RplCWitPm9MlX9BrYQESnjtEfKE5Ve0scI\",\"expirationTime\":null,\"keys\":{\"p256dh\":\"BECobIzf8EsluccvkHN_EN0m4883hEyw5utX3lyAsw88cMWc0KCpsjdpeP0nwEpfNmwGG11j_D98EEhtZPa5Aos=\",\"auth\":\"9NaNhqn4Wnl9vhCS8YhUhw==\"}}'),(297,'c4519fe493e4fbd6a677ca01674c252a','gcm','{\"endpoint\":\"https://fcm.googleapis.com/fcm/send/fK_OfyvfWys:APA91bESBJQmJl1R-o1vF04u7gRWdoOgx79jPD0PnS7_6Y7X3eXUAyjtVo31xvQQlBH8sBBQKvzq_iPgo9nS0Qwpvrs5TFFM_gEy7mlosb9Q-MdOj48Rr6_aY54MqhNxfsxC_z2AhtJ8\",\"keys\":{\"p256dh\":\"BNVN7eOMgt6NeyOYyHJEye92tXBppz2i2rjCntz0QEuK7HspPUclpqtuUTSOcWdrHCQxV3konTe4L7rlac0iBeM=\",\"auth\":\"lXM_qLIWRCIrZxMnbwtmpg==\"}}'),(381,'3ce380fa5319da4fc8b630f6a6c24100','gcm','{\"endpoint\":\"https://fcm.googleapis.com/fcm/send/fb3vmEeKtAs:APA91bEhPAljWko2RN3phshHF3YExR6XXmkU0l1Vgc_UyCdkZUFLeqgucFEQL3-TAyhhWRe0xF1iE_Blcxj1pqmNiZSAuecgOfv_PEMW-A0mFK_jw422q-2MSy8c8Z5UjW5UWkIuO3sX\",\"expirationTime\":null,\"keys\":{\"p256dh\":\"BB7QohUU27LFAGXG9pzPMXpF0LwNnlVM5CAedMm7R8wXC9a6og_OrVSlJEgNd3W93KHQh-rdYN9v-y1os7DFWv8=\",\"auth\":\"6_yp8JJArA0CtrZM1GKT1g==\"}}'),(423,'fbfcda0a8e5bfe35447938024bb5f56b','gcm','{\"endpoint\":\"https://updates.push.services.mozilla.com/wpush/v2/gAAAAABaHJvBOZkKp-gBx7icibEFFkHbA5olACQ7WvtxEvAxUo0tBG0fk1ooVezIoYeIqxL2EHFEsRkcJ8LyIMLe2mPPyvENRnMzsvNcMWdWU0B6ye_b8jzK2Rv7YYgB63GolBT1JPuDaSidk0eCxnyW7LBmkYh5PBDHMEnc2nlznYdITVm8vr8\",\"keys\":{\"auth\":\"jZ7Qiq2bxzCl2axbjzAyqQ\",\"p256dh\":\"BCL8u6a2EEKkE-XFy8aBe2BM9B8IWBuHcqs0-N9udN5ObBu0GSrOksZoy5DKI0Iq5oXQCqshs2oMerMhlNGxMtQ\"}}'),(491,'47fb16f708ee6370c43b6840d0de4629','gcm','{\"endpoint\":\"https://fcm.googleapis.com/fcm/send/fsf19iEPPfU:APA91bHFaaf14a-I01K2-ElyAlH-sWYrGj0QvYiiOTCMyOxdntp1z4LuXXSKVKUYpvXpC9j4fMsOQm6ruXzBJxkNpppfujGI0BplXdFr7Z33Nt9gCnw_LFe6c42NJMShEzOgBYeExPRo\",\"expirationTime\":null,\"keys\":{\"p256dh\":\"BHwROYY-kRINdBehwA5-DPAYkYvqHswTd-eUy4J-OBlQcluSazW4FRYjbge-lgDUgfFWdxMJdPJ1GDZHMJssnrs=\",\"auth\":\"P1WGBQYlhIFJl41liilUjA==\"}}'),(640,'5b5fadd0751ef73bed3587847f24f3f9','gcm','{\"endpoint\":\"https://fcm.googleapis.com/fcm/send/dqT1JufnhtM:APA91bEmuvKvmyNjS2ffD9nJb22ZibbJdLUd0nnb7UT6DvMjBLu_m1YgqpNYoZzWQmWBqWP1Iy--lI4sjovLg1DTkMeoJ9iEkb10ZHMAeb_j07u_KuK8gxyY2-wtfNqdQOU2FgPKj3ap\",\"expirationTime\":null,\"keys\":{\"p256dh\":\"BG3Nz4gWuiYLWmHG-yz5_BIb_Mo8N8uHo2TlwV7x79x-bJVn9h1aO4y6ii8Dwwz7jA66fG11CPv_bmSdG4C0hYk=\",\"auth\":\"QOtFGEie-ZnV9YuIBaSwPQ==\"}}'),(648,'60aaef6c5e4254ecdf06b46d31583be2','gcm','{\"endpoint\":\"https://updates.push.services.mozilla.com/wpush/v2/gAAAAABaMT3OvNr7nJCkqA1NNe6P-JDx08PeAFPCO9-WVi75E-3m9gVaQPhjC8JTvxm8bOd6fdR9ORSgksUJkvFIbedeOXIuINfRozTvNsLii_5gbGag_AJKazseytoQ_x11Nj4CsuresfCOHYWzVouPGWFMiCdPgBQU5ZvZ6M7LOTFNROUwmAE\",\"keys\":{\"auth\":\"hN8zT6Vxm87EpB05LyGNlQ\",\"p256dh\":\"BKDok-9a0JH6ljYfSfavQJ2TuRGUZ-m3iKIJNC_AfobKVv2Srx1FeSep0SfG0UXFKkn25UB_nsezHN-YFOLZ-kc\"}}'),(676,'a86b574ee1ce4fee9d7d769ce6626573','gcm','{\"endpoint\":\"https://fcm.googleapis.com/fcm/send/dg73SOXS8X0:APA91bGp7Hc4JPgEEsdx2issGESi0aMkf20-u6Anq0JC_mBd_7rr9t2PArqXjMvSVSl1uiHN8-7WzfUc0dOckMIJkuedJaEHsnSOFI4flj0pG8jquST1drLH0AzH43Xx-8CTqC_4NhQ5\",\"expirationTime\":null,\"keys\":{\"p256dh\":\"BHsMCJ_QOwCCw3Kt62ja1xcznmaFvV4rA1rUp3B1qSZWMAXJxlpmnWjmeD_FhJpZZwgJLPB4Kmf6FDVV-i3-t0I=\",\"auth\":\"l0KDJsywpuO7G08y7NWXeg==\"}}'),(767,'3945969f51533d4f1d58e108da454ccf','gcm','{\"endpoint\":\"https://updates.push.services.mozilla.com/wpush/v2/gAAAAABaTK3CJNlcGH7reQfQjVDAJJz5Zp5Y2nYxKxNc_zm9vQMVI380MgZk6nAjp2P3UYAnfPfvsJ-oOVTNhKIjBF-Ua3aqea7Jcch74iY92TQqJeJGovj5mfOPV_kgtijDJP-4WG5ki_ekVTgtI2AVWtYF92mlUGOQacgtzifJ4asMwoIuABY\",\"keys\":{\"auth\":\"XERzCN-n2Y0AWdIBedM6uw\",\"p256dh\":\"BGXS26HmZCqhD2mE6_SHxRn8FpWPPfJVCiLsR6CnMOiGKyVY1hjWeJctxbAZICOZwNRMUWOLTOfEhL8HBw1_YM4\"}}'),(801,'4071cc399bfb128ef1e5954721ba9b85','gcm','{\"endpoint\":\"https://fcm.googleapis.com/fcm/send/dlswQNBoWQE:APA91bHVTciUset0VBMieSepMQNGOSejSR6Cc759eCFYoWIKsv_7UBEajx-f9_pEQlOqbGHkYG9nKSTxY_gQlVEq-QSCrpLCIs3WZDOJHSohMdw0jUZh6TeRjH6Z59kcD0J_QE1VfayG\",\"expirationTime\":null,\"keys\":{\"p256dh\":\"BNC22I-rLfhDAhd8M7AmevUsuP79VdWGFNTIL6G_8OAtF6ygZnDYxLMuWtVbTJZJOJnBaXA8X_xRQRtmXN6k7yI=\",\"auth\":\"mO5eynBPV6ci7jbnZVDZnQ==\"}}'),(898,'f728708a9fff3b92f2ec045d827d8c32','gcm','{\"endpoint\":\"https://fcm.googleapis.com/fcm/send/d7UXGt2SJkY:APA91bGMUY4_3qN3dae7KyW9qhN7ahppN3UBw4XQreyh_uLjZFXl-zoQ0NXfyDZFmlSntW6mAV8V5-LLpgLwdg5yWu8v0ldX3xNaqcjBM_y7LoVfEsWGp11KAnJWFhmhfKCkyAv2Ob-Z\",\"expirationTime\":null,\"keys\":{\"p256dh\":\"BAm3lrZ3yVQZLPRTBVpapPm0CSK_XibhiBzZr9cKrByzUHQolPh4yV4LiPEaRKR7QqO92JkP7lIkY_cWb5IrwUc=\",\"auth\":\"muBZ4a2hY8sskA6vP1kBOA==\"}}'),(936,'5dd007d0ef3d3eeb1caef2605dd8e03f','gcm','{\"endpoint\":\"https://fcm.googleapis.com/fcm/send/dbsRRPdtSJo:APA91bEykQbF5X8d66OSSjgLw2NQsMJnTkmwWkkaDelKm99l5Fnr4UG_bSKRZvTd_fA-ia_9uyY4zgQGDCgYOe7PKmYj3icy-hBSieiot2pgYXYRwhhded7F2C40J854jf0bvzmJd9tY\",\"expirationTime\":null,\"keys\":{\"p256dh\":\"BF3ajZzUUUeabRuafPH2AoLOm1pWCKu12Mb3Hg5DFIX0iz5SS8oAFXB7SHnMQ1-ex5LH5PYuhiowRm-dZ5iR_oQ=\",\"auth\":\"QHiMnB0k25aQc45Jz7f3iQ==\"}}'),(1054,'b3483f100b8e4c7489f2e9369efdf33e','gcm','{\"endpoint\":\"https://fcm.googleapis.com/fcm/send/cZDgj8DOBJU:APA91bEWOUT9FQgtOXcgCJ97OUto7UiZEgFJP25zPRUnX94gC_gQOgF34WDZIKEhCsOmTedvGieUrv1yf9mQ_W3wWHEgQW-kcBxb0XSEkw391kjmsQ0PlAbD7LKwnBxSd2BbjsI4WjkW\",\"expirationTime\":null,\"keys\":{\"p256dh\":\"BPKaaRkSrELPQDD4-gEJm5pZ0R3Uok5M5qKG-YX9znSA62QqHlSkFOhRiyqEVU2Rqr9R5VP6GEw70houFCtOm0g=\",\"auth\":\"plWwD4q_KHA5z1aFa7_DvA==\"}}'),(1064,'072b7d8fbb3372b73e16467c57311bef','gcm','{\"endpoint\":\"https://fcm.googleapis.com/fcm/send/cL23DiPVbiQ:APA91bEge_ufgSHNC5aSxfjWYdldrGlwXPw9BkzplO4lUAcNX0VgZ4EGDYNqiJrFPbrQlOvzoiEsfggzQXYJW-iHMEUgqtARlkJt-9w96YJM6KUeSo_Ce26IPhbSiMNEtUQahGfXQj5v\",\"expirationTime\":null,\"keys\":{\"p256dh\":\"BOw5DZdtQyswHU1_wDLMEqfPydD-7uvO71dGyWHIYgmVJQUMesxFgts9wJNQo97QcZ0w6WRcDiycJ3iBX3japOY=\",\"auth\":\"Q3Sws-EHIHv8TT_DT5WhgA==\"}}'),(1380,'378e6f09aedff3d0e7d275489cc7f29f','gcm','{\"endpoint\":\"https://updates.push.services.mozilla.com/wpush/v2/gAAAAABajVoR0AP__Gs2uACONnS0ZtCZeHDBKcGZaZRs8f2guik0vNR48fFucs2LV6-ELX2Tum4A2DGbADiAswp2ksdIBmHQkGVDR1iDaBVBBt-wvu1i6pDNLvNv4AoF6SPoALoTExDWNeC6_hE08WMalFEIWfvK8tv7QHcQapLKpjD_9FS0LJA\",\"keys\":{\"auth\":\"LjFy4hnVmFufQXeO8jJHBQ\",\"p256dh\":\"BEllC_ST11EV8gE9w9ZeraYYaBEf9-XMrM5UDqLd7H7oJjhnT-2Hkx9cy5ctYD9nTIdCKD6tTEujTG9pK13Z8L0\"}}'),(1412,'debf31181ce591dd4cb905e7255fda24','gcm','{\"endpoint\":\"https://fcm.googleapis.com/fcm/send/dctTWyLtdbI:APA91bGKlnKBzAN05bW9blWARPkmee0YFL-hAgKC-9xJiRlSvCFjb5aSvwU8qxVVmflM9xDBARLX8os8Iyl8NBotHbjPVzKiFmvhuTtpbLC06DiX6udgu56ZjuMM5jkO5qFx2LTPio1o\",\"expirationTime\":null,\"keys\":{\"p256dh\":\"BLj0hU6gaj7tojRhE8qCQ3hjp6a9bKm3d6Nybtpzl8Xt5_H3Pk92v8QfykgVgDO5IR4YmnRjluMdUzYpdeW75fs=\",\"auth\":\"vd-nuR1Q6-0JIAgJcNLbTw==\"}}'),(1536,'edf6e0d8d99c5c43f279cf552e209a72','gcm','{\"endpoint\":\"https://fcm.googleapis.com/fcm/send/e7u69xXjO38:APA91bF2xzccaxfZEI0BrTQgDCkNHvbL2oDGnl8DRmHDztR8EoGFgm3IQlQ7Y-6u6IOT1oshulC0EjqZ1QWL1yRWxnVsKV2OvXi02PxVXSoMpG7q0QXA0tAlrcEQzedolu3dCiKfU81-\",\"expirationTime\":null,\"keys\":{\"p256dh\":\"BKf_nK2i6JBhfUdx4-IubOFABMXH0nF9shW8sXq5XEsF4_8HnsOxRffCGU41pl233-n9D4Kz4SOHoExZPhoQb4A=\",\"auth\":\"Q-mLXDyp8PiuNiRGh9I0mA==\"}}'),(1681,'a109000695094eb851b210cbfba12f88','gcm','{\"endpoint\":\"https://updates.push.services.mozilla.com/wpush/v2/gAAAAABavMWPzj0pP1Ay7ObiIhrcEYaFqf_8bL6Ssgdzjx6HvGuNTjUCJJbGfdwuwpE_Vvc4sUCVKXnS7f0eY7zyYNKG40wV49bnMqbAM8unQSbTDrgyG2IhYp-AbW8PprSfyTdfyiI6dS5BgRBuXB9nPvB7eYPfH6t0OkjC6YtFdAUnIc7njEY\",\"keys\":{\"auth\":\"IO9CchFup4V54NtfmiNWSw\",\"p256dh\":\"BFTxb495tLlUqVgtPoJst1F1yHM3QE53xK2IAaNc6ov_jQ12hDPHGTrzo8rsyqrFnNI8DLne2Wy-oLCeTcN2YaA\"}}');
/*!40000 ALTER TABLE `notificationList` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `signupOptions`
--

DROP TABLE IF EXISTS `signupOptions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `signupOptions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `signupId` int(11) NOT NULL,
  `mealOptionId` int(11) NOT NULL,
  `value` varchar(150) DEFAULT NULL,
  `count` int(11) DEFAULT NULL,
  `show` int(11) DEFAULT NULL,
  `valueId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `signupId` (`signupId`,`mealOptionId`)
) ENGINE=InnoDB AUTO_INCREMENT=332 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `signupOptions`
--

LOCK TABLES `signupOptions` WRITE;
/*!40000 ALTER TABLE `signupOptions` DISABLE KEYS */;
INSERT INTO `signupOptions` VALUES (4,43,4,'Schwein',NULL,NULL,NULL),(5,43,5,'Kürbiskern',3,NULL,NULL),(6,43,6,NULL,NULL,1,NULL),(7,45,4,'Schwein',NULL,NULL,NULL),(8,45,5,'Doppel',2,NULL,NULL),(9,45,6,NULL,NULL,1,NULL),(10,46,4,'Schwein',NULL,NULL,NULL),(11,46,5,'Doppel',2,NULL,NULL),(12,46,6,NULL,NULL,0,NULL),(13,47,7,'Baguette',NULL,NULL,NULL),(14,48,7,'Mischbrot',NULL,NULL,NULL),(15,49,7,'Baguette',NULL,NULL,NULL),(16,50,7,'Baguette',NULL,NULL,NULL),(17,51,7,'Baguette',NULL,NULL,NULL),(18,54,7,'Baguette',NULL,NULL,NULL),(19,55,4,'Rind',NULL,NULL,NULL),(20,55,5,'Doppel',2,NULL,NULL),(21,55,6,NULL,NULL,1,NULL),(22,57,4,'Schwein',NULL,NULL,NULL),(23,57,5,'Roggen',2,NULL,NULL),(24,57,6,NULL,NULL,1,NULL),(25,58,7,'Mischbrot',NULL,NULL,NULL),(26,59,7,'Mischbrot',NULL,NULL,NULL),(27,60,7,'Mischbrot',NULL,NULL,NULL),(28,77,8,'Schwein',NULL,NULL,NULL),(29,77,9,'Kürbiskern',3,NULL,NULL),(30,77,10,NULL,NULL,1,NULL),(31,78,8,'Schwein',NULL,NULL,NULL),(32,78,9,'Normal',2,NULL,NULL),(33,78,10,NULL,NULL,0,NULL),(34,79,8,'Schwein',NULL,NULL,NULL),(35,79,9,'Doppel',2,NULL,NULL),(36,79,10,NULL,NULL,0,NULL),(37,80,8,'Rind',NULL,NULL,NULL),(38,80,9,'Roggen',2,NULL,NULL),(39,80,10,NULL,NULL,1,NULL),(40,81,8,'Schwein',NULL,NULL,NULL),(41,81,9,'Doppel',2,NULL,NULL),(42,81,10,NULL,NULL,1,NULL),(46,84,11,'Rind',NULL,NULL,27),(47,84,12,'Doppel',2,NULL,29),(48,84,13,NULL,NULL,1,NULL),(49,86,11,'Schwein',NULL,NULL,28),(50,86,12,'Kürbiskern',3,NULL,30),(51,86,13,NULL,NULL,1,NULL),(52,87,11,'Schwein',NULL,NULL,28),(53,87,12,'Doppel',2,NULL,29),(54,87,13,NULL,NULL,0,NULL),(55,88,11,'Schwein',NULL,NULL,28),(56,88,12,'Normal',2,NULL,32),(57,88,13,NULL,NULL,0,NULL),(58,92,11,'Rind',NULL,NULL,27),(59,92,12,'Roggen',2,NULL,33),(60,92,13,NULL,NULL,1,NULL),(61,93,11,'Schwein',NULL,NULL,28),(62,93,12,'Doppel',1,NULL,29),(63,93,13,NULL,NULL,1,NULL),(64,94,11,'Schwein',NULL,NULL,28),(65,94,12,'Doppel',2,NULL,29),(66,94,13,NULL,NULL,0,NULL),(73,114,14,'Schwein',NULL,NULL,36),(74,114,15,'Kürbiskern',3,NULL,38),(75,114,16,NULL,NULL,1,NULL),(76,120,14,'Schwein',NULL,NULL,36),(77,120,15,'Roggen',2,NULL,41),(78,120,16,NULL,NULL,1,NULL),(82,125,14,'Schwein',NULL,NULL,36),(83,125,15,'Normal',2,NULL,40),(84,125,16,NULL,NULL,0,NULL),(85,130,14,'Schwein',NULL,NULL,36),(86,130,15,'Doppel',2,NULL,37),(87,130,16,NULL,NULL,1,NULL),(88,131,17,'Schwein',NULL,NULL,44),(89,131,18,'Kürbiskern',3,NULL,46),(90,131,19,NULL,NULL,1,NULL),(91,132,17,'Rind',NULL,NULL,43),(92,132,18,'Doppel',2,NULL,45),(93,132,19,NULL,NULL,1,NULL),(94,133,17,'Rind',NULL,NULL,43),(95,133,18,'Doppel',2,NULL,45),(96,133,19,NULL,NULL,1,NULL),(97,134,17,'Rind',NULL,NULL,43),(98,134,18,'Doppel',2,NULL,45),(99,134,19,NULL,NULL,1,NULL),(100,135,17,'Schwein',NULL,NULL,44),(101,135,18,'Normal',2,NULL,48),(102,135,19,NULL,NULL,0,NULL),(103,139,20,'Schwein',NULL,NULL,52),(104,139,21,'Kürbiskern',3,NULL,54),(105,139,22,NULL,NULL,1,NULL),(106,142,20,'Rind',NULL,NULL,51),(107,142,21,'Doppel',2,NULL,53),(108,142,22,NULL,NULL,1,NULL),(109,143,20,'Rind',NULL,NULL,51),(110,143,21,'Roggen',2,NULL,57),(111,143,22,NULL,NULL,1,NULL),(112,148,20,'Schwein',NULL,NULL,52),(113,148,21,'Normal',2,NULL,56),(114,148,22,NULL,NULL,0,NULL),(115,150,20,'Schwein',NULL,NULL,52),(116,150,21,'Doppel',2,NULL,53),(117,150,22,NULL,NULL,0,NULL),(118,152,20,'Schwein',NULL,NULL,52),(119,152,21,'Doppel',2,NULL,53),(120,152,22,NULL,NULL,1,NULL),(121,153,20,'Schwein',NULL,NULL,52),(122,153,21,'Normal',2,NULL,56),(123,153,22,NULL,NULL,0,NULL),(124,155,20,'Schwein',NULL,NULL,52),(125,155,21,'Doppel',2,NULL,53),(126,155,22,NULL,NULL,1,NULL),(131,162,23,'Rind',NULL,NULL,59),(132,162,24,'Doppel',2,NULL,61),(133,162,25,NULL,NULL,1,NULL),(134,163,23,'Schwein',NULL,NULL,60),(135,163,24,'Doppel',2,NULL,61),(136,163,25,NULL,NULL,0,NULL),(137,165,23,'Rind',NULL,NULL,59),(138,165,24,'Roggen',2,NULL,65),(139,165,25,NULL,NULL,1,NULL),(140,166,23,'Schwein',NULL,NULL,60),(141,166,24,'Normal',3,NULL,64),(142,166,25,NULL,NULL,0,NULL),(143,169,23,'Schwein',NULL,NULL,60),(144,169,24,'Doppel',2,NULL,61),(145,169,25,NULL,NULL,0,NULL),(146,170,23,'Schwein',NULL,NULL,60),(147,170,24,'Doppel',2,NULL,61),(148,170,25,NULL,NULL,1,NULL),(149,171,23,'Schwein',NULL,NULL,60),(150,171,24,'Doppel',2,NULL,61),(151,171,25,NULL,NULL,1,NULL),(152,172,23,'Schwein',NULL,NULL,60),(153,172,24,'Kürbiskern',3,NULL,62),(154,172,25,NULL,NULL,1,NULL),(155,188,26,'Roggenbrötchen',NULL,NULL,68),(156,189,26,'Burgerbrötchen',NULL,NULL,67),(157,190,26,'Roggenbrötchen',NULL,NULL,68),(161,192,26,'Roggenbrötchen',NULL,NULL,68),(162,193,26,'Roggenbrötchen',NULL,NULL,68),(164,194,26,'Burgerbrötchen',NULL,NULL,67),(166,196,26,'Burgerbrötchen',NULL,NULL,67),(167,207,36,'Rind',NULL,NULL,93),(168,207,37,'Doppel',2,NULL,95),(169,207,38,NULL,NULL,1,NULL),(170,209,36,'Schwein',NULL,NULL,94),(171,209,37,'Doppel',2,NULL,95),(172,209,38,NULL,NULL,0,NULL),(173,211,36,'Schwein',NULL,NULL,94),(174,211,37,'Kürbiskern',3,NULL,96),(175,211,38,NULL,NULL,1,NULL),(176,215,36,'Rind',NULL,NULL,93),(177,215,37,'Roggen',2,NULL,99),(178,215,38,NULL,NULL,1,NULL),(179,217,36,'Schwein',NULL,NULL,94),(180,217,37,'Doppel',2,NULL,95),(181,217,38,NULL,NULL,0,NULL),(182,229,36,'Schwein',NULL,NULL,94),(183,229,37,'Doppel',2,NULL,95),(184,229,38,NULL,NULL,1,NULL),(185,232,36,'Schwein',NULL,NULL,94),(186,232,37,'Doppel',2,NULL,95),(187,232,38,NULL,NULL,1,NULL),(189,234,36,'Schwein',NULL,NULL,94),(190,234,37,'Doppel',1,NULL,95),(191,234,38,NULL,NULL,1,NULL),(192,236,39,'Schwein',NULL,NULL,102),(193,236,40,'Kürbiskern',3,NULL,104),(194,236,41,NULL,NULL,1,NULL),(195,239,39,'Rind',NULL,NULL,101),(196,239,40,'Doppel',2,NULL,103),(197,239,41,NULL,NULL,1,NULL),(198,240,39,'Schwein',NULL,NULL,102),(199,240,40,'Doppel',2,NULL,103),(200,240,41,NULL,NULL,0,NULL),(201,243,39,'Rind',NULL,NULL,101),(202,243,40,'Roggen',2,NULL,107),(203,243,41,NULL,NULL,1,NULL),(204,246,42,'Burgerbrötchen',NULL,NULL,109),(205,247,42,'Burgerbrötchen',NULL,NULL,109),(206,248,42,'Burgerbrötchen',NULL,NULL,109),(208,249,42,'Burgerbrötchen',NULL,NULL,109),(210,251,42,'Burgerbrötchen',NULL,NULL,109),(211,252,42,'Burgerbrötchen',NULL,NULL,109),(212,253,42,'Burgerbrötchen',NULL,NULL,109),(213,254,42,'Roggenbrötchen',NULL,NULL,110),(214,262,39,'Schwein',NULL,NULL,102),(215,262,40,'Normal',2,NULL,106),(216,262,41,NULL,NULL,0,NULL),(217,279,46,'Schwein',NULL,NULL,120),(218,279,47,'Kürbiskern',3,NULL,122),(219,279,48,NULL,NULL,1,NULL),(220,282,46,'Rind',NULL,NULL,119),(221,282,47,'Doppel',2,NULL,121),(222,282,48,NULL,NULL,1,NULL),(226,286,46,'Rind',NULL,NULL,119),(227,286,47,'Roggen',2,NULL,125),(228,286,48,NULL,NULL,1,NULL),(229,290,46,'Schwein',NULL,NULL,120),(230,290,47,'Doppel',2,NULL,121),(231,290,48,NULL,NULL,1,NULL),(232,296,46,'Schwein',NULL,NULL,120),(233,296,47,'Doppel',1,NULL,121),(234,296,48,NULL,NULL,1,NULL),(235,299,49,'Roggenbrötchen',NULL,NULL,128),(236,300,49,'Burgerbrötchen',NULL,NULL,127),(237,301,49,'Burgerbrötchen',NULL,NULL,127),(238,302,49,'Burgerbrötchen',NULL,NULL,127),(239,303,49,'Roggenbrötchen',NULL,NULL,128),(240,304,46,'Schwein',NULL,NULL,120),(241,304,47,'Doppel',2,NULL,121),(242,304,48,NULL,NULL,0,NULL),(245,305,49,'Roggenbrötchen',NULL,NULL,128),(246,306,49,'Burgerbrötchen',NULL,NULL,127),(247,307,49,'Roggenbrötchen',NULL,NULL,128),(251,310,50,'Schwein',NULL,NULL,130),(252,310,51,'Doppel',2,NULL,131),(253,310,52,NULL,NULL,0,NULL),(254,313,50,'Rind',NULL,NULL,129),(255,313,51,'Doppel',2,NULL,131),(256,313,52,NULL,NULL,1,NULL),(257,315,50,'Schwein',NULL,NULL,130),(258,315,51,'Mohn',4,NULL,133),(259,315,52,NULL,NULL,1,NULL),(260,316,50,'Schwein',NULL,NULL,130),(261,316,51,'Doppel',2,NULL,131),(262,316,52,NULL,NULL,1,NULL),(263,323,50,'Rind',NULL,NULL,129),(264,323,51,'Doppel',2,NULL,131),(265,323,52,NULL,NULL,1,NULL),(266,324,50,'Schwein',NULL,NULL,130),(267,324,51,'Normal',2,NULL,134),(268,324,52,NULL,NULL,0,NULL),(269,326,50,'Schwein',NULL,NULL,130),(270,326,51,'Doppel',1,NULL,131),(271,326,52,NULL,NULL,1,NULL),(272,345,56,'Schwein',NULL,NULL,146),(273,345,57,'Mohn',4,NULL,149),(274,345,58,NULL,NULL,1,NULL),(275,347,56,'Rind',NULL,NULL,145),(276,347,57,'Doppel',2,NULL,147),(277,347,58,NULL,NULL,1,NULL),(278,348,59,'Burgerbrötchen',NULL,NULL,153),(279,351,56,'Schwein',NULL,NULL,146),(280,351,57,'Doppel',3,NULL,147),(281,351,58,NULL,NULL,1,NULL),(282,352,59,'Burgerbrötchen',NULL,NULL,153),(283,353,59,'Burgerbrötchen',NULL,NULL,153),(284,354,59,'Burgerbrötchen',NULL,NULL,153),(285,358,59,'Roggenbrötchen',NULL,NULL,154),(286,359,56,'Rind',NULL,NULL,145),(287,359,57,'Roggen',2,NULL,151),(288,359,58,NULL,NULL,1,NULL),(289,361,59,'Roggenbrötchen',NULL,NULL,154),(296,370,63,'Rind',NULL,NULL,163),(297,370,64,'Doppel',2,NULL,165),(298,370,65,NULL,NULL,1,NULL),(299,371,63,'Schwein',NULL,NULL,164),(300,371,64,'Mohn',3,NULL,167),(301,371,65,NULL,NULL,1,NULL),(302,372,63,'Rind',NULL,NULL,163),(303,372,64,'Roggen',2,NULL,169),(304,372,65,NULL,NULL,1,NULL),(305,373,63,'Schwein',NULL,NULL,164),(306,373,64,'Doppel',2,NULL,165),(307,373,65,NULL,NULL,0,NULL),(311,381,66,'Schwein',NULL,NULL,172),(312,381,67,'Mohn',3,NULL,175),(313,381,68,NULL,NULL,1,NULL),(314,382,66,'Rind',NULL,NULL,171),(315,382,67,'Doppel',2,NULL,173),(316,382,68,NULL,NULL,1,NULL),(317,386,66,'Rind',NULL,NULL,171),(318,386,67,'Roggen',2,NULL,177),(319,386,68,NULL,NULL,1,NULL),(320,389,66,'Schwein',NULL,NULL,172),(321,389,67,'Doppel',2,NULL,173),(322,389,68,NULL,NULL,0,NULL),(323,402,69,'Rind',NULL,NULL,179),(324,402,70,'Doppel',2,NULL,181),(325,402,71,NULL,NULL,1,NULL),(326,405,69,'Rind',NULL,NULL,179),(327,405,70,'Roggen',2,NULL,185),(328,405,71,NULL,NULL,1,NULL),(329,408,69,'Schwein',NULL,NULL,180),(330,408,70,'Kürbiskern',3,NULL,182),(331,408,71,NULL,NULL,1,NULL);
/*!40000 ALTER TABLE `signupOptions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `signups`
--

DROP TABLE IF EXISTS `signups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `signups` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  `meal` int(11) NOT NULL,
  `comment` varchar(150) NOT NULL,
  `userId` int(11) DEFAULT NULL,
  `paid` int(11) DEFAULT 0,
  `price` float(10,2) NOT NULL DEFAULT 0.00,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=409 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `signups`
--

LOCK TABLES `signups` WRITE;
/*!40000 ALTER TABLE `signups` DISABLE KEYS */;
INSERT INTO `signups` VALUES (3,'Friedrich G.',14,'',11,1,0.00),(4,'Karsten',14,'',27,1,0.00),(5,'Florian R.',14,'',10,1,0.00),(6,'Markus',35,'',NULL,1,0.00),(9,'Ag',35,'',28,1,0.00),(10,'Friedrich G.',35,'',11,1,0.00),(11,'Florian R.',35,'',10,1,0.00),(12,'AG',61,'Rinderhack 2 Doppel',28,1,0.00),(13,'Marcel J.',61,'Rinderhack 2 Doppel Zwiebeln',19,1,0.00),(14,'Marcel J.',35,'',19,1,0.00),(15,'Heiko A.',35,'Schööööön scharf! :-))',22,1,0.00),(16,'Fouad N.',35,'',25,1,0.00),(17,'Fouad N.',61,'Schweinemett 2 Brötchen',25,1,0.00),(18,'Peter D.',35,'',26,1,0.00),(19,'Friedrich G.',61,'Rindermett, zwei dunkle Brötchen, Zwiebeln',11,1,0.00),(20,'Florian R.',61,'Schweinemett,3 Mohnbrötchen, Zwiebeln',10,1,0.00),(21,'Benjamin',35,'',48,1,0.00),(22,'Benjamin',61,'Schweinemett, 2 Doppelbrötchen',48,1,0.00),(23,'Maik Z.',61,'Schweinemett, 2 Doppelbrötchen, Zwiebeln',35,1,0.00),(24,'Peter D.',61,'Rindermett, 2 Doppelbrötchen, Zwiebeln',26,1,0.00),(25,'Karsten',35,'',27,1,0.00),(26,'Robin G.',61,'Schwein, 2 Doppel',29,1,0.00),(27,'Robin G.',35,'',29,1,0.00),(28,'Peter D.',70,'',26,1,0.00),(29,'Friedrich G.',70,'',11,1,0.00),(30,'Fouad N.',70,'',25,1,0.00),(31,'AG',71,'',28,1,0.00),(33,'Fouad N.',71,'',25,1,0.00),(34,'Florian R.',71,'',10,1,0.00),(35,'Robin G.',70,'',29,1,0.00),(36,'Robin G.',71,'',29,1,0.00),(37,'Peter D.',71,'',26,1,0.00),(38,'Pavlo K.',35,'',NULL,1,0.00),(39,'Michael H.',35,'',24,1,0.00),(40,'Benjamin',71,'',48,1,0.00),(41,'AMonymous',35,'',NULL,1,0.00),(43,'Florian R.',72,'',10,1,0.00),(44,'Karsten',70,'',27,1,0.00),(45,'Marcel J.',72,'',19,1,0.00),(46,'AG',72,'Hab mich nicht verwählt ',28,1,0.00),(47,'Marcel J.',73,'',19,1,0.00),(48,'Karsten',73,'',27,1,0.00),(49,'AG',73,'',28,1,0.00),(50,'Robin G.',73,'',29,1,0.00),(51,'Michael H.',73,'',24,1,0.00),(52,'Michael H.',74,'',24,0,0.00),(53,'Marcel J.',74,'',19,0,0.00),(54,'Peter D.',73,'',26,1,0.00),(55,'Peter D.',72,'',26,1,0.00),(56,'Friedrich G.',74,'',11,0,0.00),(57,'Friedrich G.',72,'',11,1,0.00),(58,'Heiko A.',73,'',22,1,0.00),(59,'Markus H.',73,'',31,1,0.00),(60,'Friedrich G.',73,'',11,1,0.00),(61,'Maik Z.',74,'',35,0,0.00),(62,'Karsten P.',74,'',NULL,0,0.00),(63,'Friedrich',75,'',NULL,0,0.00),(64,'Florian R.',75,'',10,0,0.00),(65,'Robin G.',75,'',NULL,0,0.00),(67,'Peter',75,'',NULL,0,0.00),(68,'Karsten P.',75,'',0,0,0.00),(69,'Robin',74,'',NULL,0,0.00),(71,'Florian R.',76,'',10,1,2.50),(72,'AG',76,'',NULL,1,2.50),(73,'Friedrich',76,'',11,1,2.50),(74,'Micha',76,'',NULL,1,2.50),(75,'Robin',76,'',NULL,1,2.50),(76,'Markus',76,'',NULL,1,2.50),(77,'Florian R.',77,'',10,1,0.00),(78,'Fouad N.',77,'',NULL,1,0.00),(79,'AG',77,'Gürkchen',NULL,1,0.00),(80,'Friedrich',77,'',11,1,0.00),(81,'Marcel',77,'',NULL,1,0.00),(83,'Peter D.',78,'',26,1,3.50),(84,'Peter D.',79,'',26,1,5.00),(85,'Florian R.',78,'',10,1,3.50),(86,'Florian R.',79,'',10,1,3.00),(87,'AG',79,'Gürckchen',NULL,1,3.00),(88,'Fouad',79,'',NULL,1,3.00),(89,'Robin G.',78,'',29,1,3.50),(90,'Karsten',78,'',NULL,1,3.50),(91,'Friedrich',78,'',11,1,3.50),(92,'Friedrich',79,'',11,1,5.00),(93,'Hella',79,'',NULL,1,3.00),(94,'Robin G.',79,'',29,1,3.00),(96,'Friedrich',80,'',11,1,3.00),(97,'Markus',80,'',37,1,3.00),(98,'Robin G.',80,'',29,1,3.00),(99,'AG',80,'',NULL,1,3.00),(100,'Micha H.',80,'',NULL,1,3.00),(101,'Benjamin',80,'',48,1,3.00),(102,'Fouad',80,'',NULL,1,3.00),(103,'Heiko',80,'',NULL,1,3.00),(104,'AMonymous',80,'',NULL,1,3.00),(105,'Marcel',80,'',NULL,1,3.00),(106,'Friedrich',81,'',11,1,3.00),(107,'Florian R.',81,'',10,1,3.00),(108,'Benjamin',82,'',48,1,3.00),(109,'Benjamin',81,'',48,1,3.00),(110,'Marcel J.',82,'',19,1,3.00),(111,'AG',82,'',NULL,1,3.00),(112,'Micha H',82,'',NULL,1,3.00),(114,'Florian R.',83,'',10,1,3.00),(115,'Christian A.',82,'',NULL,1,3.00),(116,'Micha L.',82,'',NULL,1,3.00),(117,'Maria',82,'',NULL,1,3.00),(118,'Romy',82,'',NULL,1,3.00),(119,'Friedrich',82,'',11,1,3.00),(120,'Friedrich',83,'',11,1,3.00),(123,'Robin G.',81,'',29,1,3.00),(124,'Fouad',82,'',NULL,1,3.00),(125,'Fouad',83,'',NULL,1,3.00),(126,'Markus H. ',82,'',NULL,1,3.00),(127,'Hella',82,'',NULL,1,3.00),(128,'Heiko',82,'',NULL,1,3.00),(129,'Mario',82,'',NULL,1,3.00),(130,'Marcel J.',83,'',19,1,3.00),(131,'Florian R.',84,'',10,1,3.00),(132,'Friedrich',84,'',11,1,5.00),(133,'Peter D.',84,'',26,1,5.00),(134,'Micha',84,'',NULL,1,5.00),(135,'Robin G.',84,'',29,1,3.00),(136,'Florian R.',85,'',10,1,1.50),(137,'Benjamin',85,'',48,1,1.50),(138,'Florian R.',86,'',10,1,3.00),(139,'Florian R.',87,'',10,1,3.00),(140,'Heiko',86,'',39,1,3.00),(141,'Peter D.',86,'',26,1,3.00),(142,'Peter D.',87,'',26,1,5.00),(143,'Friedrich',87,'',11,1,5.00),(144,'Friedrich',86,'',11,1,3.00),(145,'Friedrich',85,'',11,1,1.50),(146,'Robin G.',85,'',29,1,1.50),(147,'Robin G.',86,'',29,1,3.00),(148,'Robin G.',87,'',29,1,3.00),(149,'AG',85,'',28,1,1.50),(150,'AG',87,'',28,1,3.00),(151,'Marcel J.',85,'',19,1,1.50),(152,'Marcel J.',87,'',19,1,3.00),(153,'Fouad',87,'',NULL,1,3.00),(154,'Karsten',86,'',NULL,1,3.00),(155,'Maik Z.',87,'',35,1,3.00),(156,'Marcel J.',88,'',19,0,0.00),(157,'Friedrich',88,'',11,0,0.00),(158,'Micha H.',88,'',NULL,0,0.00),(159,'Maik Z.',88,'',35,0,0.00),(160,'Hella',88,'',NULL,0,0.00),(161,'Peter D.',89,'',26,1,3.00),(162,'Peter D.',90,'',26,1,5.00),(163,'Fouad',90,'',NULL,1,3.00),(164,'Friedrich',89,'',11,1,3.00),(165,'Friedrich',90,'',11,1,5.00),(166,'Robin G.',90,'',29,1,3.00),(167,'Robin G.',89,'',29,1,3.00),(168,'Florian R.',89,'',10,1,3.00),(169,'AG',90,'',28,1,3.00),(170,'Marcel J.',90,'',19,1,3.00),(171,'MAIKI',90,'',NULL,1,3.00),(172,'Florian R.',90,'',10,1,3.00),(173,'Peter D.',91,'',26,1,12.00),(175,'Florian R.',92,'',10,1,3.00),(177,'Micha H.',92,'',NULL,1,3.00),(178,'Fouad',92,'',NULL,1,3.00),(179,'Robin G.',92,'',29,1,3.00),(180,'Robin G.',91,'',29,1,12.00),(181,'AG',92,'',28,1,3.00),(182,'Friedrich',92,'',11,1,3.00),(183,'Friedrich',91,'',11,1,12.00),(184,'ogoranskyy',92,'',47,1,3.00),(185,'Marcel J.',92,'',19,1,3.00),(186,'Heiko A.',91,'',22,1,12.00),(187,'Benjamin',92,'',48,2,3.00),(188,'Florian R.',93,'',10,1,5.50),(189,'Markus',93,'+ Roggenbrötchen, bitte',37,1,5.50),(190,'Robin',93,'',NULL,1,5.50),(192,'Peter D.',93,'',26,1,5.50),(193,'Friedrich',93,'',11,1,5.50),(194,'Fouad',93,'',NULL,1,5.50),(196,'Michael H.',93,'',24,1,5.50),(197,'Florian R.',94,'',10,2,1.50),(198,'Heiko A.',94,'',22,2,1.50),(199,'Markus',94,'',37,1,1.50),(200,'Regine',94,'',NULL,1,1.50),(201,'Karsten',94,'',NULL,1,1.50),(202,'Marcel J.',94,'',19,2,1.50),(203,'Hella',94,'',NULL,1,1.50),(204,'Michael H.',94,'',24,2,1.50),(205,'Benjmain',94,'',48,2,1.50),(206,'Peter',95,'',NULL,1,3.50),(207,'Peter',96,'',NULL,1,5.00),(208,'Fouad',94,'',NULL,1,1.50),(209,'Fouad',96,'',NULL,1,3.00),(210,'Florian R.',95,'',10,2,3.50),(211,'Florian R.',96,'',10,2,3.00),(212,'ogoranskyy',94,'',47,1,1.50),(213,'Friedrich',94,'',11,2,1.50),(214,'Friedrich',95,'',11,2,3.50),(215,'Friedrich',96,'',11,2,5.00),(216,'Robin G.',94,'',29,2,1.50),(217,'Robin G.',96,'',29,2,3.00),(218,'Marcus R',95,'',49,1,3.50),(219,'Markus',95,'',37,2,3.50),(220,'Heiko A.',95,'',22,2,3.50),(221,'Florian R.',97,'',10,2,3.30),(222,'ogoranskyy',97,'',47,2,3.30),(223,'Markus',97,'',37,1,3.30),(224,'Heiko A.',97,'',22,2,3.30),(225,'Fouad',97,'',NULL,1,3.30),(226,'Robin G.',97,'',29,2,3.30),(227,'Friedrich',97,'',11,2,3.30),(228,'Marcel J.',97,'',19,2,3.30),(229,'Marcel J.',96,'',19,2,3.00),(230,'Marcus R',97,'',49,2,3.30),(231,'Benjamin',97,'',48,2,3.30),(232,'ogoranskyy',96,'',47,2,3.00),(234,'Hella',96,'',NULL,1,3.00),(235,'Florian R.',100,'7 Wonders, Galaxy Trucker',10,0,0.00),(236,'Florian R.',99,'',10,2,3.00),(237,'Florian R.',98,'',10,2,3.30),(238,'Peter D.',98,'',26,2,3.30),(239,'Peter D.',99,'',26,2,5.00),(240,'Fouad',99,'',NULL,1,3.00),(242,'Friedrich',98,'',11,2,3.30),(243,'Friedrich',99,'',11,2,5.00),(245,'Heiko A.',98,'',22,2,3.30),(246,'Peter D.',101,'',26,2,3.00),(247,'Florian R.',101,'',10,2,3.00),(248,'ogoranskyy',101,'',47,2,3.00),(249,'Marcus R',101,'',49,2,3.00),(250,'Alex G.',98,'',47,2,3.30),(251,'Karsten',101,'',27,2,3.00),(252,'Marion',101,'',52,1,3.00),(253,'Fouad',101,'',NULL,1,3.00),(254,'Robin G.',101,'',29,2,3.00),(255,'Benjamin',102,'',48,2,2.50),(256,'Florian R.',102,'',10,2,2.50),(257,'Regine',102,'',NULL,1,2.50),(258,'Peter D.',102,'',26,2,2.50),(259,'Heiko A.',102,'',22,2,2.50),(260,'Fouad',102,'',NULL,1,2.50),(261,'Robin G.',98,'',29,2,3.30),(262,'Robin G.',99,'',29,2,3.00),(263,'Robin G.',102,'',29,2,2.50),(264,'Karsten',102,'',27,2,2.50),(265,'Friedrich',102,'',11,2,2.50),(266,'Marcus R',98,'',49,2,3.30),(267,'Karsten',98,'',27,2,3.30),(268,'Carsten',102,'',NULL,1,2.50),(269,'Benjamin',98,'',48,2,3.30),(270,'Marcus R',102,'',49,2,2.50),(271,'Markus',102,'',37,1,2.50),(272,'Marcus R',100,'Jenga',49,0,0.00),(273,'Micha H.',102,'',NULL,1,2.50),(274,'Marion',102,'',52,1,2.50),(275,'Michael H.',103,'',24,0,0.00),(276,'Friedrich',103,'',11,0,0.00),(277,'Karsten',103,'',27,0,0.00),(278,'Florian R.',104,'',10,2,3.50),(279,'Florian R.',105,'',10,2,3.00),(280,'Nico Lachmann',103,'',16,0,0.00),(281,'Peter D.',104,'',26,2,3.50),(282,'Peter D.',105,'',26,2,5.00),(283,'Heiko A.',104,'',22,2,3.50),(285,'Friedrich',104,'',11,2,3.50),(286,'Friedrich',105,'',11,2,5.00),(287,'Maik Z.',103,'',35,0,0.00),(288,'Marcel J.',103,'',19,0,0.00),(289,'Alex G.',104,'',47,2,3.50),(290,'Marcel J.',105,'',19,2,3.00),(291,'Markus',106,'',37,2,3.00),(292,'Heiko A.',106,'',22,2,3.00),(293,'Florian R.',106,'',10,2,3.00),(295,'Marcus R',106,'',49,2,3.00),(296,'Hella',105,'',NULL,1,3.00),(297,'Michael H.',106,'',24,2,3.00),(298,'Robin G.',106,'',29,2,3.00),(299,'Florian R.',107,'',10,2,3.20),(300,'Markus',107,'',37,2,3.20),(301,'Fouad',107,'',NULL,1,3.20),(302,'Peter D.',107,'',26,2,3.20),(303,'Friedrich',107,'',11,2,3.20),(304,'Robin G.',105,'',29,2,3.00),(305,'Robin G.',107,'',29,2,3.20),(306,'Marcus R',107,'',49,2,3.20),(307,'Marcel J.',107,'',19,2,3.20),(310,'Fouad N.',109,'',25,1,3.00),(311,'Heiko A.',108,'',22,2,3.00),(312,'Peter D.',108,'',26,2,3.00),(313,'Peter D.',109,'',26,2,5.00),(314,'Florian R.',108,'',10,2,3.00),(315,'Florian R.',109,'',10,2,3.00),(316,'Marcel J.',109,'',19,2,3.00),(317,'Robin G.',108,'',29,2,3.00),(318,'Karsten',108,'',27,2,3.00),(319,'Marcus R',108,'',49,2,3.00),(320,'Markus',110,'',37,2,3.00),(321,'Florian R.',110,'',10,2,3.00),(322,'Michael H.',110,'',24,2,3.00),(323,'Michael H.',109,'',24,2,5.00),(324,'Robin G.',109,'',29,2,3.00),(325,'Marcel J.',110,'',19,2,3.00),(326,'Hella',109,'',54,2,3.00),(327,'Heiko A.',110,'',22,2,3.00),(328,'AMonymous',110,'',NULL,1,3.00),(330,'Marcus R',110,'',49,2,3.00),(331,'Benjamin',110,'',48,2,3.00),(332,'Karsten',110,'',27,2,3.00),(333,'Robin G.',110,'',29,2,3.00),(334,'Heiko A.',111,'',22,2,2.70),(337,'Peter D.',111,'Apfelmus, Heidelbeeren',26,2,2.70),(338,'Florian R.',111,'Apfelmus, Kirschen',10,2,2.70),(339,'Michael H.',111,'Apfelmus, Kirschen',24,2,2.70),(341,'Hella',111,'Apfelmus/Kirschen',54,2,2.70),(342,'Marcus R',111,'Apfelmus',49,2,2.70),(344,'Florian R.',112,'',10,2,4.00),(345,'Florian R.',113,'',10,2,3.00),(346,'Peter D.',112,'',26,2,4.00),(347,'Peter D.',113,'',26,2,5.00),(348,'Florian R.',114,'',10,2,3.00),(350,'Benjamin',112,'',48,2,4.00),(351,'Benjamin',113,'',48,0,3.00),(352,'Peter D.',114,'',26,2,3.00),(353,'Markus',114,'',37,0,3.00),(354,'Marcus R',114,'',49,2,3.00),(355,'Marcus R',112,'',49,2,4.00),(356,'Karsten',112,'',27,2,4.00),(357,'Friedrich',112,'',11,2,4.00),(358,'Friedrich',114,'',11,2,3.00),(359,'Friedrich',113,'',11,2,5.00),(360,'Friedrich',111,'Kirschen',11,0,2.70),(361,'Marcel J.',114,'',19,2,3.00),(365,'Friedrich',116,'',11,2,2.50),(366,'Florian R.',116,'',10,2,2.50),(367,'Robin G.',116,'',29,2,2.50),(368,'Alex G.',116,'',47,1,2.50),(369,'Alex G.',111,'Apfelmus',47,0,2.70),(370,'Peter D.',117,'',26,2,5.00),(371,'Florian R.',117,'',10,2,3.00),(372,'Friedrich',117,'',11,2,5.00),(373,'Robin G.',117,'',29,2,3.00),(375,'Marion',111,'',52,1,2.70),(376,'Florian R.',118,'',10,2,3.00),(377,'Alex G.',118,'',47,2,3.00),(378,'Peter D.',118,'',26,2,3.00),(379,'Heiko A.',118,'',22,2,3.00),(380,'Robin G.',118,'',29,2,3.00),(381,'Florian R.',119,'',10,1,3.00),(382,'Peter D.',119,'',26,2,5.00),(383,'Peter D.',120,'',26,2,3.30),(384,'Florian R.',120,'',10,2,3.30),(385,'Friedrich',120,'',11,2,3.30),(386,'Friedrich',119,'',11,2,5.00),(388,'Robin G.',120,'',29,2,3.30),(389,'Robin G.',119,'',29,2,3.00),(390,'Karsten',120,'',27,2,3.30),(391,'Alex G.',120,'',47,2,3.30),(392,'Florian R.',121,'',10,2,2.00),(393,'Alex G.',121,'',47,2,2.00),(394,'Peter D.',121,'',26,2,2.00),(395,'Heiko A.',121,'',22,2,2.00),(396,'Robin G.',121,'',29,2,2.00),(397,'Friedrich',121,'',11,2,2.00),(398,'Karsten',122,'',27,0,0.00),(399,'Friedrich',122,'',11,0,0.00),(400,'Peter D.',124,'',26,0,0.00),(401,'Alex G.',124,'erster',47,0,0.00),(402,'Peter D.',125,'',26,0,5.00),(403,'Maik Z.',122,'',35,0,0.00),(404,'Friedrich',124,'',11,0,0.00),(405,'Friedrich',125,'',11,0,5.00),(406,'Robin G.',124,'',29,0,0.00),(407,'Florian R.',124,'',10,0,0.00),(408,'Florian R.',125,'',10,0,3.00);
/*!40000 ALTER TABLE `signups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transactions`
--

DROP TABLE IF EXISTS `transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `transactions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `source` int(11) NOT NULL,
  `target` int(11) NOT NULL,
  `amount` float(10,2) NOT NULL,
  `reason` varchar(255) NOT NULL,
  `time` bigint(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=299 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transactions`
--

LOCK TABLES `transactions` WRITE;
/*!40000 ALTER TABLE `transactions` DISABLE KEYS */;
INSERT INTO `transactions` VALUES (1,10,10,2.50,'Spirelli mit Bolognese',1512499433801),(2,10,38,5.00,'Private Transaction',1512499620340),(3,38,10,4.00,'Private Transaction',1512499688789),(4,38,10,0.99,'Private Transaction',1512499716096),(5,38,10,0.01,'Private Transaction',1512501841463),(6,10,11,5.00,'Private Transaction',1512562590249),(7,10,26,20.00,'Private Transaction',1512651948006),(8,10,10,3.50,'Gemischter Salat',1512987874095),(9,26,10,3.50,'Gemischter Salat',1512987874095),(11,11,10,3.50,'Gemischter Salat',1512987878483),(12,10,27,1.50,'Private Transaction',1512990919622),(13,10,29,16.50,'Private Transaction',1512995722791),(14,10,10,3.00,'Mettwoch',1513165055320),(15,26,10,5.00,'Mettwoch',1513165055321),(17,29,10,3.00,'Mettwoch',1513165248197),(18,10,11,15.00,'Private Transaction',1513168922281),(19,29,10,3.00,'Spirelli mit Bolognese',1513246849966),(21,11,10,3.00,'Spirelli mit Bolognese',1513251363994),(22,10,19,10.00,'Private Transaction',1513251976678),(23,10,10,3.00,'Salatmontag',1513595680889),(24,11,10,3.00,'Salatmontag',1513595680890),(26,29,10,3.00,'Salatmontag',1513595685770),(27,19,10,3.00,'Hackbraten mit Knödeln',1513681683669),(29,11,10,3.00,'Hackbraten mit Knödeln',1513683478519),(30,10,10,3.00,'Mettwoch',1513768353195),(31,11,10,3.00,'Mettwoch',1513768353194),(33,19,10,3.00,'Mettwoch',1513768356745),(34,10,10,3.00,'Mettwoch',1514975182145),(35,26,10,5.00,'Mettwoch',1514975182150),(37,29,10,3.00,'Mettwoch',1514975186194),(38,10,11,20.00,'Private Transaction',1514978477491),(39,11,10,5.00,'Mettwoch',1514978481087),(40,10,26,20.00,'Private Transaction',1514981224233),(41,10,29,50.00,'Private Transaction',1514981270966),(42,10,24,3.00,'Private Transaction',1515067117027),(43,11,10,2.00,'Private Transaction',1515070414908),(44,10,10,1.50,'Käsespätzle',1515153650497),(45,11,10,1.50,'Käsespätzle',1515153650494),(48,19,10,1.50,'Käsespätzle',1515153657081),(50,29,10,1.50,'Käsespätzle',1515153658331),(51,10,10,3.00,'Salatmontag',1515410292977),(55,26,10,3.00,'Salatmontag',1515410294954),(58,11,10,3.00,'Salatmontag',1515410297117),(60,29,10,3.00,'Salatmontag',1515410298390),(61,10,22,17.00,'Private Transaction',1515425889845),(62,10,19,20.00,'Private Transaction',1515586005009),(63,10,10,3.00,'Mettwoch',1515586009976),(67,19,10,3.00,'Mettwoch',1515586009998),(68,26,10,5.00,'Mettwoch',1515586013164),(71,11,10,5.00,'Mettwoch',1515586014284),(73,29,10,3.00,'Mettwoch',1515586015133),(74,10,11,2.00,'Private Transaction',1515586144486),(75,10,26,2.00,'Private Transaction',1515586169322),(76,11,10,2.00,'Private Transaction',1515750125540),(77,11,10,3.00,'Salatmontag',1516015430500),(79,10,10,3.00,'Salatmontag',1516015430512),(81,26,10,3.00,'Salatmontag',1516015444529),(83,29,10,3.00,'Salatmontag',1516015445606),(84,19,10,3.00,'Mettwoch',1516189552230),(88,10,10,3.00,'Mettwoch',1516189552430),(89,26,10,5.00,'Mettwoch',1516189557215),(92,11,10,5.00,'Mettwoch',1516189558259),(94,29,10,3.00,'Mettwoch',1516189559364),(95,10,11,18.80,'Private Transaction',1516351500548),(96,10,10,3.00,'PulledPork Burger',1516360453676),(97,29,10,3.00,'PulledPork Burger',1516360453712),(98,19,10,3.00,'PulledPork Burger',1516360453722),(99,11,10,3.00,'PulledPork Burger',1516360453729),(100,24,10,3.00,'Private Transaction',1516362138128),(101,29,10,1.20,'Private Transaction',1516370351570),(102,29,29,12.00,'Salatmontag',1516626292033),(103,26,29,12.00,'Salatmontag',1516626292044),(104,11,29,12.00,'Salatmontag',1516626292050),(105,22,29,12.00,'Salatmontag',1516626292054),(106,29,26,9.00,'Private Transaction',1516691422141),(107,29,22,9.00,'Private Transaction',1516691436240),(108,29,11,9.00,'Private Transaction',1516691449039),(109,10,10,5.50,'Pulled Pork Burger',1516880552393),(110,11,10,5.50,'Pulled Pork Burger',1516880552403),(111,26,10,5.50,'Pulled Pork Burger',1516880552415),(112,29,10,5.50,'Private Transaction',1516959353741),(113,10,24,4.50,'Private Transaction',1516970593769),(114,24,10,1.50,'Linsensuppe ',1517483598193),(115,10,10,1.50,'Linsensuppe ',1517483598231),(116,22,10,1.50,'Linsensuppe ',1517483598235),(117,19,10,1.50,'Linsensuppe ',1517483598239),(118,11,10,1.50,'Linsensuppe ',1517483598245),(119,29,10,1.50,'Linsensuppe ',1517483598249),(120,10,48,10.00,'Private Transaction',1517485008448),(121,10,47,8.50,'Private Transaction',1517485119444),(122,10,17,8.50,'Private Transaction',1517485180624),(123,10,27,8.50,'Private Transaction',1517485844896),(124,48,10,3.00,'PulledPork Burger',1517487846414),(125,48,10,1.50,'Linsensuppe ',1517487853437),(126,11,10,3.50,'Salatmontag',1517829131817),(127,10,10,3.50,'Salatmontag',1517829131825),(128,22,10,3.50,'Salatmontag',1517829131831),(129,10,37,5.00,'Private Transaction',1517833280888),(130,37,10,3.50,'Salatmontag',1517833284203),(131,10,26,50.00,'Private Transaction',1517833434736),(132,26,10,3.50,'Private Transaction',1517833478280),(133,47,10,3.30,'Lauch-Hackfleisch-Suppe',1517914649557),(134,10,10,3.30,'Lauch-Hackfleisch-Suppe',1517914649596),(135,19,10,3.30,'Lauch-Hackfleisch-Suppe',1517914649616),(136,48,10,3.30,'Lauch-Hackfleisch-Suppe',1517914649624),(137,22,10,3.30,'Lauch-Hackfleisch-Suppe',1517914649633),(138,29,10,3.30,'Lauch-Hackfleisch-Suppe',1517914649655),(139,10,49,20.00,'Private Transaction',1517920094918),(140,49,10,3.30,'Lauch-Hackfleisch-Suppe',1517920099985),(141,37,10,1.30,'Private Transaction',1517921394599),(142,10,11,5.00,'Private Transaction',1517926145804),(143,11,10,3.30,'Lauch-Hackfleisch-Suppe',1517926149516),(144,29,10,3.00,'Mettwoch',1518002889089),(145,10,10,3.00,'Mettwoch',1518002889096),(146,19,10,3.00,'Mettwoch',1518002889105),(147,47,10,3.00,'Mettwoch',1518002889109),(148,10,11,20.00,'Private Transaction',1518004525586),(149,11,10,5.00,'Mettwoch',1518004528715),(150,26,10,5.00,'Private Transaction',1518004532576),(151,10,10,3.00,'Pulled Pork Burger',1518174945433),(152,26,10,3.00,'Pulled Pork Burger',1518174945437),(153,49,10,3.00,'Pulled Pork Burger',1518174945441),(154,29,10,3.00,'Pulled Pork Burger',1518174945446),(155,27,10,3.00,'Pulled Pork Burger',1518174945455),(156,10,47,10.00,'Private Transaction',1518177288651),(157,47,10,3.00,'Pulled Pork Burger',1518177295160),(158,10,10,3.30,'Salatmontag',1518438190034),(159,26,10,3.30,'Salatmontag',1518438190042),(160,47,10,3.30,'Salatmontag',1518438190048),(161,29,10,3.30,'Salatmontag',1518438190054),(162,49,10,3.30,'Salatmontag',1518438190060),(163,27,10,3.30,'Salatmontag',1518438190065),(164,22,10,3.30,'Salatmontag',1518438190072),(165,11,10,3.30,'Salatmontag',1518438190078),(166,10,48,1.10,'Private Transaction',1518438327209),(167,48,10,3.30,'Salatmontag',1518438334265),(168,49,10,3.00,'Private Transaction',1518523356915),(169,29,10,3.00,'Private Transaction',1518532434130),(170,11,10,3.00,'Private Transaction',1518533576955),(171,10,24,7.00,'Private Transaction',1518533590293),(172,26,10,5.00,'Mettwoch',1518614891690),(173,10,10,3.00,'Mettwoch',1518614891696),(174,11,10,5.00,'Mettwoch',1518614891701),(175,29,10,3.00,'Mettwoch',1518614891706),(176,10,10,2.50,'Kartoffelsuppe',1518685179369),(177,27,10,2.50,'Kartoffelsuppe',1518685179445),(178,11,10,2.50,'Kartoffelsuppe',1518685179448),(179,29,10,2.50,'Kartoffelsuppe',1518685179453),(180,49,10,2.50,'Kartoffelsuppe',1518685179457),(181,26,10,2.50,'Kartoffelsuppe',1518685179465),(182,10,48,5.00,'Private Transaction',1518693728543),(183,10,22,20.00,'Private Transaction',1518693744413),(184,48,10,2.50,'Kartoffelsuppe',1518693750676),(185,22,10,2.50,'Kartoffelsuppe',1518693750681),(186,17,10,3.50,'Private Transaction',1518694139819),(187,24,10,2.50,'Private Transaction',1518694374144),(188,26,10,3.50,'Salatmontag',1519039365569),(189,10,10,3.50,'Salatmontag',1519039365577),(190,47,10,3.50,'Salatmontag',1519039365581),(191,11,10,3.50,'Salatmontag',1519039365583),(192,22,10,3.50,'Salatmontag',1519039365588),(193,29,10,3.00,'Spätzle mit Pilz-Hackfleischsauce',1519126043505),(194,22,10,3.00,'Spätzle mit Pilz-Hackfleischsauce',1519126043541),(195,10,10,3.00,'Spätzle mit Pilz-Hackfleischsauce',1519126043545),(196,49,10,3.00,'Spätzle mit Pilz-Hackfleischsauce',1519126043551),(197,24,10,3.00,'Spätzle mit Pilz-Hackfleischsauce',1519126043556),(198,10,37,10.00,'Private Transaction',1519126719249),(199,37,10,3.00,'Spätzle mit Pilz-Hackfleischsauce',1519126723773),(200,26,10,5.00,'Mettwoch',1519200120121),(201,10,10,3.00,'Mettwoch',1519200120138),(202,29,10,3.00,'Mettwoch',1519200120170),(203,19,10,3.00,'Mettwoch',1519200120178),(204,10,11,19.45,'Private Transaction',1519212110057),(205,11,10,5.00,'Mettwoch',1519212112718),(206,10,11,2.00,'Private Transaction',1519212122753),(207,10,54,10.00,'Private Transaction',1519213091900),(208,10,49,20.00,'Private Transaction',1519292513677),(209,10,10,3.20,'Pulled Pork Burger',1519298977016),(210,37,10,3.20,'Pulled Pork Burger',1519298977534),(211,49,10,3.20,'Pulled Pork Burger',1519298977539),(212,29,10,3.20,'Pulled Pork Burger',1519298977545),(213,26,10,3.20,'Pulled Pork Burger',1519298977547),(214,11,10,3.20,'Pulled Pork Burger',1519298977550),(215,10,19,50.00,'Private Transaction',1519373864166),(216,19,10,3.20,'Pulled Pork Burger',1519373870281),(217,49,10,3.00,'Salatmontag',1519643692586),(218,22,10,3.00,'Salatmontag',1519643692594),(219,26,10,3.00,'Salatmontag',1519643692598),(220,10,10,3.00,'Salatmontag',1519643692604),(221,29,10,3.00,'Salatmontag',1519643692607),(222,10,27,10.00,'Private Transaction',1519643902531),(223,27,10,3.00,'Salatmontag',1519643919203),(224,26,10,5.00,'Mettwoch',1519822099010),(225,19,10,3.00,'Mettwoch',1519822099021),(226,10,10,3.00,'Mettwoch',1519822099050),(227,54,10,3.00,'Mettwoch',1519822099054),(228,29,10,3.00,'Mettwoch',1519822099057),(229,10,24,8.00,'Private Transaction',1519830420479),(230,24,10,5.00,'Mettwoch',1519830423595),(231,10,10,3.00,'Spirelli Bolognese',1519903799806),(232,37,10,3.00,'Spirelli Bolognese',1519903799823),(233,19,10,3.00,'Spirelli Bolognese',1519903799835),(234,24,10,3.00,'Spirelli Bolognese',1519903799840),(235,49,10,3.00,'Spirelli Bolognese',1519903799845),(236,27,10,3.00,'Spirelli Bolognese',1519903799853),(237,22,10,3.00,'Spirelli Bolognese',1519903799861),(238,10,26,50.00,'Private Transaction',1519986550765),(239,10,48,5.00,'Private Transaction',1519986653283),(240,48,10,3.00,'Spirelli Bolognese',1519986677035),(241,11,10,4.00,'Salatmontag',1520250515345),(242,10,10,4.00,'Salatmontag',1520250515359),(243,26,10,4.00,'Salatmontag',1520250515364),(244,48,10,4.00,'Salatmontag',1520250515368),(245,49,10,4.00,'Salatmontag',1520250515385),(246,27,10,4.00,'Salatmontag',1520250515400),(247,19,10,3.00,'Pulled Pork Burger',1520334421932),(248,10,10,3.00,'Pulled Pork Burger',1520334421941),(249,26,10,3.00,'Pulled Pork Burger',1520334421950),(250,49,10,3.00,'Pulled Pork Burger',1520334421961),(251,11,10,3.00,'Pulled Pork Burger',1520334421982),(252,10,10,3.00,'Mettwoch',1520411520122),(253,26,10,5.00,'Mettwoch',1520411520126),(254,11,10,5.00,'Mettwoch',1520411520135),(255,10,29,20.00,'Private Transaction',1520845726086),(256,29,10,3.00,'Spirelli Bolognese',1520845759797),(257,11,10,2.50,'Salatmontag',1520858178316),(258,10,10,2.50,'Salatmontag',1520858178405),(259,29,10,2.50,'Salatmontag',1520858178409),(260,10,27,6.50,'Private Transaction',1520941856666),(261,19,10,3.50,'Private Transaction',1520945130243),(262,10,11,6.50,'Private Transaction',1520945628888),(263,11,10,5.00,'Mettwoch',1521036811616),(264,26,10,5.00,'Mettwoch',1521036811630),(265,10,10,3.00,'Mettwoch',1521036811654),(266,29,10,3.00,'Mettwoch',1521036811658),(267,49,22,2.70,'Grießbrei',1521113133117),(268,22,22,2.70,'Grießbrei',1521113133177),(269,26,22,2.70,'Grießbrei',1521113133183),(270,10,22,2.70,'Grießbrei',1521113133198),(271,24,22,2.70,'Grießbrei',1521113133203),(272,54,22,2.70,'Grießbrei',1521113133209),(273,22,10,3.00,'Salatmontag',1521458688104),(274,10,10,3.00,'Salatmontag',1521458688107),(275,26,10,3.00,'Salatmontag',1521458688112),(276,29,10,3.00,'Salatmontag',1521458688115),(277,10,47,10.00,'Private Transaction',1521459544960),(278,47,10,3.00,'Salatmontag',1521459548398),(279,10,11,7.00,'Private Transaction',1521467514949),(280,11,10,2.50,'Private Transaction',1521547501829),(281,10,24,2.50,'Private Transaction',1521547643505),(282,29,10,2.50,'Private Transaction',1521550867222),(283,29,10,3.30,'Salatmontag',1522062314764),(284,26,10,3.30,'Salatmontag',1522062314814),(285,10,10,3.30,'Salatmontag',1522062314821),(286,11,10,3.30,'Salatmontag',1522062314828),(287,27,10,3.30,'Salatmontag',1522062314844),(288,47,10,3.30,'Salatmontag',1522062314850),(289,10,10,2.00,'Linsensuppe mit Bockwurst ',1522144373832),(290,47,10,2.00,'Linsensuppe mit Bockwurst ',1522144373835),(291,26,10,2.00,'Linsensuppe mit Bockwurst ',1522144373840),(292,22,10,2.00,'Linsensuppe mit Bockwurst ',1522144373844),(293,29,10,2.00,'Linsensuppe mit Bockwurst ',1522144373922),(294,11,10,2.00,'Linsensuppe mit Bockwurst ',1522144373927),(295,29,10,3.00,'Mettwoch',1522220520107),(296,26,10,5.00,'Mettwoch',1522220520110),(297,10,11,20.00,'Private Transaction',1522235758036),(298,11,10,5.00,'Mettwoch',1522235761730);
/*!40000 ALTER TABLE `transactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  `mail` varchar(150) NOT NULL,
  `deadlineReminder` int(11) DEFAULT 0,
  `creationNotice` int(11) DEFAULT 0,
  `balance` float(10,2) NOT NULL DEFAULT 0.00,
  `admin` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `mail` (`mail`)
) ENGINE=InnoDB AUTO_INCREMENT=57 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (10,'Florian R.','f.riedel@epages.com',0,1,-124.85,1),(11,'Friedrich','f.gehring@epages.com',1,1,16.15,0),(16,'Nico Lachmann','n.lachmann@epages.com',0,1,0.00,0),(17,'Regine','r.schmidt@epages.com',1,1,5.00,0),(19,'Marcel J.','m.jaeger@epages.com',1,1,37.00,0),(21,'Timo H.','t.haapakoski@epages.com',0,0,0.00,0),(22,'Heiko A.','h.ahnert@epages.com',0,1,15.90,0),(23,'Michael S.','m.schroeck@epages.com',0,0,0.00,0),(24,'Michael H.','m.hoehn@epages.com',0,1,4.30,0),(25,'Fouad N.','nabhan@epages.com',1,1,0.00,0),(26,'Peter D.','p.domin@epages.com',1,1,29.00,0),(27,'Karsten','k.peskova@epages.com',0,1,4.40,0),(28,'AG','ag17@gmx.de',1,1,0.00,0),(29,'Robin G.','r.gessner@epages.com',1,1,0.20,0),(30,'Theresa Gessner','theresa.gessner90@gmail.com',0,1,0.00,0),(34,'Andreas H.','aheidrich@epages.com',1,1,0.00,0),(35,'Maik Z.','m.zeyen@epages.com',1,1,0.00,0),(37,'Markus','mhoellein@epages.com',1,1,1.00,0),(47,'Alex G.','ogoranskyy@epages.com',0,1,4.10,0),(48,'Benjamin','b.nothdurft@epages.com',0,1,0.50,0),(49,'Marcus R','m.rohr@epages.com',0,0,3.00,0),(52,'Marion','mkulig@epages.de',0,0,0.00,0),(54,'Hella','h.ditze@epages.de',0,1,4.30,0),(55,'Simon Mc Caulley','s.mccaulley@epages.com',1,1,0.00,0),(56,'Carsten Seeger','c.seeger@epages.com',0,0,0.00,0);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-04-01 22:34:25
