package generator

import (
	"encoding/json"
	"fmt"
	"image"
	"image/jpeg"
	"image/png"
	"os"
	"path/filepath"

	"pico-content/internal/artifacts"
	"pico-content/internal/contentstage"
)

type ExportOptions struct {
	OutputDir   string
	ArtifactDir string
	JPEGQuality int
}

type ExportReport struct {
	StageID      string             `json:"stageId"`
	ContentImage string             `json:"contentImage"`
	ContentJSON  string             `json:"contentJson"`
	Artifacts    artifacts.Manifest `json:"artifacts"`
}

func Export(result Result, opts ExportOptions) (ExportReport, error) {
	if opts.OutputDir == "" {
		opts.OutputDir = "../../contents"
	}
	if opts.ArtifactDir == "" {
		opts.ArtifactDir = filepath.Join("artifacts", result.Request.StageID)
	}
	if opts.JPEGQuality == 0 {
		opts.JPEGQuality = 95
	}
	if result.Combined == nil {
		return ExportReport{}, fmt.Errorf("combined image is missing")
	}

	if err := os.MkdirAll(opts.OutputDir, 0o755); err != nil {
		return ExportReport{}, err
	}
	if err := os.MkdirAll(opts.ArtifactDir, 0o755); err != nil {
		return ExportReport{}, err
	}

	imagePath := filepath.Join(opts.OutputDir, result.Request.StageID+".jpg")
	jsonPath := filepath.Join(opts.OutputDir, result.Request.StageID+".json")
	if err := saveJPEG(imagePath, result.Combined, opts.JPEGQuality); err != nil {
		return ExportReport{}, err
	}
	if err := contentstage.Save(jsonPath, result.Stage); err != nil {
		return ExportReport{}, err
	}

	manifest := artifacts.NewManifest(result.Request.StageID)
	if result.LeftPanel != nil {
		leftPath := filepath.Join(opts.ArtifactDir, "left_panel.png")
		if err := savePNG(leftPath, result.LeftPanel); err != nil {
			return ExportReport{}, err
		}
		_ = manifest.AddFile("left_panel.png", leftPath, "left_panel")
	}
	if result.RightPanel != nil {
		rightPath := filepath.Join(opts.ArtifactDir, "right_panel_final.png")
		if err := savePNG(rightPath, result.RightPanel); err != nil {
			return ExportReport{}, err
		}
		_ = manifest.AddFile("right_panel_final.png", rightPath, "right_panel")
	}
	reportPath := filepath.Join(opts.ArtifactDir, "qa_report.json")
	if err := writeJSONFile(reportPath, result); err != nil {
		return ExportReport{}, err
	}
	_ = manifest.AddFile("qa_report.json", reportPath, "qa_report")
	_ = manifest.AddFile(filepath.Base(imagePath), imagePath, "content_image")
	_ = manifest.AddFile(filepath.Base(jsonPath), jsonPath, "content_json")

	manifestPath := filepath.Join(opts.ArtifactDir, "manifest.json")
	if err := writeJSONFile(manifestPath, manifest); err != nil {
		return ExportReport{}, err
	}

	return ExportReport{
		StageID:      result.Request.StageID,
		ContentImage: imagePath,
		ContentJSON:  jsonPath,
		Artifacts:    manifest,
	}, nil
}

func writeJSONFile(path string, payload any) error {
	data, err := json.MarshalIndent(payload, "", "  ")
	if err != nil {
		return err
	}
	data = append(data, '\n')
	return os.WriteFile(path, data, 0o644)
}

func saveJPEG(path string, img image.Image, quality int) error {
	file, err := os.Create(path)
	if err != nil {
		return err
	}
	defer file.Close()
	return jpeg.Encode(file, img, &jpeg.Options{Quality: quality})
}

func savePNG(path string, img image.Image) error {
	file, err := os.Create(path)
	if err != nil {
		return err
	}
	defer file.Close()
	return png.Encode(file, img)
}
