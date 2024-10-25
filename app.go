package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"os/exec"
	"time"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called at application startup
func (a *App) startup(ctx context.Context) {
	// Perform your setup here
	a.ctx = ctx
}

// domReady is called after front-end resources have been loaded
func (a App) domReady(ctx context.Context) {
	// Add your action here
}

// beforeClose is called when the application is about to quit,
// either by clicking the window close button or calling runtime.Quit.
// Returning true will cause the application to continue, false will continue shutdown as normal.
func (a *App) beforeClose(ctx context.Context) (prevent bool) {
	return false
}

// shutdown is called at application termination
func (a *App) shutdown(ctx context.Context) {
	// Perform your teardown here
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
		"--impersonate", "chrome",
		"-f", "bv[height<=720]+ba/b[height<=720]",
		"--force-keyframes-at-cuts",
		"--force-overwrites",
		"--download-sections", fmt.Sprintf("*%s-%s", req.Start, req.End),
		"--throttled-rate", "100K",
		"--remux-video", "mp4",
		"-o", "C:/Users/hdhdu/Downloads/clips/%(title)s.%(ext)s",
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
