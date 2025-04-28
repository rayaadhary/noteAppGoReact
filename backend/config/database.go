package config

import (
	"backend/models"
	"fmt"
	"log"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDB() {
	dsn := "root:@tcp(127.0.0.1:3306)/backend_go?charset=utf8mb4&parseTime=True&loc=Local"
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})

	if err != nil {
		log.Fatal("Gagal koneksi database!", err)
	}

	DB = db
	fmt.Println("Database berhasil terkoneksi!")
	db.AutoMigrate(&models.User{}, &models.Task{})
}
