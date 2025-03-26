-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: localhost    Database: mauppt
-- ------------------------------------------------------
-- Server version	8.0.41

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `danh_gia`
--

DROP TABLE IF EXISTS `danh_gia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `danh_gia` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nguoi_dung_id` int DEFAULT NULL,
  `mau_powerpoint_id` int DEFAULT NULL,
  `diem_danh_gia` int DEFAULT NULL,
  `binh_luan` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `ngay_tao` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `nguoi_dung_id` (`nguoi_dung_id`),
  KEY `mau_powerpoint_id` (`mau_powerpoint_id`),
  CONSTRAINT `danh_gia_ibfk_1` FOREIGN KEY (`nguoi_dung_id`) REFERENCES `nguoi_dung` (`id`) ON DELETE CASCADE,
  CONSTRAINT `danh_gia_ibfk_2` FOREIGN KEY (`mau_powerpoint_id`) REFERENCES `mau_powerpoint` (`id`) ON DELETE CASCADE,
  CONSTRAINT `danh_gia_chk_1` CHECK ((`diem_danh_gia` between 1 and 5))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `danh_gia`
--

LOCK TABLES `danh_gia` WRITE;
/*!40000 ALTER TABLE `danh_gia` DISABLE KEYS */;
/*!40000 ALTER TABLE `danh_gia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `danh_muc`
--

DROP TABLE IF EXISTS `danh_muc`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `danh_muc` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ten` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `mo_ta` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `danh_muc`
--

LOCK TABLES `danh_muc` WRITE;
/*!40000 ALTER TABLE `danh_muc` DISABLE KEYS */;
INSERT INTO `danh_muc` VALUES (1,'Ngày lễ','Powerpoint chủ đề ngày lễ'),(2,'Học tập','Powerpoint hỗ trợ học tập'),(9,'Giáo dục','mẫu powerpoint hỗ trợ giáo dục'),(10,'kế hoạch','Mẫu powerpoint trình bày kế hoạch'),(13,'Kinh doanh','mẫu powerpoint về kinh doanh'),(14,'Tiếp thị','Mẫu powerpoint về tiếp thị'),(15,'Y tế','Powerpoint chủ đề y tế'),(16,'Tiếp thị','Mẫu powerpoint về tiếp thị'),(17,'Kinh doanh','mẫu powerpoint về kinh doanh'),(20,'Tiếp thị','Mẫu powerpoint về tiếp thị'),(21,'Kinh doanh','mẫu powerpoint về kinh doanh'),(23,'Kinh doanh','mẫu powerpoint về kinh doanh'),(24,'Tiếp thị','Mẫu powerpoint về tiếp thị'),(25,'Mùa xuân','Powerpoint chủ đề về mùa xuân'),(26,'Giáng sinh','Powerpoint về chủ đề lễ giáng sinh'),(27,'Hoa tươi','chủ đề về hoa tươi nở rộ');
/*!40000 ALTER TABLE `danh_muc` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lich_su_tai_xuong`
--

DROP TABLE IF EXISTS `lich_su_tai_xuong`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lich_su_tai_xuong` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nguoi_dung_id` int DEFAULT NULL,
  `mau_powerpoint_id` int DEFAULT NULL,
  `thoi_gian_tai` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `nguoi_dung_id` (`nguoi_dung_id`),
  KEY `mau_powerpoint_id` (`mau_powerpoint_id`),
  CONSTRAINT `lich_su_tai_xuong_ibfk_1` FOREIGN KEY (`nguoi_dung_id`) REFERENCES `nguoi_dung` (`id`) ON DELETE CASCADE,
  CONSTRAINT `lich_su_tai_xuong_ibfk_2` FOREIGN KEY (`mau_powerpoint_id`) REFERENCES `mau_powerpoint` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lich_su_tai_xuong`
--

LOCK TABLES `lich_su_tai_xuong` WRITE;
/*!40000 ALTER TABLE `lich_su_tai_xuong` DISABLE KEYS */;
INSERT INTO `lich_su_tai_xuong` VALUES (12,4,91,'2025-03-17 14:30:41'),(14,5,91,'2025-03-21 17:00:00');
/*!40000 ALTER TABLE `lich_su_tai_xuong` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mau_powerpoint`
--

DROP TABLE IF EXISTS `mau_powerpoint`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mau_powerpoint` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tieu_de` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `mo_ta` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `duong_dan_tap_tin` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT '',
  `duong_dan_anh_nho` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT '',
  `danh_muc_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `danh_muc_id` (`danh_muc_id`),
  CONSTRAINT `mau_powerpoint_ibfk_1` FOREIGN KEY (`danh_muc_id`) REFERENCES `danh_muc` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=122 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mau_powerpoint`
--

LOCK TABLES `mau_powerpoint` WRITE;
/*!40000 ALTER TABLE `mau_powerpoint` DISABLE KEYS */;
INSERT INTO `mau_powerpoint` VALUES (91,'AI','Powerpoint chủ đề về công nghệ AI','/uploads/1742637858025.pptx','/uploads/1742637858072.png',9),(92,'Educational Slides','Presentation template for teachers','/uploads/1742644764399.pptx','/uploads/1742642412865.png',2),(94,'Powerpoint Noel','mẫu powerpoint chủ đề về Giáng sinh đẹp mắt','/uploads/1742637858025.pptx','/uploads/1742639383797.png',1),(95,'Giáo dục','Latest AI trends presentation','/uploads/1742637858025.pptx','/uploads/1742642439998.png',9),(97,'Giáo dục trẻ em','Chủ đề giáo dục trẻ em giưps trẻ tiếp thu nhanh','/uploads/1742637858025.pptx','/uploads/1742642467657.png',10),(103,'Giáo dục mầm non','Chủ đề giáo dục trẻ em giưps trẻ tiếp thu nhanh','/uploads/1742637858025.pptx','/uploads/1742642487119.png',17),(105,'AI','Powerpoint chủ đề về công nghệ AI','/uploads/1742637858025.pptx','/uploads/1742643881641.png',9),(107,'Mùa thu','Powerpoint chủ đề về mùa thu','/uploads/1742637858025.pptx','/uploads/1742639485244.png',14),(109,'Hoa Lavender','Powerpoint vè chủ đề hoa Lanvender đẹp mắt','/uploads/1742637858025.pptx','/uploads/1742644193789.png',25),(110,'Tình yêu','Powerpoint ngày lễ tình nhân','/uploads/1742637858025.pptx','/uploads/1742648940694.png',1),(111,'AI','Powerpoint chủ đề về công nghệ AI','/uploads/1742637858025.pptx','/uploads/1742649043456.png',9),(112,'AI','Powerpoint chủ đề về công nghệ AI','/uploads/1742637858025.pptx','/uploads/1742649062504.png',9),(113,'AI','Powerpoint chủ đề về công nghệ AI','/uploads/1742637858025.pptx','/uploads/1742649082305.png',9),(121,'Mùa thu','Powerpoint chủ đề về công nghệ AI','/uploads/1742637858025.pptx','/uploads/1742642412865.png',9);
/*!40000 ALTER TABLE `mau_powerpoint` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nguoi_dung`
--

DROP TABLE IF EXISTS `nguoi_dung`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nguoi_dung` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ten` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `mat_khau` varchar(255) NOT NULL,
  `quyen` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nguoi_dung`
--

LOCK TABLES `nguoi_dung` WRITE;
/*!40000 ALTER TABLE `nguoi_dung` DISABLE KEYS */;
INSERT INTO `nguoi_dung` VALUES (4,'Nguyen Van A','nguyenvana@example.com','password123','user'),(5,'Tran Thi B','tranthib@example.com','password123','user'),(6,'Le Van C','levanc@example.com','password123','user'),(7,'Nguyen Van B','test@example.com','$2b$10$zaUFN3nMmQbYQYiNzJSKpu2QkhW83Wg/oCigDam1/otmsw1rjj0CG','user'),(8,'admin','admin@xpoint.com','$2b$10$BijOF709Wa0c4fED6pVANuC5N164TR7bLQJE.ASRezSvCU/EL4KZe','admin'),(9,'xuan','xuan@xpoint.com','$2b$10$Nb4WIO5p44ndifIyzKLsZOnegmz4iEqzGGXMiDEwspFGWiWNUe7ae','admin');
/*!40000 ALTER TABLE `nguoi_dung` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-03-22 22:41:07
