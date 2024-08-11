package controllers

import (
    "net/http"
    "github.com/gin-gonic/gin"
    "girish/lrucaching/models"
    "time"
)

// GetHandler returns a Gin handler function for getting a cached item
func GetHandler(cache *models.LruCache) gin.HandlerFunc {
    return func(c *gin.Context) {
        key := c.Param("key")
        value, found := Get(key, cache)
        if found {
            c.JSON(http.StatusOK, gin.H{
                "key":   key,
                "value": value,
            })
        } else {
            // Check if the key existed but expired
            _, exists := cache.Data[key]
            if exists {
                c.JSON(http.StatusNotFound, gin.H{
                    "error": "Key may have expired",
                })
            } else {
                c.JSON(http.StatusNotFound, gin.H{
                    "error": "Key does not exist or may have expired",
                })
            }
        }
    }
}

// Get retrieves the value for the given key from the cache.
func Get(key string, cache *models.LruCache) (interface{}, bool) {
    cache.Mutex.Lock()
    defer cache.Mutex.Unlock()

    element, found := cache.Data[key]
    if !found {
        return nil, false
    }

    dataItem := element.Value.(*models.Data)

    // Check if the item is expired
    if time.Now().UnixMilli() > dataItem.Timeout {
        cache.Queue.Remove(element)
        delete(cache.Data, key)
        return nil, false
    }

    // Move the item to the front of the queue to mark it as recently used
    cache.Queue.MoveToFront(element)
    
    return dataItem.Value, true
}
