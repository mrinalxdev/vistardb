package api

import (
	"encoding/json"
	"net/http"
	"vistardb/internal/cluster"
)

func NewRouter(node *cluster.Node) *http.ServeMux {
	mux := http.NewServeMux()
	
	mux.HandleFunc("/status", func(w http.ResponseWriter, r *http.Request) {
		status := node.GetStatus()
		json.NewEncoder(w).Encode(status)
	})
	
	mux.HandleFunc("/tables", func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			tables := node.Store.ListTables()
			json.NewEncoder(w).Encode(tables)
		case http.MethodPost:
			var body struct {
				Name string `json:"name"`
			}
			if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
				http.Error(w, err.Error(), http.StatusBadRequest)
				return
			}
			
			if err := node.Store.CreateTable(body.Name); err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			
			w.WriteHeader(http.StatusCreated)
		default:
			w.WriteHeader(http.StatusMethodNotAllowed)
		}
	})
	
	mux.HandleFunc("/tables/", func(w http.ResponseWriter, r *http.Request) {
		tableName := r.URL.Path[len("/tables/"):]
		
		switch r.Method {
		case http.MethodGet:
			records, err := node.Store.GetAll(tableName)
			if err != nil {
				http.Error(w, err.Error(), http.StatusNotFound)
				return
			}
			
			json.NewEncoder(w).Encode(records)
		case http.MethodPost:
			var record map[string]interface{}
			if err := json.NewDecoder(r.Body).Decode(&record); err != nil {
				http.Error(w, err.Error(), http.StatusBadRequest)
				return
			}
			
			id, err := node.Store.Insert(tableName, record)
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			
			response := map[string]string{"id": id}
			json.NewEncoder(w).Encode(response)
		default:
			w.WriteHeader(http.StatusMethodNotAllowed)
		}
	})
	
	return mux
}