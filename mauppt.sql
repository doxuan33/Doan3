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
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `danh_gia`
--

LOCK TABLES `danh_gia` WRITE;
/*!40000 ALTER TABLE `danh_gia` DISABLE KEYS */;
INSERT INTO `danh_gia` VALUES (1,9,91,5,'Rất hữu ích cho việc giảng dạy!','2025-03-26 15:14:18'),(2,5,92,4,'Great insights on AI','2025-03-26 15:14:18'),(3,9,94,5,'Perfect for business presentations!','2025-03-26 15:14:18'),(4,4,91,5,'Very useful for teaching!','2025-03-26 15:14:21'),(5,5,92,4,'Great insights on AI','2025-03-26 15:14:21'),(6,4,94,5,'Perfect for business presentations!','2025-03-26 15:14:21'),(7,4,95,3,'Very useful for teaching!','2025-03-31 11:49:03'),(8,5,97,4,'Great insights on AI','2025-03-31 11:49:03'),(9,9,103,4,'Perfect for business presentations!','2025-03-31 11:49:03'),(10,4,94,3,'Hơi rối','2025-04-03 12:13:59'),(11,5,94,4,'Rất tốt','2025-04-03 12:13:59'),(12,4,91,4,'Hiệu quả nha!','2025-04-03 12:13:59'),(13,9,92,5,'Hiệu quả lắm nha','2025-04-17 02:08:48'),(14,9,109,5,'powerpoint rất đẹp!!! :33','2025-04-20 18:01:47');
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
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `danh_muc`
--

