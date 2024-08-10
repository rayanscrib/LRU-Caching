package controllers

import (
	"fmt"
	"girish/lrucaching/models"
	"net/http"
	"time"
	"github.com/gin-gonic/gin"
)

//SetHandler funciton gets the Json, sets the expiry from now to the expired seconds provided
func SetHandler(cache *models.LruCache) gin.HandlerFunc {
	return func(c *gin.Context) {
		var requestBody *models.Data
		if err := c.BindJSON(&requestBody); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Request Payload is invalid"})
			return
		}
		expiration := time.Now().UnixMilli() + requestBody.Timeout
		Set(requestBody.Key, requestBody.Value, expiration, cache)
		c.JSON(http.StatusOK, gin.H{"message": "Cache Entry as been set"})
	}
}

func Set(key string, value interface{}, timeout int64, cache *models.LruCache) {
	cache.Mutex.Lock()
	defer cache.Mutex.Unlock()

	expiration := time.Now().Unix() + timeout

    //If the key already exists, then updating the value and pushing to the front of queueu
	if element, found := cache.Data[key]; found {
		data := element.Value.(*models.Data)
		data.Value = value
		data.Timeout = expiration

		fmt.Printf("Updating existing item: Key='%s', Old Value='%v', New Value='%v', Old Timeout=%d, New Timeout=%d\n",
			key, data.Value, value, data.Timeout, expiration)

		cache.Queue.MoveToFront(element)
		fmt.Println("Element moved to front:", element)
		return
	}

	//If the cache is full, removing the oldest item
	if cache.Queue.Len() >= cache.Capacity {
		oldest := cache.Queue.Back()
		if oldest != nil {
			oldestKey := oldest.Value.(*models.Data).Key
			cache.Queue.Remove(oldest)
			delete(cache.Data, oldestKey)
			fmt.Printf("Removed oldest item: Key='%s'\n", oldestKey)
		}
	}

	//Create a new cache item, Data model
	item := &models.Data{
		Key:     key,
		Value:   value,
		Timeout: expiration,
	}

	fmt.Printf("Adding new item: Key='%s', Value='%v', Timeout=%d\n", key, value, expiration)

	// Add the new item to the front of the queue
	element := cache.Queue.PushFront(item)
	cache.Data[key] = element
	fmt.Printf("New cache item added: Key='%s', Value='%v', Timeout=%d\n", key, item.Value, item.Timeout)
}
