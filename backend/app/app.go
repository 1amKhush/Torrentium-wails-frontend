package app

import (
	"context"
	"log"

	"torrentium/cmd/CLIENT"
	"torrentium/internal/db"
	"torrentium/internal/p2p"

	"github.com/joho/godotenv"
	dht "github.com/libp2p/go-libp2p-kad-dht"
	"github.com/libp2p/go-libp2p/core/host"
)

// App struct
type App struct {
	ctx    context.Context
	client *main.Client
	host   host.Host
	dht    *dht.IpfsDHT
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// OnStartup is called when the app starts up
func (a *App) OnStartup(ctx context.Context) {
	a.ctx = ctx

	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Printf("Warning: Could not load .env file: %v", err)
	}

	// Initialize database
	DB := db.InitDB()
	if DB == nil {
		log.Fatal("Database initialization failed")
	}

	// Initialize libp2p host and DHT
	h, d, err := p2p.NewHost(
		ctx,
		"/ip4/0.0.0.0/tcp/0",
		nil,
	)
	if err != nil {
		log.Fatal("Failed to create libp2p host:", err)
	}

	a.host = h
	a.dht = d

	// Bootstrap DHT
	go func() {
		if err := p2p.Bootstrap(ctx, h, d); err != nil {
			log.Printf("Error bootstrapping DHT: %v", err)
		}
	}()

	// Initialize client
	repo := db.NewRepository(DB)
	a.client = main.NewClient(h, d, repo)
	a.client.StartDHTMaintenance()

	// Register WebRTC signaling protocol
	p2p.RegisterSignalingProtocol(h, a.client.HandleWebRTCOffer)

	log.Printf("P2P node started with ID: %s", h.ID())
}

// OnDomReady is called after front-end resources have been loaded
func (a *App) OnDomReady(ctx context.Context) {
	// Add any DOM-ready specific initialization here
}

// OnBeforeClose is called when the application is about to quit
func (a *App) OnBeforeClose(ctx context.Context) (prevent bool) {
	if a.host != nil {
		a.host.Close()
	}
	return false
}

// OnShutdown is called during shutdown
func (a *App) OnShutdown(ctx context.Context) {
	// Perform any cleanup here
}

// Frontend API Methods - These will be available to your React frontend

func (a *App) GetPeerID() string {
	if a.host == nil {
		return ""
	}
	return a.host.ID().String()
}

func (a *App) GetListeningAddresses() []string {
	return a.client.GetListeningAddresses()
}

func (a *App) AddFile(filePath string) error {
	return a.client.AddFile(filePath)
}

func (a *App) ListLocalFiles() ([]main.FrontendFileInfo, error) {
	return a.client.ListLocalFiles()
}

func (a *App) SearchByCID(cid string) ([]main.PeerInfo, error) {
	return a.client.SearchByCID(cid)
}

func (a *App) SearchByText(query string) ([]main.FrontendFileInfo, error) {
	return a.client.SearchByText(query)
}

func (a *App) DownloadFile(cid string) error {
	return a.client.DownloadFile(cid)
}

func (a *App) ConnectToPeer(multiaddr string) error {
	return a.client.ConnectToPeer(multiaddr)
}

func (a *App) GetConnectedPeers() []main.PeerInfo {
	return a.client.GetConnectedPeers()
}

func (a *App) AnnounceFile(cid string) error {
	return a.client.AnnounceFile(cid)
}

func (a *App) GetNetworkHealth() main.NetworkHealth {
	return a.client.GetNetworkHealth()
}

func (a *App) GetActiveDownloads() []main.DownloadProgressSummary {
	return a.client.GetActiveDownloads()
}
func (a *App) ListLocalFiles() ([]FileInfo, error) {
	files, err := a.db.GetLocalFiles(a.ctx)
	if err != nil {
		return nil, err
	}

	var result []FileInfo
	for _, file := range files {
		result = append(result, FileInfo{
			CID:  file.CID,
			Name: file.Filename,
			Size: file.FileSize,
			Path: file.FilePath,
			Hash: file.FileHash,
		})
	}
	return result, nil
}

func (a *App) SearchByCID(cid string) ([]PeerInfo, error) {
	return a.client.searchByCIDForFrontend(cid)
}

func (a *App) SearchByText(query string) ([]FileInfo, error) {
	matches, err := a.db.SearchByFilename(a.ctx, query)
	if err != nil {
		return nil, err
	}

	var result []FileInfo
	for _, match := range matches {
		result = append(result, FileInfo{
			CID:  match.CID,
			Name: match.Filename,
			Size: match.FileSize,
			Path: match.FilePath,
			Hash: match.FileHash,
		})
	}
	return result, nil
}

