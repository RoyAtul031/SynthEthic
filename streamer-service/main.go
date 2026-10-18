package main

import (
	"crypto/sha256"
	"encoding/csv"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"strings"
	"sync"
	"sync/atomic"
	"time"
)

// StreamerConfig holds server and upstream engine settings
type StreamerConfig struct {
	Port         string
	PythonEngine string
	Salt         string
	WorkerCount  int
}

type IngestResponse struct {
	Status        string `json:"status"`
	ProcessedRows int64  `json:"processed_rows"`
	MaskedCols    int    `json:"masked_columns"`
	DurationMs    int64  `json:"duration_ms"`
}

type StreamerMetrics struct {
	TotalIngestedRows uint64 `json:"total_ingested_rows"`
	TotalStreams      uint64 `json:"total_streams"`
	ActiveWorkers     int    `json:"active_workers"`
	UptimeSeconds     int64  `json:"uptime_seconds"`
}

var (
	startTime     = time.Now()
	totalRows     uint64
	totalRequests uint64
)

// SaltHashToken generates deterministic irreversible pseudonym
func SaltHashToken(val string, salt string, prefix string) string {
	hasher := sha256.New()
	hasher.Write([]byte(val + "_" + salt))
	hashBytes := hasher.Sum(nil)
	hexStr := strings.ToUpper(hex.EncodeToString(hashBytes)[:10])
	return prefix + hexStr
}

func main() {
	cfg := StreamerConfig{
		Port:         getEnv("PORT", "8080"),
		PythonEngine: getEnv("PYTHON_ENGINE_URL", "http://localhost:8000"),
		Salt:         getEnv("ENTROPY_SALT", "synthethic_entropy_salt_2026"),
		WorkerCount:  8,
	}

	mux := http.NewServeMux()

	// Health check
	mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]interface{}{
			"status":   "healthy",
			"service":  "SynthEthic High-Speed Go Streamer",
			"version":  "1.0.0",
			"engine":   cfg.PythonEngine,
			"workers":  cfg.WorkerCount,
		})
	})

	// Stream stats
	mux.HandleFunc("/stats", func(w http.ResponseWriter, r *http.Request) {
		metrics := StreamerMetrics{
			TotalIngestedRows: atomic.LoadUint64(&totalRows),
			TotalStreams:      atomic.LoadUint64(&totalRequests),
			ActiveWorkers:     cfg.WorkerCount,
			UptimeSeconds:     int64(time.Since(startTime).Seconds()),
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(metrics)
	})

	// High-speed CSV stream ingestion and parallel noise encoding
	mux.HandleFunc("/stream/ingest", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}

		t0 := time.Now()
		atomic.AddUint64(&totalRequests, 1)

		mr, err := r.MultipartReader()
		if err != nil {
			http.Error(w, "Invalid multipart request: "+err.Error(), http.StatusBadRequest)
			return
		}

		var rowCounter int64
		var header []string
		var piiIdxs []int

		for {
			part, err := mr.NextPart()
			if err == io.EOF {
				break
			}
			if err != nil {
				http.Error(w, "Error reading multipart: "+err.Error(), http.StatusInternalServerError)
				return
			}

			if part.FormName() == "file" {
				reader := csv.NewReader(part)
				header, err = reader.Read()
				if err != nil {
					http.Error(w, "Error reading CSV header: "+err.Error(), http.StatusBadRequest)
					return
				}

				// Detect PII columns in header
				for idx, col := range header {
					cl := strings.ToLower(col)
					if strings.Contains(cl, "id") || strings.Contains(cl, "name") || strings.Contains(cl, "email") || strings.Contains(cl, "ssn") || strings.Contains(cl, "mrn") {
						piiIdxs = append(piiIdxs, idx)
					}
				}

				// Parallel processing channel and workers
				rowChan := make(chan []string, 500)
				var wg sync.WaitGroup

				for wIdx := 0; wIdx < cfg.WorkerCount; wIdx++ {
					wg.Add(1)
					go func() {
						defer wg.Done()
						for record := range rowChan {
							// Apply high-speed pseudonymization to PII columns
							for _, pIdx := range piiIdxs {
								if pIdx < len(record) {
									colPrefix := "ANON_"
									if len(header[pIdx]) >= 3 {
										colPrefix = strings.ToUpper(header[pIdx][:3]) + "_"
									}
									record[pIdx] = SaltHashToken(record[pIdx], cfg.Salt, colPrefix)
								}
							}
							atomic.AddInt64(&rowCounter, 1)
						}
					}()
				}

				// Read records and pipe to worker pool
				for {
					record, err := reader.Read()
					if err == io.EOF {
						break
					}
					if err != nil {
						continue
					}
					rowChan <- record
				}
				close(rowChan)
				wg.Wait()
			}
		}

		atomic.AddUint64(&totalRows, uint64(rowCounter))

		res := IngestResponse{
			Status:        "stream_processed",
			ProcessedRows: rowCounter,
			MaskedCols:    len(piiIdxs),
			DurationMs:    time.Since(t0).Milliseconds(),
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(res)
	})

	serverAddr := ":" + cfg.Port
	log.Printf("[SynthEthic-Streamer] Listening on %s (Workers: %d, Engine: %s)", serverAddr, cfg.WorkerCount, cfg.PythonEngine)
	if err := http.ListenAndServe(serverAddr, mux); err != nil {
		log.Fatalf("Server failed: %v", err)
	}
}

func getEnv(key, fallback string) string {
	if val, ok := os.LookupEnv(key); ok {
		return val
	}
	return fallback
}
