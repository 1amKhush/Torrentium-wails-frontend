package main

import (
	"context"
	"embed"
	"fmt"
	"log"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
)

//go:embed all:frontend/dist
var assets embed.FS

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// OnStartup is called when the app starts up
func (a *App) OnStartup(ctx context.Context) {
	a.ctx = ctx
	log.Println("Application started")
}

// Placeholder methods - these will be replaced with actual P2P functionality
func (a *App) GetPeerID() string {
	return "placeholder-peer-id"
}

func (a *App) GetListeningAddresses() []string {
	return []string{"/ip4/127.0.0.1/tcp/0/p2p/placeholder-peer-id"}
}

func (a *App) AddFile(filePath string) error {
	log.Printf("AddFile called with: %s", filePath)
	return fmt.Errorf("not implemented yet - use CLI for testing")
}

func (a *App) ListLocalFiles() ([]map[string]interface{}, error) {
	return []map[string]interface{}{}, nil
}

func (a *App) SearchByCID(cid string) ([]map[string]interface{}, error) {
	log.Printf("SearchByCID called with: %s", cid)
	return []map[string]interface{}{}, nil
}

func (a *App) SearchByText(query string) ([]map[string]interface{}, error) {
	log.Printf("SearchByText called with: %s", query)
	return []map[string]interface{}{}, nil
}

func (a *App) DownloadFile(cid string) error {
	log.Printf("DownloadFile called with: %s", cid)
	return fmt.Errorf("not implemented yet")
}

func (a *App) ConnectToPeer(multiaddr string) error {
	log.Printf("ConnectToPeer called with: %s", multiaddr)
	return fmt.Errorf("not implemented yet")
}

func (a *App) GetConnectedPeers() []map[string]interface{} {
	return []map[string]interface{}{}
}

func (a *App) AnnounceFile(cid string) error {
	log.Printf("AnnounceFile called with: %s", cid)
	return fmt.Errorf("not implemented yet")
}

func (a *App) GetNetworkHealth() map[string]interface{} {
	return map[string]interface{}{
		"connected_peers": 0,
		"dht_table_size":  0,
		"status":          "developing",
	}
}

func main() {
	// Create an instance of the app structure
	app := NewApp()

	// Create application with options
	err := wails.Run(&options.App{
		Title:  "Torrentium - P2P File Sharing",
		Width:  1200,
		Height: 800,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		BackgroundColour: &options.RGBA{R: 27, G: 38, B: 54, A: 1},
		OnStartup:        app.OnStartup,
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
