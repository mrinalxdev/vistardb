package main

import (
	"log"
	"net/http"
	"vistardb/internal/api"
	"vistardb/internal/cluster"
	"vistardb/internal/storage"

	"github.com/rs/cors"
)

func main() {
	// Initialize storage engine
	store := storage.NewMemoryStorage()
	
	// Initialize cluster nodes
	node := cluster.NewNode("node-1", "localhost:8080", store)
	
	// Setup API routes
	router := api.NewRouter(node)
	
	// Configure CORS
	c := cors.New(cors.Options{
		AllowedOrigins: []string{"http://localhost:5173"},
		AllowedMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders: []string{"Content-Type"},
		Debug:          true,
	})
	
	handler := c.Handler(router)
	
	log.Println("Starting server on :8080")
	log.Fatal(http.ListenAndServe(":8080", handler))

}