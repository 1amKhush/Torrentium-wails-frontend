# Torrentium - Decentralized File Sharing Application

A peer-to-peer file sharing application built with Wails, Go, and React.

## Features

- **Upload Files**: Share files on the decentralized network and get a unique CID
- **Download Files**: Download files using their CID from other peers
- **Local Files**: View all files you're currently sharing
- **History**: Track your file sharing history

## How to Run

### Development Mode

```bash
wails dev
```

### Build Application

```bash
wails build
```

### Run Built Application

```bash
# The executable will be in build/bin/
./build/bin/myproject.exe
```

## Usage Guide

1. **Uploading a File**:

   - Go to the Upload page
   - Click "Select File" to choose a file from your system
   - Click "Add File to Network" to share it
   - Copy the generated CID to share with others

2. **Downloading a File**:

   - Go to the Download page
   - Enter the CID of the file you want to download
   - Click "Download" to start the download process

3. **Viewing Local Files**:

   - Go to the "Local Files" page to see all files you're sharing
   - Use the refresh button to update the list

4. **File History**:
   - Go to the "History" page to see your file sharing history
   - View details like file size, CID, and date added

## Technical Stack

- **Backend**: Go with libp2p for peer-to-peer networking
- **Frontend**: React with Tailwind CSS
- **Framework**: Wails for Go-React integration
- **Database**: SQLite for local file metadata

## Network Architecture

The application uses a decentralized peer-to-peer network where:

- Files are identified by Content Identifiers (CIDs)
- Each peer can both share and download files
- No central server is required
- Files are distributed across multiple peers for redundancy
