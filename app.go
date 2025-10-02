package main

import (
	"context"
	"fmt"
	"log"

	"github.com/1amkhush/torrentium/pkg/db"
	"github.com/1amkhush/torrentium/pkg/p2p"
	"github.com/1amkhush/torrentium/pkg/torrentium_client"

	"github.com/joho/godotenv"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct holds the backend client
type App struct {
	ctx    context.Context
	client *torrentium_client.Client // Instance of your backend
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// OnStartup is called when the app starts. We initialize the backend here.
func (a *App) OnStartup(ctx context.Context) {
	a.ctx = ctx
	_ = godotenv.Load()

	// 1. Initialize the database
	DB := db.InitDB()
	if DB == nil {
		log.Fatal("Database initialization failed")
	}
	repo := db.NewRepository(DB)

	// 2. Set up the libp2p host and DHT
	hostCtx := context.Background()
	h, d, err := p2p.NewHost(hostCtx, "/ip4/0.0.0.0/tcp/0", nil)
	if err != nil {
		log.Fatalf("Failed to create libp2p host: %v", err)
	}

	// 3. Bootstrap the DHT in the background
	go func() {
		if err := p2p.Bootstrap(hostCtx, h, d); err != nil {
			log.Printf("Error bootstrapping DHT: %v", err)
		}
	}()

	// 4. Create the client from your library and store it in the App struct
	a.client = torrentium_client.NewClient(h, d, repo)

	// 5. Start background maintenance tasks for the client
	a.client.StartDHTMaintenance()
	log.Println("Torrentium client initialized successfully!")
}

// OnBeforeClose is called just before the application shuts down.
func (a *App) OnBeforeClose(ctx context.Context) (prevent bool) {
	log.Println("Shutting down the libp2p host.")
	if a.client != nil && a.client.Host != nil {
		if err := a.client.Host.Close(); err != nil {
			log.Printf("Error closing host: %v", err)
		}
	}
	return false
}

// --- Frontend Callable Methods ---

// SelectFile opens a native file dialog to select a file.
func (a *App) SelectFile() (string, error) {
	return runtime.OpenFileDialog(a.ctx, runtime.OpenDialogOptions{
		Title: "Select File to Share",
	})
}

// AddFile shares a file on the network.
func (a *App) AddFile(filePath string) (string, error) {
	if a.client == nil {
		return "", fmt.Errorf("client is not initialized")
	}
	log.Printf("Attempting to add file: %s", filePath)
	cid, err := a.client.AddFile(filePath)
	if err != nil {
		log.Printf("Error adding file: %v", err)
		return "", err
	}
	log.Printf("Successfully added file with CID: %s", cid)
	return cid, nil
}

// ListLocalFiles returns a list of files being shared locally.
func (a *App) ListLocalFiles() ([]db.LocalFile, error) {
	if a.client == nil {
		return nil, fmt.Errorf("client is not initialized")
	}
	return a.client.ListLocalFiles()
}

// DownloadFile starts a file download in the background.
// It emits events to the frontend to report progress.
func (a *App) DownloadFile(cid string) error {
	if a.client == nil {
		return fmt.Errorf("client is not initialized")
	}
	go func() {
		log.Printf("Starting download for CID: %s", cid)
		err := a.client.DownloadFile(cid)
		if err != nil {
			log.Printf("Error downloading file: %v", err)
			runtime.EventsEmit(a.ctx, "download-error", err.Error())
		} else {
			log.Printf("Successfully downloaded file with CID: %s", cid)
			runtime.EventsEmit(a.ctx, "download-complete", cid)
		}
	}()
	return nil
}
