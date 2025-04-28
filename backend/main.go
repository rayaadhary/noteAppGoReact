package main

import (
	"backend/config"
	"backend/routes"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/rs/cors"
)

func main() {
	r := gin.Default()

	// Connect Database
	config.ConnectDB()

	// Setup Routes
	routes.SetupRoutes(r)

	// Bikin CORS middleware dari rs/cors
	corsOptions := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: true,
	})

	// Bungkus r (Gin) pake CORS handler
	handler := corsOptions.Handler(r)

	// Jalanin server pake handler yang udah dibungkus CORS
	http.ListenAndServe(":8080", handler)
}
