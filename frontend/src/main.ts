import './style.css'
import { AddFile, ListLocalFiles, SearchByCID, SearchByText, DownloadFile, ConnectToPeer, GetConnectedPeers, GetPeerID, GetListeningAddresses, AnnounceFile, GetNetworkHealth } from '../wailsjs/go/app/App'

// DOM Elements
const peerIdElement = document.getElementById('peer-id') as HTMLElement
const addressesElement = document.getElementById('addresses') as HTMLElement
const addFileBtn = document.getElementById('add-file-btn') as HTMLButtonElement
const fileInput = document.getElementById('file-input') as HTMLInputElement
const searchInput = document.getElementById('search-input') as HTMLInputElement
const searchBtn = document.getElementById('search-btn') as HTMLButtonElement
const downloadInput = document.getElementById('download-input') as HTMLInputElement
const downloadBtn = document.getElementById('download-btn') as HTMLButtonElement
const connectInput = document.getElementById('connect-input') as HTMLInputElement
const connectBtn = document.getElementById('connect-btn') as HTMLButtonElement
const refreshBtn = document.getElementById('refresh-btn') as HTMLButtonElement
const localFilesDiv = document.getElementById('local-files') as HTMLDivElement
const peersDiv = document.getElementById('peers') as HTMLDivElement
const searchResultsDiv = document.getElementById('search-results') as HTMLDivElement
const statusDiv = document.getElementById('status') as HTMLDivElement

// Initialize the app
async function init() {
    try {
        const peerId = await GetPeerID()
        const addresses = await GetListeningAddresses()
        
        peerIdElement.textContent = peerId
        addressesElement.innerHTML = addresses.map((addr: string) => `<div class="address">${addr}</div>`).join('')
        
        await refreshData()
        await updateNetworkHealth()
        
        // Set up periodic updates
        setInterval(updateNetworkHealth, 5000)
        setInterval(refreshPeers, 10000)
    } catch (error) {
        console.error('Failed to initialize:', error)
        statusDiv.innerHTML = '<div class="error">Failed to initialize P2P node</div>'
    }
}

// Event Listeners
addFileBtn.addEventListener('click', async () => {
    if (fileInput.files && fileInput.files[0]) {
        const file = fileInput.files[0]
        try {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const arrayBuffer = e.target?.result as ArrayBuffer;
                await AddFile(new Uint8Array(arrayBuffer));
                showStatus(`File "${file.name}" added successfully`, 'success')
                await refreshLocalFiles()
            };
            reader.readAsArrayBuffer(file);
        } catch (error) {
            showStatus(`Failed to add file: ${error}`, 'error')
        }
    }
})

searchBtn.addEventListener('click', async () => {
    const query = searchInput.value.trim()
    if (!query) return
    
    try {
        let results: any[] = []
        
        if (query.startsWith('bafy') || query.startsWith('Qm')) {
            // CID search
            const peers = await SearchByCID(query)
            searchResultsDiv.innerHTML = `
                <h3>Search Results for CID: ${query}</h3>
                <div class="providers">
                    <strong>Found ${peers.length} provider(s):</strong>
                    ${peers.map(peer => `
                        <div class="provider">
                            <div>Peer: ${peer.id}</div>
                            <div>Address: ${peer.address}</div>
                        </div>
                    `).join('')}
                </div>
            `
        } else {
            // Text search
            results = await SearchByText(query)
            searchResultsDiv.innerHTML = `
                <h3>Search Results for: "${query}"</h3>
                ${results.map(file => `
                    <div class="search-result">
                        <div><strong>${file.name}</strong></div>
                        <div>CID: ${file.cid}</div>
                        <div>Size: ${formatBytes(file.size)}</div>
                        <button onclick="downloadFile('${file.cid}')">Download</button>
                    </div>
                `).join('')}
            `
        }
    } catch (error) {
        showStatus(`Search failed: ${error}`, 'error')
    }
})

downloadBtn.addEventListener('click', async () => {
    const cid = downloadInput.value.trim()
    if (!cid) return
    
    try {
        showStatus('Starting download...', 'info')
        await DownloadFile(cid)
        showStatus('Download completed!', 'success')
    } catch (error) {
        showStatus(`Download failed: ${error}`, 'error')
    }
})

connectBtn.addEventListener('click', async () => {
    const multiaddr = connectInput.value.trim()
    if (!multiaddr) return
    
    try {
        await ConnectToPeer(multiaddr)
        showStatus('Connected to peer successfully', 'success')
        await refreshPeers()
    } catch (error) {
        showStatus(`Failed to connect: ${error}`, 'error')
    }
})

refreshBtn.addEventListener('click', refreshData)

// Helper Functions
async function refreshData() {
    await refreshLocalFiles()
    await refreshPeers()
}

async function refreshLocalFiles() {
    try {
        const files = await ListLocalFiles()
        localFilesDiv.innerHTML = files.map(file => `
            <div class="file-item">
                <div><strong>${file.name}</strong></div>
                <div>CID: <code>${file.cid}</code></div>
                <div>Size: ${formatBytes(file.size)}</div>
                <div>Path: ${file.path}</div>
                <button onclick="announceFile('${file.cid}')">Re-announce</button>
            </div>
        `).join('')
    } catch (error) {
        console.error('Failed to refresh local files:', error)
    }
}

async function refreshPeers() {
    try {
        const peers = await GetConnectedPeers()
        peersDiv.innerHTML = peers.map(peer => `
            <div class="peer-item">
                <div><strong>Peer:</strong> ${peer.id}</div>
                <div><strong>Address:</strong> ${peer.address}</div>
            </div>
        `).join('')
    } catch (error) {
        console.error('Failed to refresh peers:', error)
    }
}

async function updateNetworkHealth() {
    try {
        const health = await GetNetworkHealth()
        const statusClass = health.status === 'good' ? 'status-good' : 
                           health.status === 'warning' ? 'status-warning' : 'status-error'
        
        document.getElementById('network-status')!.innerHTML = `
            <div class="${statusClass}">
                <strong>Network Status:</strong> ${health.status.toUpperCase()}<br>
                <strong>Connected Peers:</strong> ${health.connected_peers}<br>
                <strong>DHT Table Size:</strong> ${health.dht_table_size}
            </div>
        `
    } catch (error) {
        console.error('Failed to update network health:', error)
    }
}

function showStatus(message: string, type: 'success' | 'error' | 'info') {
    statusDiv.innerHTML = `<div class="status-${type}">${message}</div>`
    setTimeout(() => {
        statusDiv.innerHTML = ''
    }, 5000)
}

function formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Global functions for button clicks
(window as any).downloadFile = async (cid: string) => {
    try {
        await DownloadFile(cid)
        showStatus('Download completed!', 'success')
    } catch (error) {
        showStatus(`Download failed: ${error}`, 'error')
    }
}

(window as any).announceFile = async (cid: string) => {
    try {
        await AnnounceFile(cid)
        showStatus('File re-announced successfully', 'success')
    } catch (error) {
        showStatus(`Failed to announce: ${error}`, 'error')
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init)
