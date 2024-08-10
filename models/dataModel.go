package models


//Key-Value structure, Storing the Expiry time here as well

type Data struct{
	Key string 
	Value interface{} 
	Timeout int64
}