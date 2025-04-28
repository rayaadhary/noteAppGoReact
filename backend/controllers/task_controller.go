package controllers

import (
	"backend/config"
	"backend/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func CreateTask(ctx *gin.Context) {
	var input models.Task

	if err := ctx.ShouldBindJSON(&input); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}

	userId, _ := ctx.Get("user_id")

	task := models.Task{
		Title:   input.Title,
		Content: input.Content,
		UserID:  userId.(uint),
	}

	config.DB.Create(&task)
	ctx.JSON(http.StatusOK, gin.H{"message": "Task created successfully!"})
}

func GetTasks(ctx *gin.Context) {
	userId, _ := ctx.Get("user_id")
	var tasks []models.Task

	config.DB.Where("user_id = ?", userId.(uint)).Find(&tasks)
	ctx.JSON(http.StatusOK, gin.H{"tasks": tasks})
}

func UpdateTask(c *gin.Context) {
	var task models.Task
	id := c.Param("id")

	if err := config.DB.First(&task, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Task not found"})
		return
	}

	var input models.Task
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	config.DB.Model(&task).Updates(models.Task{Title: input.Title, Content: input.Content})
	c.JSON(http.StatusOK, gin.H{"message": "Task updated!", "task": task})
}

func DeleteTask(c *gin.Context) {
	var task models.Task
	id := c.Param("id")

	if err := config.DB.First(&task, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Task not found"})
		return
	}

	config.DB.Delete(&task)
	c.JSON(http.StatusOK, gin.H{"message": "Task deleted!"})
}
