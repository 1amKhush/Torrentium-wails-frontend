package main

import (
	"bufio"
	"context"
	"fmt"
	"log"
	"os"
	"os/signal"
	"strings"
	"syscall"

	"github.com/joho/godotenv"
)

// Temporary simplified CLI for testing
func main() {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	if err := godotenv.Load(); err != nil {
		log.Printf("Warning: Could not load .env file: %v", err)
	}

	fmt.Println("=== Torrentium P2P CLI ===")
	fmt.Println("This is a simplified CLI for testing the backend.")
	fmt.Println("For full functionality, use 'wails dev' from the project root.")
	fmt.Println()

	// Setup graceful shutdown
	ch := make(chan os.Signal, 1)
	signal.Notify(ch, syscall.SIGINT, syscall.SIGTERM)
	go func() {
		<-ch
		log.Println("Shutting down gracefully...")
		cancel()
		os.Exit(0)
	}()

	// Simple command loop for testing
	scanner := bufio.NewScanner(os.Stdin)
	for {
		fmt.Print("> ")
		if !scanner.Scan() {
			break
		}

		input := strings.TrimSpace(scanner.Text())
		if input == "" {
			continue
		}

		parts := strings.Fields(input)
		cmd := parts[0]

		switch cmd {
		case "help":
			fmt.Println("Available commands:")
			fmt.Println("  help  - Show this help")
			fmt.Println("  test  - Test basic functionality")
			fmt.Println("  exit  - Exit the application")
		case "test":
			fmt.Println("Backend modules are being developed...")
			fmt.Println("Use 'wails dev' for full P2P functionality")
		case "exit":
			return
		default:
			fmt.Printf("Unknown command: %s. Type 'help' for available commands.\n", cmd)
		}
	}
}
