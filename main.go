package main

import (
	"girish/lrucaching/models"      
	"github.com/gin-gonic/gin"
	"girish/lrucaching/routes"
	"container/list"
	"github.com/gin-contrib/cors"

)


//Contstructor for the cache
func initLruCache() *models.LruCache {
	return &models.LruCache{
		Data:     make(map[string]*list.Element),
		Capacity: 1024,
		Queue:    list.New(),
	}
}


//main function
func main() {
	cache := initLruCache()

	route := gin.Default()
	route.Use(cors.New(cors.Config{
		AllowOrigins: []string{"http://localhost:3000"},
		AllowMethods: []string{"GET", "POST"},
		AllowHeaders: []string{"Content-Type"},
	}))

	routes.StartRoutes(route, cache) // Redirecting cache to the routes

	route.Run(":8080")
}
