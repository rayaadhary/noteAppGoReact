package controllers

import (
	"backend/config"
	"backend/models"
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

func CreateTask(ctx *gin.Context) {
	var input models.Task

	if err := ctx.ShouldBindJSON(&input); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userId, _ := ctx.Get("user_id")

	task := models.Task{
		Title:   input.Title,
		Content: input.Content,
		UserID:  userId.(uint),
	}

	config.DB.Create(&task)

	cacheKey := fmt.Sprintf("tasks:user:%d", task.UserID)
	config.RedisClient.Del(context.Background(), cacheKey)

	ctx.JSON(http.StatusOK, gin.H{"task": task, "source": "db"})
}

func GetTasks(ctx *gin.Context) {
	userId, _ := ctx.Get("user_id")
	uid := fmt.Sprintf("%v", userId)

	cacheKey := "tasks:user:" + uid
	var tasks []models.Task

	cached, err := config.RedisClient.Get(context.Background(), cacheKey).Result()
	if err == nil {
		if err := json.Unmarshal([]byte(cached), &tasks); err == nil {
			ctx.JSON(http.StatusOK, gin.H{"tasks": tasks, "source": "cache"})
			return
		}
	}

	config.DB.Where("user_id = ?", userId.(uint)).Find(&tasks)

	jsonTasks, _ := json.Marshal(tasks)
	config.RedisClient.Set(context.Background(), cacheKey, jsonTasks, 10*time.Minute)

	ctx.JSON(http.StatusOK, gin.H{"tasks": tasks, "source": "db"})
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

	cacheKey := fmt.Sprintf("tasks:user:%d", task.UserID)
	config.RedisClient.Del(context.Background(), cacheKey)

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
	cacheKey := fmt.Sprintf("tasks:user:%d", task.UserID)
	config.RedisClient.Del(context.Background(), cacheKey)

	c.JSON(http.StatusOK, gin.H{"message": "Task deleted!"})
}
