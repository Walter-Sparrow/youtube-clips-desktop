package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"os/exec"
	"path/filepath"
	"time"

	"github.com/sqweek/dialog"
	"golang.design/x/clipboard"
)

type AppSettings struct {
	ClipsDir string `json:"clipsDir"`
}
type App struct {
	ctx      context.Context
	appDir   string
	settings AppSettings
}

func NewApp() *App {
	return &App{}
}

func (a *App) startup(ctx context.Context) {
	a.ctx = ctx

	err := clipboard.Init()
	if err != nil {
		log.Fatalf("Failed to init clipboard: %s", err)
	}

	configDir, err := os.UserConfigDir()
	if err != nil {
		log.Fatalf("Failed to get user config directory: %s", err)
	}

	a.appDir = filepath.Join(configDir, "youtube-clips")
	if _, err := os.Stat(a.appDir); os.IsNotExist(err) {
		os.MkdirAll(a.appDir, 0755)
	}

	configFilePath := filepath.Join(a.appDir, "config.json")
	if _, err := os.Stat(configFilePath); os.IsNotExist(err) {
		os.WriteFile(configFilePath, []byte("{}"), 0644)
	} else {
		content, err := os.ReadFile(configFilePath)
		if err != nil {
			log.Fatalf("Failed to read config file: %s", err)
		}
		json.Unmarshal(content, &a.settings)
	}
}

func (a *App) SaveSettings() {
	configFilePath := filepath.Join(a.appDir, "config.json")
	content, err := json.Marshal(a.settings)
	if err != nil {
		log.Fatalf("Failed to marshal settings: %s", err)
	}
	os.WriteFile(configFilePath, content, 0644)
}

func (a App) domReady(ctx context.Context) {
	// Add your action here
}

func (a *App) beforeClose(ctx context.Context) (prevent bool) {
	return false
}

func (a *App) shutdown(ctx context.Context) {
}

type CreateClipRequest struct {
	VideoId string `json:"videoId"`
	Start   string `json:"start"`
	End     string `json:"end"`
}

const youtubeUrl = "https://www.youtube.com/watch?v="

func (a *App) CreateClip(req CreateClipRequest) string {
	startMeasure := time.Now()
	youtubeDl := exec.Command("yt-dlp",
		"-vU",
		"-4",
		"-f", "bv[height<=720]+ba/b[height<=720]",
		"--force-keyframes-at-cuts",
		"--force-overwrites",
		"--download-sections", fmt.Sprintf("*%s-%s", req.Start, req.End),
		"--throttled-rate", "100K",
		"--remux-video", "mp4",
		"-o", filepath.Join(a.settings.ClipsDir, "%(title)s.%(ext)s"),
		youtubeUrl+req.VideoId,
	)
	youtubeDl.Stdout = os.Stdout
	youtubeDl.Stderr = os.Stderr

	if err := youtubeDl.Run(); err != nil {
		log.Printf("Failed to run youtube-dl: %s", err)
		return fmt.Sprintf("Failed to run youtube-dl: %s", err)
	}

	log.Printf("Success in %s", time.Since(startMeasure))
	return fmt.Sprintf("Success in %s", time.Since(startMeasure))
}

func (a *App) GetClipsDir() string {
	return a.settings.ClipsDir
}

func (a *App) PickClipsDir() {
	directory, err := dialog.Directory().Title("Select clips directory").Browse()
	if err != nil {
		log.Printf("Failed to pick clips directory: %s", err)
		return
	}
	a.settings.ClipsDir = directory
	a.SaveSettings()
}

func (a *App) ReadUrlFromClipboard() string {
	return string(clipboard.Read(clipboard.FmtText))
}
