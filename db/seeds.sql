-- MySQL dump 10.13  Distrib 8.0.27, for macos12.0 (arm64)
-- ------------------------------------------------------
-- Server version	5.7.34-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `book`
--

DROP TABLE IF EXISTS `book`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `book` (
  `idx` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `publisher` varchar(255) NOT NULL,
  `author` varchar(255) NOT NULL,
  `isbn` varchar(255) NOT NULL,
  PRIMARY KEY (`idx`)
) ENGINE=MyISAM AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `book`
--

LOCK TABLES `book` WRITE;
/*!40000 ALTER TABLE `book` DISABLE KEYS */;
INSERT INTO `book` VALUES (1,'[POD] 스타트업 투자유치&IR 마스터링','부크크(bookk)','김민성 지음','9791127290405'),(2,'101가지 비즈니스 모델 이야기','한즈미디어(한스미디어)','남대일 외 지음','9791160074932'),(3,'10인 이하 회사를 경영하는 법','페이퍼로드','이시노 세이이치 지음, 김상헌 옮김','9791190475129'),(4,'12가지 인생의 법칙 (반양장)','메이븐','조던 B. 피터슨 지음, 강주헌 옮김','9791196067694'),(5,'1등 브랜드는 이렇게 만드는 겁니다','북클라우드','김유림.박준회 지음','9791158462888'),(6,'1만 시간의 재발견','비즈니스북스','안데르스 에릭슨.로버트 풀 지음, 강혜정 옮김','9791186805282'),(7,'1분 전달력','움직이는서재','이토 요이치 지음, 노경아 옮김','9791186592489'),(8,'1인 기업을 한다는 것','센시오','이치엔 가쓰히코 지음, 박재영 옮김','9791190356558'),(9,'1일 1페이지, 세상에서 가장 짧은 교양 수업 365','위즈덤하우스','데이비드 키더.노아 D. 오펜하임 지음, 허성심 옮김','9791190305679'),(10,'2030 창업 길라잡이','ceomaker(씨이오메이커)','홍진우 외 지음','9791196701888');
/*!40000 ALTER TABLE `book` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `book_borrow`
--

DROP TABLE IF EXISTS `book_borrow`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `book_borrow` (
  `idx` int(11) NOT NULL AUTO_INCREMENT,
  `user_idx` int(11) NOT NULL,
  `book_idx` int(11) NOT NULL,
  `borrow_date` date NOT NULL,
  `return_date` date DEFAULT NULL,
  PRIMARY KEY (`idx`)
) ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `book_user`
--

DROP TABLE IF EXISTS `book_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `book_user` (
  `idx` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `seat` varchar(255) NOT NULL,
  `overdue` date DEFAULT NULL,
  PRIMARY KEY (`idx`)
) ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `kakao_chat_request`
--

DROP TABLE IF EXISTS `kakao_chat_request`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kakao_chat_request` (
  `idx` int(11) NOT NULL AUTO_INCREMENT,
  `con` text NOT NULL,
  PRIMARY KEY (`idx`)
) ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
