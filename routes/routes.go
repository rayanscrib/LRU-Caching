package routes

import (
	"girish/lrucaching/models"

	"github.com/gin-gonic/gin"

	"girish/lrucaching/controllers"
)

//Defining both of my routes here, im using gin 
func StartRoutes(r *gin.Engine, cache *models.LruCache) {
	r.POST("girishLru/setKey", controllers.SetHandler(cache))
	r.GET("girishLru/get/:key", controllers.GetHandler(cache))
}
