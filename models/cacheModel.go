package models

import (	
	"container/list"
	"sync"
)

//Cache structure, Storing the capapcity of the queue
//Using mutex to handle concurrency of go routines
type LruCache struct{
    Data     map[string]*list.Element 
	Capacity int
	Queue *list.List
	Mutex  sync.Mutex
}