LOCK TABLES `danh_muc` WRITE;
/*!40000 ALTER TABLE `danh_muc` DISABLE KEYS */;
INSERT INTO `danh_muc` VALUES (10,'kế hoạch','Mẫu powerpoint trình bày kế hoạch'),(13,'Kinh doanh','mẫu powerpoint về kinh doanh'),(14,'Tiếp thị','Mẫu powerpoint về tiếp thị'),(15,'Y tế','Powerpoint chủ đề y tế'),(16,'Cây xanh','Mẫu powerpoint về cây cối'),(17,'Mùa thu','mẫu powerpoint, hình ảnh về mùa thu'),(20,'Hoa quả','Powerpoint, hình ảnh về chủ đề hoa quả'),(21,'Bầu trời','mẫu powerpoint, hình ảnh về bầu trời'),(23,'Rừng cây','mẫu powerpoint, hình ảnh về khu rừng'),(24,'mùa đông','Mẫu powerpoint, hình ảnh về mùa đông'),(25,'Mùa xuân','Powerpoint chủ đề về mùa xuân'),(26,'Giáng sinh','Powerpoint về chủ đề lễ giáng sinh'),(27,'Hoa tươi','chủ đề về hoa tươi nở rộ'),(32,'Giáo dục','Chủ đề về giáo dục, học tập, hỗ trợ giảng dạy'),(33,'Ngày lễ','mẫu powerpoint, hình ảnh về ngày lễ');
/*!40000 ALTER TABLE `danh_muc` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `giao_dich_mua_le`
--

DROP TABLE IF EXISTS `giao_dich_mua_le`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `giao_dich_mua_le` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nguoi_dung_id` int NOT NULL,
  `mau_powerpoint_id` int DEFAULT NULL,
  `hinh_anh_id` int DEFAULT NULL,
  `gia` decimal(10,3) NOT NULL,
  `thoi_gian_mua` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `nguoi_dung_id` (`nguoi_dung_id`),
  KEY `mau_powerpoint_id` (`mau_powerpoint_id`),
  KEY `hinh_anh_id` (`hinh_anh_id`),
  CONSTRAINT `giao_dich_mua_le_ibfk_1` FOREIGN KEY (`nguoi_dung_id`) REFERENCES `nguoi_dung` (`id`) ON DELETE CASCADE,
  CONSTRAINT `giao_dich_mua_le_ibfk_2` FOREIGN KEY (`mau_powerpoint_id`) REFERENCES `mau_powerpoint` (`id`) ON DELETE SET NULL,
  CONSTRAINT `giao_dich_mua_le_ibfk_3` FOREIGN KEY (`hinh_anh_id`) REFERENCES `hinh_anh` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `giao_dich_mua_le`
--

LOCK TABLES `giao_dich_mua_le` WRITE;
/*!40000 ALTER TABLE `giao_dich_mua_le` DISABLE KEYS */;
INSERT INTO `giao_dich_mua_le` VALUES (1,9,109,NULL,50000.000,'2025-04-24 17:00:00');
/*!40000 ALTER TABLE `giao_dich_mua_le` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `goi_hoi_vien`
--

DROP TABLE IF EXISTS `goi_hoi_vien`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `goi_hoi_vien` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ten_goi` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `mo_ta` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `gia` decimal(10,3) NOT NULL,
  `thoi_han` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `goi_hoi_vien`
--

LOCK TABLES `goi_hoi_vien` WRITE;
/*!40000 ALTER TABLE `goi_hoi_vien` DISABLE KEYS */;
INSERT INTO `goi_hoi_vien` VALUES (1,'Gói Tháng','Gói hội viên 1 tháng, tải không giới hạn bản Pro',100000.000,30),(2,'Gói Năm','Gói hội viên 1 năm, tải không giới hạn bản Pro',1000000.000,365);
/*!40000 ALTER TABLE `goi_hoi_vien` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hinh_anh`
--

DROP TABLE IF EXISTS `hinh_anh`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hinh_anh` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tieu_de` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `mo_ta` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `duong_dan_anh_nho` varchar(255) DEFAULT NULL,
  `danh_muc_id` int DEFAULT NULL,
  `la_pro` tinyint(1) DEFAULT '0',
  `gia` decimal(10,3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `danh_muc_id` (`danh_muc_id`),
  CONSTRAINT `hinh_anh_ibfk_1` FOREIGN KEY (`danh_muc_id`) REFERENCES `danh_muc` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hinh_anh`
--

LOCK TABLES `hinh_anh` WRITE;
/*!40000 ALTER TABLE `hinh_anh` DISABLE KEYS */;
INSERT INTO `hinh_anh` VALUES (1,'Trừu tượng','Ảnh 3d trừu tượng','http://localhost:1000/uploads/images/1743132494130.png',14,0,NULL),(2,'Tết','Hình ảnh 3D cute ngày tết','http://localhost:1000/uploads/images/1743132539279.png',NULL,0,NULL),(4,'Vườn hoa Tulip','Hình nền về vườn hoa Tulip dưới ánh bình minh','http://localhost:1000/uploads/images/1743132671651.jpg',27,0,NULL),(6,'Đồi hoa','Hình ảnh đồi hoa lúc bình minh trong thiên nhiên mùa xuân','http://localhost:1000/uploads/images/1743436960628.jpg',25,0,NULL),(11,'Hoa anh đào','Hình ảnh hoa anh đào nở rộ rực rỡ vào mùa xuân cho máy tính','http://localhost:1000/uploads/images/1745170457326.jpg',27,0,NULL),(12,'Rừng tuyết','Hình ảnh rừng tuyết mùa đông làm hình nền máy tính đẹp mắt ','http://localhost:1000/uploads/images/1745170647374.jpg',24,0,NULL),(13,'Lá phong','Hình ảnh rừng lá phong mùa thu','http://localhost:1000/uploads/images/1745170856503.jpg',17,0,NULL),(14,'Thay lá','Hình ảnh rừng cây đang thay lá khi chuyển mùa','http://localhost:1000/uploads/images/1745170896919.jpg',17,0,NULL),(15,'Hoa săc màu','Hình ảnh hoa sắc màu trong ngày mới','http://localhost:1000/uploads/images/1745170948852.jpg',27,0,NULL),(16,'Đồi xanh','Đồi cỏ xanh dười bầu trời','http://localhost:1000/uploads/images/1745171109498.jpg',16,0,NULL),(17,'Ngày Tết','Hình nền trang trí ngày tết','http://localhost:1000/uploads/images/1745171144605.jpg',33,0,NULL),(18,'Cherry','Hình ảnh quả cherry mọng nước','http://localhost:1000/uploads/images/1745171243355.jpg',20,0,NULL),(19,'Trời mây','Hình ảnh trời mây dưới ánh trang','http://localhost:1000/uploads/images/1745171347010.jpg',21,0,NULL),(20,'Hoa quả mùa hè','Hình ảnh các loại hoa quả mùa hè tươi mát','http://localhost:1000/uploads/images/1745171390406.jpg',20,0,NULL),(21,'Nhật thực','Hình ảnh nhật thực siêu thực bí ẩn','http://localhost:1000/uploads/images/1745171443054.jpg',21,0,NULL),(22,'Hồ nước','Hình ảnh hồ nước mùa xuân tươi sáng','http://localhost:1000/uploads/images/1745171669059.jpg',25,0,NULL),(23,'Lá vàng','Hình ảnh khu vườn lá vàng mùa thu','http://localhost:1000/uploads/images/1745171727859.jpg',17,0,NULL);
/*!40000 ALTER TABLE `hinh_anh` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lich_su_hoi_vien`
--

DROP TABLE IF EXISTS `lich_su_hoi_vien`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lich_su_hoi_vien` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nguoi_dung_id` int NOT NULL,
  `goi_hoi_vien_id` int NOT NULL,
  `ngay_dang_ky` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `ngay_het_han` timestamp NOT NULL,
  PRIMARY KEY (`id`),
  KEY `nguoi_dung_id` (`nguoi_dung_id`),
  KEY `goi_hoi_vien_id` (`goi_hoi_vien_id`),
  CONSTRAINT `lich_su_hoi_vien_ibfk_1` FOREIGN KEY (`nguoi_dung_id`) REFERENCES `nguoi_dung` (`id`) ON DELETE CASCADE,
  CONSTRAINT `lich_su_hoi_vien_ibfk_2` FOREIGN KEY (`goi_hoi_vien_id`) REFERENCES `goi_hoi_vien` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lich_su_hoi_vien`
--

LOCK TABLES `lich_su_hoi_vien` WRITE;
/*!40000 ALTER TABLE `lich_su_hoi_vien` DISABLE KEYS */;
INSERT INTO `lich_su_hoi_vien` VALUES (1,7,1,'2025-04-24 17:00:00','2025-05-24 17:00:00');
/*!40000 ALTER TABLE `lich_su_hoi_vien` ENABLE KEYS */;
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
  `hinh_anh_id` int DEFAULT NULL,
  `nguon_quyen_truy_cap` enum('MIEN_PHI','HOI_VIEN','MUA_LE') DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `nguoi_dung_id` (`nguoi_dung_id`),
  KEY `mau_powerpoint_id` (`mau_powerpoint_id`),
  KEY `fk_hinh_anh_id` (`hinh_anh_id`),
  CONSTRAINT `fk_hinh_anh_id` FOREIGN KEY (`hinh_anh_id`) REFERENCES `hinh_anh` (`id`) ON DELETE SET NULL,
  CONSTRAINT `lich_su_tai_xuong_ibfk_1` FOREIGN KEY (`nguoi_dung_id`) REFERENCES `nguoi_dung` (`id`) ON DELETE CASCADE,
  CONSTRAINT `lich_su_tai_xuong_ibfk_2` FOREIGN KEY (`mau_powerpoint_id`) REFERENCES `mau_powerpoint` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=61 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lich_su_tai_xuong`
--

LOCK TABLES `lich_su_tai_xuong` WRITE;
/*!40000 ALTER TABLE `lich_su_tai_xuong` DISABLE KEYS */;
INSERT INTO `lich_su_tai_xuong` VALUES (12,4,91,'2025-03-17 14:30:41',NULL,NULL),(14,5,91,'2025-03-21 17:00:00',NULL,NULL),(18,4,92,'2025-03-25 01:45:08',NULL,NULL),(19,9,94,'2025-03-25 01:45:08',NULL,NULL),(20,4,91,'2025-03-25 01:45:08',NULL,NULL),(21,9,92,'2025-03-25 02:49:12',NULL,NULL),(23,4,94,'2025-03-25 02:49:12',NULL,NULL),(24,9,91,'2025-03-25 02:49:58',NULL,NULL),(25,5,91,'2025-03-25 02:49:58',NULL,NULL),(26,4,94,'2025-03-25 02:49:58',NULL,NULL),(27,5,92,'2025-03-31 12:09:53',NULL,NULL),(28,NULL,91,'2025-04-04 01:00:01',NULL,NULL),(29,5,91,'2025-04-04 01:00:01',NULL,NULL),(30,4,94,'2025-04-04 01:00:01',NULL,NULL),(31,9,109,'2025-04-04 01:00:47',NULL,NULL),(34,9,122,'2025-04-04 01:13:22',NULL,NULL),(35,9,NULL,'2025-04-04 01:28:29',2,NULL),(37,9,NULL,'2025-04-04 01:32:41',NULL,NULL),(38,9,95,'2025-04-04 01:32:46',NULL,NULL),(39,9,NULL,'2025-04-04 01:35:33',NULL,NULL),(40,9,NULL,'2025-04-04 01:44:49',NULL,NULL),(41,9,NULL,'2025-04-04 01:44:56',2,NULL),(42,9,94,'2025-04-04 01:45:20',NULL,NULL),(43,9,107,'2025-04-04 01:46:49',NULL,NULL),(44,NULL,107,'2025-04-04 01:51:51',NULL,NULL),(45,NULL,NULL,'2025-04-04 01:51:57',NULL,NULL),(46,NULL,NULL,'2025-04-04 01:57:35',NULL,NULL),(47,9,NULL,'2025-04-04 02:18:00',6,NULL),(48,NULL,94,'2025-04-04 03:12:28',NULL,NULL),(49,9,NULL,'2025-04-07 09:51:18',4,NULL),(50,NULL,125,'2025-04-17 02:24:25',NULL,NULL),(51,NULL,134,'2025-04-17 02:24:32',NULL,NULL),(52,9,94,'2025-04-20 15:50:00',NULL,NULL),(53,9,109,'2025-04-21 03:38:12',NULL,NULL),(54,9,94,'2025-04-21 03:50:39',NULL,NULL),(55,NULL,92,'2025-04-21 04:50:16',NULL,NULL),(56,9,109,'2025-04-21 04:50:40',NULL,NULL),(57,7,109,'2025-04-25 11:20:54',NULL,'HOI_VIEN'),(58,8,110,'2025-04-25 11:20:54',NULL,'MUA_LE'),(59,9,109,'2025-04-25 11:20:54',NULL,'MIEN_PHI'),(60,NULL,94,'2025-05-05 14:39:57',NULL,NULL);
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
  `la_pro` tinyint(1) DEFAULT '0',
  `gia` decimal(10,3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `danh_muc_id` (`danh_muc_id`),
  CONSTRAINT `mau_powerpoint_ibfk_1` FOREIGN KEY (`danh_muc_id`) REFERENCES `danh_muc` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=137 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mau_powerpoint`
