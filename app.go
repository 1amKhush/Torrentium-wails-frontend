package main

import (
	"context"
	"crypto/sha256"
	"fmt"
	"io"
	"log"
	"os"
	"time" // <-- Import the time package

	"github.com/1amkhush/torrentium/pkg/db"
	"github.com/1amkhush/torrentium/pkg/p2p"
	"github.com/1amkhush/torrentium/pkg/torrentium_client"
	"github.com/ipfs/go-cid"
	"github.com/joho/godotenv"
	"github.com/multiformats/go-multihash"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// LocalFileFE is a frontend-friendly version of the db.LocalFile struct.
// It converts time.Time to a string so Wails can handle it.
type LocalFileFE struct {
	CID       string `json:"cid"`
	Filename  string `json:"filename"`
	FileSize  int64  `json:"fileSize"`
	FilePath  string `json:"filePath"`
	FileHash  string `json:"fileHash"`
	// Assuming your db.LocalFile has this field. Change it if the name is different.
	CreatedAt string `json:"createdAt"`
}


// App struct holds the backend client and the repository
type App struct {
	ctx    context.Context
	client *torrentium_client.Client // Instance of your backend
	repo   *db.Repository            // Use a pointer
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// OnStartup is called when the app starts.
func (a *App) OnStartup(ctx context.Context) {
	a.ctx = ctx
	_ = godotenv.Load()

	DB := db.InitDB()
	if DB == nil {
		log.Fatal("Database initialization failed")
	}
	a.repo = db.NewRepository(DB)

	hostCtx := context.Background()
	h, d, err := p2p.NewHost(hostCtx, "/ip4/0.0.0.0/tcp/0", nil)
	if err != nil {
		log.Fatalf("Failed to create libp2p host: %v", err)
	}

	go func() {
		if err := p2p.Bootstrap(hostCtx, h, d); err != nil {
			log.Printf("Error bootstrapping DHT: %v", err)
		}
	}()

	a.client = torrentium_client.NewClient(h, d, a.repo)
	a.client.StartDHTMaintenance()
	log.Println("Torrentium client initialized successfully!")
}

// OnBeforeClose is called just before the application shuts down.
func (a *App) OnBeforeClose(ctx context.Context) (prevent bool) {
	log.Println("Shutting down the client.")
	if a.client != nil {
		if err := a.client.Close(); err != nil {
			log.Printf("Error closing client: %v", err)
		}
	}
	return false
}

func (a *App) SelectFile() (string, error) {
	return runtime.OpenFileDialog(a.ctx, runtime.OpenDialogOptions{
		Title: "Select File to Share",
	})
}

// AddFile shares a file on the network and returns its CID.
func (a *App) AddFile(filePath string) (string, error) {
	if a.client == nil {
		return "", fmt.Errorf("client is not initialized")
	}
	log.Printf("Attempting to add file: %s", filePath)

	if err := a.client.AddFile(filePath); err != nil {
		log.Printf("Error adding file: %v", err)
		return "", err
	}

	f, err := os.Open(filePath)
	if err != nil {
		return "", fmt.Errorf("failed to re-open file for CID calculation: %w", err)
	}
	defer f.Close()

	hasher := sha256.New()
	if _, err := io.Copy(hasher, f); err != nil {
		return "", fmt.Errorf("failed to calculate hash for CID: %w", err)
	}

	fileHashBytes := hasher.Sum(nil)
	mhash, err := multihash.Encode(fileHashBytes, multihash.SHA2_256)
	if err != nil {
		return "", fmt.Errorf("failed to create multihash for CID: %w", err)
	}

	fileCID := cid.NewCidV1(cid.Raw, mhash)
	cidStr := fileCID.String()

	log.Printf("Successfully added file with CID: %s", cidStr)
	return cidStr, nil
}

// ListLocalFiles returns a list of files being shared locally.
// It now returns the frontend-safe struct.
func (a *App) ListLocalFiles() ([]LocalFileFE, error) {
	if a.repo == nil {
		return nil, fmt.Errorf("repository is not initialized")
	}

	localFiles, err := a.repo.GetLocalFiles(a.ctx)
	if err != nil {
		return nil, err
	}

	// Convert the database models to our frontend-friendly struct
	feFiles := make([]LocalFileFE, len(localFiles))
	for i, file := range localFiles {
		feFiles[i] = LocalFileFE{
			CID:       file.CID,
			Filename:  file.Filename,
			FileSize:  file.FileSize,
			FilePath:  file.FilePath,
			FileHash:  file.FileHash,
			CreatedAt: file.CreatedAt.Format(time.RFC3339), // Convert time to a standard string
		}
	}

	return feFiles, nil
}


// DownloadFile starts a file download in the background.
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