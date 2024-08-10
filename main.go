package main

import (
	"girish/lrucaching/models"      
	"github.com/gin-gonic/gin"
	"girish/lrucaching/routes"
	"container/list"
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
	routes.StartRoutes(route, cache) // Redirecting cache to the routes

	route.Run(":8080")
}