--

LOCK TABLES `mau_powerpoint` WRITE;
/*!40000 ALTER TABLE `mau_powerpoint` DISABLE KEYS */;
INSERT INTO `mau_powerpoint` VALUES (91,'Kid Education','Chúng tôi đã thiết kế mẫu chương trình đào tạo giáo dục trẻ em phong cách hoạt hình đơn giản phần mềm ppt mẫu chung này','/uploads/1743132057024.zip','http://localhost:1000/uploads/1742637858072.png',32,0,NULL),(92,'Educational Slides','Chúng tôi đã thiết kế mẫu chương trình đào tạo giáo dục trẻ em phong cách hoạt hình đơn giản phần mềm ppt mẫu chung này','/uploads/1744858058167.zip','http://localhost:1000/uploads/1743087457481.png',32,0,NULL),(94,'Powerpoint Noel','Slide được thiết kế với đêm giáng sinh, giáng sinh, bình an, rất nhiều bố cục hữu ích để tâm trí của bạn hiển thị rõ ràng hơn.','/uploads/1743131649571.zip','http://localhost:1000/uploads/1742639383797.png',33,1,3.000),(95,'Giáo dục','Latest AI trends presentation','/uploads/1743131887015.zip','http://localhost:1000/uploads/1742642439998.png',32,0,NULL),(97,'Giáo dục trẻ em','Chủ đề giáo dục trẻ em giúp trẻ tiếp thu nhanh','/uploads/1742637858025.pptx','http://localhost:1000/uploads/1742642467657.png',10,0,NULL),(103,'Giáo dục mầm non','Chủ đề giáo dục trẻ em giúp trẻ tiếp thu nhanh','/uploads/1742637858025.pptx','http://localhost:1000/uploads/1742642487119.png',13,0,NULL),(105,'AI','Powerpoint chủ đề về công nghệ AI','/uploads/1742637858025.pptx','http://localhost:1000/uploads/1742643881641.png',14,0,NULL),(107,'Mùa thu','Powerpoint chủ đề về mùa thu','/uploads/1742637858025.pptx','http://localhost:1000/uploads/1742639485244.png',17,0,NULL),(109,'Hoa Lavender','Powerpoint vè chủ đề hoa Lanvender đẹp mắt','/uploads/1745140062520.zip','http://localhost:1000/uploads/1742644193789.png',25,0,NULL),(110,'Tình yêu','Powerpoint ngày lễ tình nhân','/uploads/1742637858025.pptx','http://localhost:1000/uploads/1742648940694.png',33,0,NULL),(111,'AI','Powerpoint chủ đề về công nghệ AI','/uploads/1743437219971.zip','http://localhost:1000/uploads/1742649043456.png',10,0,NULL),(112,'AI','Powerpoint chủ đề về công nghệ AI','/uploads/1742637858025.pptx','http://localhost:1000/uploads/1742649062504.png',15,0,NULL),(113,'AI','Powerpoint chủ đề về công nghệ AI','/uploads/1742637858025.pptx','http://localhost:1000/uploads/1742649082305.png',10,0,NULL),(121,'Mùa xuân','Powerpoint chủ đề về công nghệ AI','/uploads/1742637858025.pptx','http://localhost:1000/uploads/1743088085882.png',24,0,NULL),(122,'Cây lúa','Powerpoint chủ đề về cây lúa','/uploads/1743131711634.zip','http://localhost:1000/uploads/1742865851057.png',16,0,NULL),(124,'Kiến thức y học','Powerpoint chủ đề về y học hỗ trợ thảo luận bệnh án','/uploads/1743422377865.zip','http://localhost:1000/uploads/1743086357729.png',15,0,NULL),(125,'Thiên nhiên','powerpoint chủ đề về thiên nhiên tươi đẹp','/uploads/1743422315321.pptx','http://localhost:1000/uploads/1743422315299.png',23,0,NULL),(127,'AI','Powerpoint chủ đề về công nghệ AI','/uploads/1743578820786.pptx','http://localhost:1000/uploads/1743578820760.png',24,0,NULL),(133,'Giáo Dục đào Tạo Giảng Dạy Mở Lớp Ppt Bài thuyết trình','Slide được thiết kế với chủ đề họp lớp ppt, họp lớp học kỳ mới, trường học, rất nhiều bố cục hữu ích để tâm trí của bạn hiển thị rõ ràng hơn.','/uploads/1743581081963.zip','http://localhost:1000/uploads/1743581081960.png',32,0,NULL),(134,'Ppt đào Tạo Giảng Dạy Văn Học Và Nghệ Thuật','mẫu ppt đào tạo giảng dạy văn học và nghệ thuật này khi chúng tôi quyết định thực hiện một chủ đề chuyên nghiệp','/uploads/1744020339686.zip','http://localhost:1000/uploads/1744020339682.png',27,0,NULL),(135,'Bản Trình Bày Trên Mạng Xã Hội Mẫu PowerPoint','Slide được thiết kế với công nghệ cao, 3d, hiện đại, rất nhiều bố cục hữu ích để tâm trí của bạn hiển thị rõ ràng hơn.','/uploads/1744728253009.zip','http://localhost:1000/uploads/1744728253005.png',10,0,NULL),(136,'Năng Lượng Mặt Trời Mẫu Mùa Hè','mẫu powerpoint này khi chúng tôi quyết định thực hiện một chủ đề chuyên nghiệp, và nó cho thấy! Slide được thiết kế với lễ hội mùa hè,','/uploads/1744730444170.zip','http://localhost:1000/uploads/1744730444163.png',33,0,NULL);
/*!40000 ALTER TABLE `mau_powerpoint` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mau_powerpoint_anh_chi_tiet`
--

DROP TABLE IF EXISTS `mau_powerpoint_anh_chi_tiet`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mau_powerpoint_anh_chi_tiet` (
  `id` int NOT NULL AUTO_INCREMENT,
  `mau_powerpoint_id` int NOT NULL,
  `duong_dan_anh` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `thu_tu` int DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `mau_powerpoint_id` (`mau_powerpoint_id`),
  CONSTRAINT `mau_powerpoint_anh_chi_tiet_ibfk_1` FOREIGN KEY (`mau_powerpoint_id`) REFERENCES `mau_powerpoint` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=252 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mau_powerpoint_anh_chi_tiet`
--

LOCK TABLES `mau_powerpoint_anh_chi_tiet` WRITE;
/*!40000 ALTER TABLE `mau_powerpoint_anh_chi_tiet` DISABLE KEYS */;
INSERT INTO `mau_powerpoint_anh_chi_tiet` VALUES (14,91,'/uploads/anh_chi_tiet/1743579470019.png',0),(15,91,'/uploads/anh_chi_tiet/1743579470034.png',1),(16,91,'/uploads/anh_chi_tiet/1743579470051.png',2),(17,91,'/uploads/anh_chi_tiet/1743579470071.png',3),(18,91,'/uploads/anh_chi_tiet/1743579470094.png',4),(19,91,'/uploads/anh_chi_tiet/1743579470116.png',5),(20,91,'/uploads/anh_chi_tiet/1743579470135.png',6),(21,91,'/uploads/anh_chi_tiet/1743579470152.png',7),(22,94,'/uploads/anh_chi_tiet/1743580470986.png',3),(23,94,'/uploads/anh_chi_tiet/1743580470990.png',4),(24,94,'/uploads/anh_chi_tiet/1743580470996.png',5),(25,94,'/uploads/anh_chi_tiet/1743580470969.png',0),(26,94,'/uploads/anh_chi_tiet/1743580470973.png',1),(27,94,'/uploads/anh_chi_tiet/1743580470983.png',2),(28,94,'/uploads/anh_chi_tiet/1743580471040.png',6),(29,94,'/uploads/anh_chi_tiet/1743580471056.png',8),(30,94,'/uploads/anh_chi_tiet/1743580471070.png',9),(31,94,'/uploads/anh_chi_tiet/1743580471101.png',11),(32,94,'/uploads/anh_chi_tiet/1743580471097.png',10),(33,94,'/uploads/anh_chi_tiet/1743580471047.png',7),(34,94,'/uploads/anh_chi_tiet/1743580471117.png',12),(37,133,'/uploads/anh_chi_tiet/1743581082028.png',3),(38,133,'/uploads/anh_chi_tiet/1743581082034.png',5),(39,133,'/uploads/anh_chi_tiet/1743581082033.png',4),(40,133,'/uploads/anh_chi_tiet/1743581082010.png',0),(41,133,'/uploads/anh_chi_tiet/1743581082050.png',6),(42,133,'/uploads/anh_chi_tiet/1743581082016.png',1),(43,133,'/uploads/anh_chi_tiet/1743581082025.png',2),(44,133,'/uploads/anh_chi_tiet/1743581082071.png',7),(45,95,'/uploads/anh_chi_tiet/1743687220748.png',0),(46,95,'/uploads/anh_chi_tiet/1743687220754.png',1),(47,95,'/uploads/anh_chi_tiet/1743687220773.png',4),(48,95,'/uploads/anh_chi_tiet/1743687220770.png',3),(49,95,'/uploads/anh_chi_tiet/1743687220757.png',2),(50,95,'/uploads/anh_chi_tiet/1743687220777.png',6),(51,95,'/uploads/anh_chi_tiet/1743687220813.png',5),(52,95,'/uploads/anh_chi_tiet/1743687220853.png',11),(53,95,'/uploads/anh_chi_tiet/1743687220847.png',8),(54,95,'/uploads/anh_chi_tiet/1743687220843.png',7),(55,95,'/uploads/anh_chi_tiet/1743687220860.png',10),(56,95,'/uploads/anh_chi_tiet/1743687220850.png',9),(57,107,'/uploads/anh_chi_tiet/1743687265881.png',3),(58,107,'/uploads/anh_chi_tiet/1743687265885.png',4),(59,107,'/uploads/anh_chi_tiet/1743687265865.png',0),(60,107,'/uploads/anh_chi_tiet/1743687265868.png',1),(61,107,'/uploads/anh_chi_tiet/1743687265913.png',6),(62,107,'/uploads/anh_chi_tiet/1743687265871.png',2),(63,107,'/uploads/anh_chi_tiet/1743687265923.png',7),(64,107,'/uploads/anh_chi_tiet/1743687265942.png',8),(65,107,'/uploads/anh_chi_tiet/1743687265888.png',5),(66,107,'/uploads/anh_chi_tiet/1743687265956.png',9),(67,107,'/uploads/anh_chi_tiet/1743687265978.png',10),(68,112,'/uploads/anh_chi_tiet/1743687299305.png',0),(69,112,'/uploads/anh_chi_tiet/1743687299314.png',2),(70,112,'/uploads/anh_chi_tiet/1743687299309.png',1),(71,112,'/uploads/anh_chi_tiet/1743687299321.png',4),(72,112,'/uploads/anh_chi_tiet/1743687299327.png',3),(73,112,'/uploads/anh_chi_tiet/1743687299323.png',5),(74,112,'/uploads/anh_chi_tiet/1743687299347.png',6),(75,112,'/uploads/anh_chi_tiet/1743687299360.png',7),(76,112,'/uploads/anh_chi_tiet/1743687299371.png',8),(77,112,'/uploads/anh_chi_tiet/1743687299377.png',9),(78,112,'/uploads/anh_chi_tiet/1743687299404.png',11),(79,112,'/uploads/anh_chi_tiet/1743687299389.png',10),(80,112,'/uploads/anh_chi_tiet/1743687299409.png',12),(81,112,'/uploads/anh_chi_tiet/1743687299416.png',13),(82,122,'/uploads/anh_chi_tiet/1743687341322.png',4),(83,122,'/uploads/anh_chi_tiet/1743687341319.png',3),(84,122,'/uploads/anh_chi_tiet/1743687341327.png',5),(85,122,'/uploads/anh_chi_tiet/1743687341307.png',1),(86,122,'/uploads/anh_chi_tiet/1743687341313.png',2),(87,122,'/uploads/anh_chi_tiet/1743687341304.png',0),(88,122,'/uploads/anh_chi_tiet/1743687341365.png',7),(89,122,'/uploads/anh_chi_tiet/1743687341495.png',8),(90,122,'/uploads/anh_chi_tiet/1743687341504.png',10),(91,122,'/uploads/anh_chi_tiet/1743687341508.png',11),(92,122,'/uploads/anh_chi_tiet/1743687341498.png',9),(93,122,'/uploads/anh_chi_tiet/1743687341361.png',6),(94,122,'/uploads/anh_chi_tiet/1743687341608.png',12),(95,122,'/uploads/anh_chi_tiet/1743687341611.png',13),(96,125,'/uploads/anh_chi_tiet/1743687378184.png',0),(97,125,'/uploads/anh_chi_tiet/1743687378193.png',2),(98,125,'/uploads/anh_chi_tiet/1743687378208.png',5),(99,125,'/uploads/anh_chi_tiet/1743687378195.png',3),(100,125,'/uploads/anh_chi_tiet/1743687378199.png',4),(101,125,'/uploads/anh_chi_tiet/1743687378189.png',1),(102,125,'/uploads/anh_chi_tiet/1743687378247.png',6),(103,125,'/uploads/anh_chi_tiet/1743687378250.png',7),(104,125,'/uploads/anh_chi_tiet/1743687378260.png',8),(105,125,'/uploads/anh_chi_tiet/1743687378270.png',9),(106,125,'/uploads/anh_chi_tiet/1743687378289.png',11),(107,125,'/uploads/anh_chi_tiet/1743687378280.png',10),(108,125,'/uploads/anh_chi_tiet/1743687378301.png',12),(109,125,'/uploads/anh_chi_tiet/1743687378315.png',13),(110,91,'/uploads/anh_chi_tiet/1743687402544.png',0),(111,91,'/uploads/anh_chi_tiet/1743687402547.png',1),(112,91,'/uploads/anh_chi_tiet/1743687402556.png',2),(113,91,'/uploads/anh_chi_tiet/1743687402554.png',3),(114,94,'/uploads/anh_chi_tiet/1743687440138.png',1),(115,94,'/uploads/anh_chi_tiet/1743687440141.png',2),(116,94,'/uploads/anh_chi_tiet/1743687440145.png',3),(117,94,'/uploads/anh_chi_tiet/1743687440151.png',5),(118,94,'/uploads/anh_chi_tiet/1743687440134.png',0),(119,94,'/uploads/anh_chi_tiet/1743687440149.png',4),(120,94,'/uploads/anh_chi_tiet/1743687440175.png',6),(121,94,'/uploads/anh_chi_tiet/1743687440188.png',7),(122,94,'/uploads/anh_chi_tiet/1743687440218.png',8),(123,134,'/uploads/anh_chi_tiet/1744020339752.png',4),(124,134,'/uploads/anh_chi_tiet/1744020339747.png',3),(125,134,'/uploads/anh_chi_tiet/1744020339760.png',5),(126,134,'/uploads/anh_chi_tiet/1744020339721.png',0),(127,134,'/uploads/anh_chi_tiet/1744020339739.png',2),(128,134,'/uploads/anh_chi_tiet/1744020339728.png',1),(129,134,'/uploads/anh_chi_tiet/1744020339811.png',7),(130,134,'/uploads/anh_chi_tiet/1744020339820.png',8),(131,134,'/uploads/anh_chi_tiet/1744020339827.png',9),(132,134,'/uploads/anh_chi_tiet/1744020339841.png',11),(133,134,'/uploads/anh_chi_tiet/1744020339849.png',12),(134,134,'/uploads/anh_chi_tiet/1744020339802.png',6),(135,134,'/uploads/anh_chi_tiet/1744020339872.png',13),(136,134,'/uploads/anh_chi_tiet/1744020339882.png',15),(137,134,'/uploads/anh_chi_tiet/1744020339889.png',16),(138,134,'/uploads/anh_chi_tiet/1744020339833.png',10),(139,134,'/uploads/anh_chi_tiet/1744020339907.png',17),(140,134,'/uploads/anh_chi_tiet/1744020339865.png',14),(141,134,'/uploads/anh_chi_tiet/1744020339922.png',19),(142,134,'/uploads/anh_chi_tiet/1744020339932.png',21),(143,134,'/uploads/anh_chi_tiet/1744020339952.png',20),(144,134,'/uploads/anh_chi_tiet/1744020339915.png',18),(145,134,'/uploads/anh_chi_tiet/1744020339945.png',22),(146,135,'/uploads/anh_chi_tiet/1744728253072.png',1),(147,135,'/uploads/anh_chi_tiet/1744728253067.png',0),(148,135,'/uploads/anh_chi_tiet/1744728253077.png',2),(149,135,'/uploads/anh_chi_tiet/1744728253097.png',5),(150,135,'/uploads/anh_chi_tiet/1744728253092.png',4),(151,135,'/uploads/anh_chi_tiet/1744728253087.png',3),(152,135,'/uploads/anh_chi_tiet/1744728253135.png',6),(153,135,'/uploads/anh_chi_tiet/1744728253144.png',7),(154,135,'/uploads/anh_chi_tiet/1744728253151.png',8),(155,135,'/uploads/anh_chi_tiet/1744728253158.png',9),(156,135,'/uploads/anh_chi_tiet/1744728253164.png',10),(157,135,'/uploads/anh_chi_tiet/1744728253173.png',12),(158,135,'/uploads/anh_chi_tiet/1744728253183.png',11),(159,135,'/uploads/anh_chi_tiet/1744728253199.png',13),(160,135,'/uploads/anh_chi_tiet/1744728253203.png',14),(161,135,'/uploads/anh_chi_tiet/1744728253209.png',15),(162,135,'/uploads/anh_chi_tiet/1744728253224.png',16),(163,135,'/uploads/anh_chi_tiet/1744728253227.png',17),(164,135,'/uploads/anh_chi_tiet/1744728253248.png',20),(165,135,'/uploads/anh_chi_tiet/1744728253242.png',18),(166,135,'/uploads/anh_chi_tiet/1744728253258.png',19),(167,135,'/uploads/anh_chi_tiet/1744728253271.png',22),(168,135,'/uploads/anh_chi_tiet/1744728253290.png',24),(169,135,'/uploads/anh_chi_tiet/1744728253281.png',21),(170,135,'/uploads/anh_chi_tiet/1744728253300.png',23),(171,135,'/uploads/anh_chi_tiet/1744728253307.png',25),(172,135,'/uploads/anh_chi_tiet/1744728253323.png',26),(173,136,'/uploads/anh_chi_tiet/1744730444299.png',0),(174,136,'/uploads/anh_chi_tiet/1744730444318.png',3),(175,136,'/uploads/anh_chi_tiet/1744730444302.png',1),(176,136,'/uploads/anh_chi_tiet/1744730444324.png',4),(177,136,'/uploads/anh_chi_tiet/1744730444331.png',5),(178,136,'/uploads/anh_chi_tiet/1744730444315.png',2),(179,136,'/uploads/anh_chi_tiet/1744730444383.png',6),(180,136,'/uploads/anh_chi_tiet/1744730444414.png',8),(181,136,'/uploads/anh_chi_tiet/1744730444399.png',7),(182,136,'/uploads/anh_chi_tiet/1744730444422.png',9),(183,136,'/uploads/anh_chi_tiet/1744730444432.png',11),(184,136,'/uploads/anh_chi_tiet/1744730444439.png',12),(185,136,'/uploads/anh_chi_tiet/1744730444502.png',10),(186,136,'/uploads/anh_chi_tiet/1744730444487.png',13),(187,136,'/uploads/anh_chi_tiet/1744730444515.png',14),(188,136,'/uploads/anh_chi_tiet/1744730444519.png',15),(189,136,'/uploads/anh_chi_tiet/1744730444521.png',16),(190,136,'/uploads/anh_chi_tiet/1744730444533.png',17),(191,136,'/uploads/anh_chi_tiet/1744730444556.png',18),(192,136,'/uploads/anh_chi_tiet/1744730444571.png',19),(193,136,'/uploads/anh_chi_tiet/1744730444574.png',20),(194,92,'/uploads/anh_chi_tiet/1744858058219.png',0),(195,92,'/uploads/anh_chi_tiet/1744858058249.png',5),(196,92,'/uploads/anh_chi_tiet/1744858058245.png',4),(197,92,'/uploads/anh_chi_tiet/1744858058230.png',2),(198,92,'/uploads/anh_chi_tiet/1744858058239.png',3),(199,92,'/uploads/anh_chi_tiet/1744858058223.png',1),(200,92,'/uploads/anh_chi_tiet/1744858058312.png',6),(201,92,'/uploads/anh_chi_tiet/1744858058319.png',7),(202,92,'/uploads/anh_chi_tiet/1744858058325.png',9),(203,92,'/uploads/anh_chi_tiet/1744858058332.png',10),(204,92,'/uploads/anh_chi_tiet/1744858058323.png',8),(205,92,'/uploads/anh_chi_tiet/1744858058341.png',14),(206,92,'/uploads/anh_chi_tiet/1744858058355.png',13),(207,92,'/uploads/anh_chi_tiet/1744858058386.png',12),(208,92,'/uploads/anh_chi_tiet/1744858058399.png',15),(209,92,'/uploads/anh_chi_tiet/1744858058390.png',11),(210,92,'/uploads/anh_chi_tiet/1744858058403.png',16),(211,92,'/uploads/anh_chi_tiet/1744858058406.png',17),(212,92,'/uploads/anh_chi_tiet/1744858058468.png',21),(213,92,'/uploads/anh_chi_tiet/1744858058445.png',19),(214,92,'/uploads/anh_chi_tiet/1744858058457.png',20),(215,92,'/uploads/anh_chi_tiet/1744858058475.png',22),(216,92,'/uploads/anh_chi_tiet/1744858058437.png',18),(217,92,'/uploads/anh_chi_tiet/1744858058473.png',23),(218,109,'/uploads/anh_chi_tiet/1745140028907.png',5),(219,109,'/uploads/anh_chi_tiet/1745140028871.png',0),(220,109,'/uploads/anh_chi_tiet/1745140028902.png',4),(221,109,'/uploads/anh_chi_tiet/1745140028892.png',2),(222,109,'/uploads/anh_chi_tiet/1745140028887.png',1),(223,109,'/uploads/anh_chi_tiet/1745140028896.png',3),(224,109,'/uploads/anh_chi_tiet/1745140028971.png',6),(225,109,'/uploads/anh_chi_tiet/1745140028980.png',7),(226,109,'/uploads/anh_chi_tiet/1745140029001.png',9),(227,109,'/uploads/anh_chi_tiet/1745140029008.png',10),(228,109,'/uploads/anh_chi_tiet/1745140028992.png',8),(229,109,'/uploads/anh_chi_tiet/1745140029038.png',12),(230,109,'/uploads/anh_chi_tiet/1745140029057.png',13),(231,109,'/uploads/anh_chi_tiet/1745140029063.png',14),(232,109,'/uploads/anh_chi_tiet/1745140029011.png',11),(233,109,'/uploads/anh_chi_tiet/1745140029071.png',15),(234,109,'/uploads/anh_chi_tiet/1745140029109.png',17),(235,109,'/uploads/anh_chi_tiet/1745140029082.png',16),(236,109,'/uploads/anh_chi_tiet/1745140029147.png',20),(237,109,'/uploads/anh_chi_tiet/1745140029131.png',18),(238,109,'/uploads/anh_chi_tiet/1745140029158.png',21),(239,109,'/uploads/anh_chi_tiet/1745140029173.png',22),(240,109,'/uploads/anh_chi_tiet/1745140029185.png',23),(241,109,'/uploads/anh_chi_tiet/1745140029145.png',19),(242,109,'/uploads/anh_chi_tiet/1745140029211.png',24),(243,109,'/uploads/anh_chi_tiet/1745140029226.png',25),(244,109,'/uploads/anh_chi_tiet/1745140029259.png',27),(245,109,'/uploads/anh_chi_tiet/1745140029279.png',28),(246,109,'/uploads/anh_chi_tiet/1745140029310.png',29),(247,109,'/uploads/anh_chi_tiet/1745140029330.png',30),(248,109,'/uploads/anh_chi_tiet/1745140029240.png',26),(249,109,'/uploads/anh_chi_tiet/1745140029339.png',31),(250,109,'/uploads/anh_chi_tiet/1745140029354.png',32),(251,109,'/uploads/anh_chi_tiet/1745140029371.png',33);
/*!40000 ALTER TABLE `mau_powerpoint_anh_chi_tiet` ENABLE KEYS */;
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
  `thoi_gian_het_han_hoi_vien` timestamp NULL DEFAULT NULL,
  `so_dien_thoai` varchar(15) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nguoi_dung`
--

LOCK TABLES `nguoi_dung` WRITE;
/*!40000 ALTER TABLE `nguoi_dung` DISABLE KEYS */;
INSERT INTO `nguoi_dung` VALUES (4,'Nguyen Van A','nguyenvana@example.com','password123','User',NULL,NULL),(5,'Tran Thi B','tranthib@example.com','password123','User',NULL,NULL),(6,'Le Van C','levanc@example.com','password123','User',NULL,NULL),(7,'Nguyen Van B','test@example.com','$2b$10$zaUFN3nMmQbYQYiNzJSKpu2QkhW83Wg/oCigDam1/otmsw1rjj0CG','User',NULL,NULL),(8,'admin','admin@xpoint.com','$2b$10$BijOF709Wa0c4fED6pVANuC5N164TR7bLQJE.ASRezSvCU/EL4KZe','Admin',NULL,NULL),(9,'xuan','xuan@xpoint.com','$2b$10$BeiAMXBc2284eadsAQotLOiyWSYIU4YIgna7p1ni35eOEGjRPPfYa','Admin',NULL,NULL),(10,'linh','1234@gmail.com','$2b$10$KbOK3d8.ZCkLSEknT4Sv/ezFoY6rT4RmuzoMjSIOymQKKAbo/QoVy','User',NULL,NULL),(11,'quynh','quynhquynh@gmail.com','$2b$10$ylI0Bgb5oy3kafBLPKcwTOaVR5h57puO5YRiPcMejWurLIsxUMJvO','User',NULL,NULL),(12,'trang','trang@gmail.com','$2b$10$yQAsEWCE8gkKfcPssL5k8OW77o4NJFHp9NaCGk3HFVnfxbwrFbqwe',NULL,NULL,NULL);
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

-- Dump completed on 2025-05-06  8:39:43
