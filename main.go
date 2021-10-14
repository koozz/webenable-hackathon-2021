package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"math"
	"math/rand"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/gorilla/mux"

	"github.com/prometheus/client_golang/api"
	v1 "github.com/prometheus/client_golang/api/prometheus/v1"
)

type AudioParams struct {
	Bpm int64 `json:"bpm,omitempty"`
}

func main() {
	router := mux.NewRouter()

	// Serving audio-params (bpm)
	v1api := prometheusApi()
	router.PathPrefix("/audio-params").HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		//bpm := getRandomBpm()
		bpm := getBpmFromMetrics(v1api)

		w.WriteHeader(http.StatusOK)
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(&AudioParams{Bpm: bpm})
	})

	// Serving static files
	router.PathPrefix("/").Handler(http.FileServer(http.Dir("./static/")))

	fmt.Println("Serving requests on port 9000")
	err := http.ListenAndServe(":9000", router)
	log.Fatal(err)
}

func getRandomBpm() int64 {
	max := 180
	min := 60
	return int64(rand.Intn(max-min) + min)
}

func prometheusApi() v1.API {
	client, err := api.NewClient(api.Config{
		Address: "http://localhost:9090",
	})
	if err != nil {
		fmt.Printf("Error creating client: %v\n", err)
		os.Exit(1)
	}

	return v1.NewAPI(client)
}

func getBpmFromMetrics(v1api v1.API) int64 {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	//result, warnings, err := v1api.Query(ctx, "increase(node_network_receive_packets_total{device=\"wlp0s20f3\"}[2m])", time.Now())
	result, warnings, err := v1api.Query(ctx, "sum(avg by (instance,mode) (irate(node_cpu_seconds_total{mode!='idle'}[1m])))", time.Now())
	if err != nil {
		fmt.Printf("Error querying Prometheus: %v\n", err)
		os.Exit(1)
	}
	if len(warnings) > 0 {
		fmt.Printf("Warnings: %v\n", warnings)
	}

	percent, err := strconv.ParseFloat(result.String()[6:11], 64)
	if err != nil {
		fmt.Printf("Error parsing float: %v\n", err)
	}
	min := 60.0
	max := 220.0
	fmt.Printf("%v\n", math.Round(percent * (max-min) + min))

	return int64(percent * (max-min) + min)
}
