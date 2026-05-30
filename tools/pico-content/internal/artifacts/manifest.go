package artifacts

import (
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"io"
	"os"
	"time"
)

type Manifest struct {
	StageID   string     `json:"stageId"`
	CreatedAt time.Time  `json:"createdAt"`
	Artifacts []Artifact `json:"artifacts"`
}

type Artifact struct {
	Name   string `json:"name"`
	Path   string `json:"path"`
	SHA256 string `json:"sha256"`
	Bytes  int64  `json:"bytes"`
	Role   string `json:"role"`
}

func NewManifest(stageID string) Manifest {
	return Manifest{
		StageID:   stageID,
		CreatedAt: time.Now().UTC(),
	}
}

func (m *Manifest) AddFile(name, path, role string) error {
	sum, size, err := FileSHA256(path)
	if err != nil {
		return err
	}
	m.Artifacts = append(m.Artifacts, Artifact{
		Name:   name,
		Path:   path,
		SHA256: sum,
		Bytes:  size,
		Role:   role,
	})
	return nil
}

func FileSHA256(path string) (string, int64, error) {
	file, err := os.Open(path)
	if err != nil {
		return "", 0, err
	}
	defer file.Close()

	hasher := sha256.New()
	size, err := io.Copy(hasher, file)
	if err != nil {
		return "", 0, fmt.Errorf("hash %s: %w", path, err)
	}
	return hex.EncodeToString(hasher.Sum(nil)), size, nil
}
