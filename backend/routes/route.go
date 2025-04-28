package routes

import (
	"backend/controllers"
	middleware "backend/middlewares"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine) {
	api := r.Group("/api")

	api.OPTIONS("/*path", func(c *gin.Context) {
		c.AbortWithStatus(204)
	})

	{
		api.GET("/ping", func(ctx *gin.Context) {
			ctx.JSON(200, gin.H{
				"message": "pong",
			})
		})

		api.POST("/register", controllers.Register)
		api.POST("/login", controllers.Login)

		protected := api.Group("/")
		protected.Use(middleware.JWTAuthMiddleware())
		{
			protected.POST("/tasks", controllers.CreateTask)
			protected.GET("/tasks", controllers.GetTasks)
			protected.PUT("/tasks/:id", controllers.UpdateTask)
			protected.DELETE("/tasks/:id", controllers.DeleteTask)
		}

	}
}