func (a *App) DownloadFile(cid string) error {
	return a.client.downloadFile(cid)
}

func (a *App) ConnectToPeer(multiaddr string) error {
	return a.client.connectToPeer(multiaddr)
}

func (a *App) GetConnectedPeers() []PeerInfo {
	if a.host == nil {
		return []PeerInfo{}
	}

	peers := a.host.Network().Peers()
	var result []PeerInfo

	for _, peerID := range peers {
		conn := a.host.Network().ConnsToPeer(peerID)
		if len(conn) > 0 {
			result = append(result, PeerInfo{
				ID:      peerID.String(),
				Address: conn[0].RemoteMultiaddr().String(),
			})
		}
	}
	return result
}

func (a *App) AnnounceFile(cid string) error {
	return a.client.announceFile(cid)
}

func (a *App) GetNetworkHealth() map[string]interface{} {
	if a.host == nil {
		return map[string]interface{}{
			"connected_peers": 0,
			"dht_table_size":  0,
			"status":          "disconnected",
		}
	}

	peers := a.host.Network().Peers()
	routingTableSize := a.dht.RoutingTable().Size()

	status := "good"
	if len(peers) < 3 {
		status = "warning"
	}
	if len(peers) == 0 {
		status = "error"
	}

	return map[string]interface{}{
		"connected_peers": len(peers),
		"dht_table_size":  routingTableSize,
		"status":          status,
	}
}

// NewClientFromExisting creates a client instance compatible with the existing main.go Client
func NewClientFromExisting(h host.Host, d *dht.IpfsDHT, repo *db.Repository) *Client {
	// This would be your existing Client from main.go
	// For now, we'll create a wrapper that delegates to the main Client
	return &Client{
		host:            h,
		dht:             d,
		webRTCPeers:     make(map[peer.ID]*client.SimpleWebRTCPeer),
		sharingFiles:    make(map[string]*FileInfo),
		activeDownloads: make(map[string]*DownloadState),
		db:              repo,
		unackedChunks:   make(map[string]map[int64]map[int]controlMessage),
		congestionCtrl:  make(map[peer.ID]time.Duration),
		pingTimes:       make(map[peer.ID]time.Time),
		rttMeasurements: make(map[peer.ID][]time.Duration),
		mu:              sync.RWMutex{},
	}
}

// Client wrapper - delegates to your existing client methods
type Client struct {
	host            host.Host
	dht             *dht.IpfsDHT
	webRTCPeers     map[peer.ID]*client.SimpleWebRTCPeer
	sharingFiles    map[string]*FileInfo
	activeDownloads map[string]*DownloadState
	db              *db.Repository
	unackedChunks   map[string]map[int64]map[int]controlMessage
	congestionCtrl  map[peer.ID]time.Duration
	pingTimes       map[peer.ID]time.Time
	rttMeasurements map[peer.ID][]time.Duration
	mu              sync.RWMutex
}

// Add method implementations that delegate to your existing main.go methods
func (c *Client) addFile(filePath string) error {
	// Implement based on your existing addFile method
	return fmt.Errorf("not implemented - delegate to main.go client")
}

func (c *Client) searchByCIDForFrontend(cid string) ([]PeerInfo, error) {
	// Implement based on your existing search methods
	return []PeerInfo{}, fmt.Errorf("not implemented - delegate to main.go client")
}

func (c *Client) downloadFile(cid string) error {
	// Implement based on your existing downloadFile method
	return fmt.Errorf("not implemented - delegate to main.go client")
}

func (c *Client) connectToPeer(multiaddr string) error {
	// Implement based on your existing connectToPeer method
	return fmt.Errorf("not implemented - delegate to main.go client")
}

func (c *Client) announceFile(cid string) error {
	// Implement based on your existing announceFile method
	return fmt.Errorf("not implemented - delegate to main.go client")
}

func (c *Client) handleWebRTCOffer(offer, remotePeerID string, s network.Stream) (string, error) {
	// Implement based on your existing handleWebRTCOffer method
	return "", fmt.Errorf("not implemented - delegate to main.go client")
}

// Additional types from main.go that need to be accessible
type FileInfo struct {
	FilePath string
	Hash     string
	Size     int64
	Name     string
	PieceSz  int64
}

type DownloadState struct {
	// ...existing fields from main.go...
	mu sync.Mutex
}

type controlMessage struct {
	// ...existing fields from main.go...
}
