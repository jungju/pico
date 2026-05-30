package openai

import (
	"bytes"
	"context"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"image"
	"image/png"
	"io"
	"mime/multipart"
	"net/http"
	"os"
	"strings"
	"time"

	"pico-content/internal/schema"
)

type HTTPClient struct {
	APIKey      string
	BaseURL     string
	ImageModel  string
	VisionModel string
	Client      *http.Client
}

func NewHTTPClientFromEnv() HTTPClient {
	return HTTPClient{
		APIKey:      os.Getenv("OPENAI_API_KEY"),
		BaseURL:     envDefault("OPENAI_BASE_URL", "https://api.openai.com"),
		ImageModel:  envDefault("OPENAI_IMAGE_MODEL", "gpt-image-2"),
		VisionModel: envDefault("OPENAI_VISION_MODEL", "gpt-4o"),
		Client:      &http.Client{Timeout: 180 * time.Second},
	}
}

func (c HTTPClient) GenerateImage(ctx context.Context, prompt string, size schema.Size) (image.Image, error) {
	payload := map[string]any{
		"model":  c.imageModel(),
		"prompt": prompt,
		"size":   imageSize(size),
		"n":      1,
	}
	data, err := c.postJSON(ctx, "/v1/images/generations", payload)
	if err != nil {
		return nil, err
	}
	return decodeImageResponse(ctx, c.httpClient(), data)
}

func (c HTTPClient) PlanDifferences(ctx context.Context, prompt string, leftPanel image.Image, count int) ([]schema.DiffCandidate, error) {
	dataURL, err := imageDataURL(leftPanel)
	if err != nil {
		return nil, err
	}
	payload := responsesPayload(c.visionModel(), prompt, dataURL, "spot_difference_plan", plannerSchema())
	data, err := c.postJSON(ctx, "/v1/responses", payload)
	if err != nil {
		return nil, err
	}
	text, err := responseText(data)
	if err != nil {
		return nil, err
	}
	var result schema.PlanResult
	if err := json.Unmarshal([]byte(extractJSONObject(text)), &result); err != nil {
		return nil, fmt.Errorf("decode planner JSON: %w: %s", err, text)
	}
	return result.Candidates, nil
}

func (c HTTPClient) EditImage(ctx context.Context, prompt string, currentRight image.Image, mask *image.Alpha, size schema.Size) (image.Image, error) {
	imageBytes, err := encodePNG(currentRight)
	if err != nil {
		return nil, err
	}
	maskBytes, err := encodePNG(mask)
	if err != nil {
		return nil, err
	}
	var body bytes.Buffer
	writer := multipart.NewWriter(&body)
	fields := map[string]string{
		"model":  c.imageModel(),
		"prompt": prompt,
		"size":   imageSize(size),
	}
	for key, value := range fields {
		if err := writer.WriteField(key, value); err != nil {
			return nil, err
		}
	}
	if err := writePart(writer, "image", "image.png", imageBytes); err != nil {
		return nil, err
	}
	if err := writePart(writer, "mask", "mask.png", maskBytes); err != nil {
		return nil, err
	}
	if err := writer.Close(); err != nil {
		return nil, err
	}

	data, err := c.postMultipart(ctx, "/v1/images/edits", writer.FormDataContentType(), &body)
	if err != nil {
		return nil, err
	}
	return decodeImageResponse(ctx, c.httpClient(), data)
}

func (c HTTPClient) VerifyStage(ctx context.Context, prompt string, leftPanel image.Image, rightPanel image.Image, components []schema.Component) (schema.VerifierResult, error) {
	combined := combineForVision(leftPanel, rightPanel)
	dataURL, err := imageDataURL(combined)
	if err != nil {
		return schema.VerifierResult{}, err
	}
	componentData, err := json.Marshal(components)
	if err != nil {
		return schema.VerifierResult{}, err
	}
	payload := responsesPayload(c.visionModel(), prompt+"\nGenerated pixel components:\n"+string(componentData), dataURL, "spot_difference_verifier", verifierSchema())
	data, err := c.postJSON(ctx, "/v1/responses", payload)
	if err != nil {
		return schema.VerifierResult{}, err
	}
	text, err := responseText(data)
	if err != nil {
		return schema.VerifierResult{}, err
	}
	var result schema.VerifierResult
	if err := json.Unmarshal([]byte(extractJSONObject(text)), &result); err != nil {
		return schema.VerifierResult{}, fmt.Errorf("decode verifier JSON: %w: %s", err, text)
	}
	return result, nil
}

func (c HTTPClient) postJSON(ctx context.Context, path string, payload any) ([]byte, error) {
	if c.APIKey == "" {
		return nil, fmt.Errorf("OPENAI_API_KEY is required")
	}
	body, err := json.Marshal(payload)
	if err != nil {
		return nil, err
	}
	req, err := http.NewRequestWithContext(ctx, http.MethodPost, strings.TrimRight(c.baseURL(), "/")+path, bytes.NewReader(body))
	if err != nil {
		return nil, err
	}
	req.Header.Set("Authorization", "Bearer "+c.APIKey)
	req.Header.Set("Content-Type", "application/json")
	return c.do(req)
}

func (c HTTPClient) postMultipart(ctx context.Context, path string, contentType string, body io.Reader) ([]byte, error) {
	if c.APIKey == "" {
		return nil, fmt.Errorf("OPENAI_API_KEY is required")
	}
	req, err := http.NewRequestWithContext(ctx, http.MethodPost, strings.TrimRight(c.baseURL(), "/")+path, body)
	if err != nil {
		return nil, err
	}
	req.Header.Set("Authorization", "Bearer "+c.APIKey)
	req.Header.Set("Content-Type", contentType)
	return c.do(req)
}

func (c HTTPClient) do(req *http.Request) ([]byte, error) {
	resp, err := c.httpClient().Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	data, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}
	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		return nil, fmt.Errorf("openai %s failed: %s", resp.Status, string(data))
	}
	return data, nil
}

func (c HTTPClient) httpClient() *http.Client {
	if c.Client != nil {
		return c.Client
	}
	return http.DefaultClient
}

func (c HTTPClient) baseURL() string {
	if c.BaseURL != "" {
		return c.BaseURL
	}
	return "https://api.openai.com"
}

func (c HTTPClient) imageModel() string {
	if c.ImageModel != "" {
		return c.ImageModel
	}
	return "gpt-image-2"
}

func (c HTTPClient) visionModel() string {
	if c.VisionModel != "" {
		return c.VisionModel
	}
	return "gpt-4o"
}

func responsesPayload(model string, text string, dataURL string, schemaName string, schema map[string]any) map[string]any {
	payload := map[string]any{
		"model": model,
		"input": []any{
			map[string]any{
				"role": "user",
				"content": []any{
					map[string]any{"type": "input_text", "text": text},
					map[string]any{"type": "input_image", "image_url": dataURL},
				},
			},
		},
	}
	if schemaName != "" && schema != nil {
		payload["text"] = map[string]any{
			"format": map[string]any{
				"type":   "json_schema",
				"name":   schemaName,
				"schema": schema,
				"strict": true,
			},
		}
	}
	return payload
}

func decodeImageResponse(ctx context.Context, client *http.Client, data []byte) (image.Image, error) {
	var payload struct {
		Data []struct {
			B64JSON string `json:"b64_json"`
			URL     string `json:"url"`
		} `json:"data"`
	}
	if err := json.Unmarshal(data, &payload); err != nil {
		return nil, err
	}
	if len(payload.Data) == 0 {
		return nil, fmt.Errorf("image response contained no data")
	}
	if payload.Data[0].B64JSON != "" {
		raw, err := base64.StdEncoding.DecodeString(payload.Data[0].B64JSON)
		if err != nil {
			return nil, err
		}
		img, _, err := image.Decode(bytes.NewReader(raw))
		return img, err
	}
	if payload.Data[0].URL != "" {
		req, err := http.NewRequestWithContext(ctx, http.MethodGet, payload.Data[0].URL, nil)
		if err != nil {
			return nil, err
		}
		resp, err := client.Do(req)
		if err != nil {
			return nil, err
		}
		defer resp.Body.Close()
		img, _, err := image.Decode(resp.Body)
		return img, err
	}
	return nil, fmt.Errorf("image response had neither b64_json nor url")
}

func responseText(data []byte) (string, error) {
	var payload struct {
		OutputText string `json:"output_text"`
		Output     []struct {
			Content []struct {
				Text string `json:"text"`
				Type string `json:"type"`
			} `json:"content"`
		} `json:"output"`
	}
	if err := json.Unmarshal(data, &payload); err != nil {
		return "", err
	}
	if payload.OutputText != "" {
		return payload.OutputText, nil
	}
	for _, output := range payload.Output {
		for _, content := range output.Content {
			if content.Text != "" {
				return content.Text, nil
			}
		}
	}
	return "", fmt.Errorf("responses payload had no output text")
}

func imageDataURL(img image.Image) (string, error) {
	data, err := encodePNG(img)
	if err != nil {
		return "", err
	}
	return "data:image/png;base64," + base64.StdEncoding.EncodeToString(data), nil
}

func encodePNG(img image.Image) ([]byte, error) {
	var buf bytes.Buffer
	if err := png.Encode(&buf, img); err != nil {
		return nil, err
	}
	return buf.Bytes(), nil
}

func writePart(writer *multipart.Writer, fieldName string, fileName string, data []byte) error {
	part, err := writer.CreateFormFile(fieldName, fileName)
	if err != nil {
		return err
	}
	_, err = part.Write(data)
	return err
}

func combineForVision(left, right image.Image) image.Image {
	leftBounds := left.Bounds()
	rightBounds := right.Bounds()
	combined := image.NewRGBA(image.Rect(0, 0, leftBounds.Dx()+rightBounds.Dx(), max(leftBounds.Dy(), rightBounds.Dy())))
	drawImage(combined, left, image.Point{})
	drawImage(combined, right, image.Pt(leftBounds.Dx(), 0))
	return combined
}

func drawImage(dst *image.RGBA, src image.Image, at image.Point) {
	bounds := src.Bounds()
	for y := 0; y < bounds.Dy(); y++ {
		for x := 0; x < bounds.Dx(); x++ {
			dst.Set(at.X+x, at.Y+y, src.At(bounds.Min.X+x, bounds.Min.Y+y))
		}
	}
}

func imageSize(size schema.Size) string {
	return fmt.Sprintf("%dx%d", size.W, size.H)
}

func extractJSONObject(text string) string {
	start := strings.Index(text, "{")
	end := strings.LastIndex(text, "}")
	if start >= 0 && end >= start {
		return text[start : end+1]
	}
	return text
}

func envDefault(key string, fallback string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return fallback
}

func plannerSchema() map[string]any {
	box := map[string]any{
		"type":                 "object",
		"additionalProperties": false,
		"properties": map[string]any{
			"x": map[string]any{"type": "integer"},
			"y": map[string]any{"type": "integer"},
			"w": map[string]any{"type": "integer"},
			"h": map[string]any{"type": "integer"},
		},
		"required": []string{"x", "y", "w", "h"},
	}
	candidate := map[string]any{
		"type":                 "object",
		"additionalProperties": false,
		"properties": map[string]any{
			"candidateId":          map[string]any{"type": "string"},
			"objectName":           map[string]any{"type": "string"},
			"diffType":             map[string]any{"type": "string", "enum": []string{"color_change", "add_large_object", "remove_large_object", "accessory_add_or_remove"}},
			"visibilityScore":      map[string]any{"type": "number"},
			"isolationScore":       map[string]any{"type": "number"},
			"editRiskScore":        map[string]any{"type": "number"},
			"childDifficultyScore": map[string]any{"type": "number"},
			"childFriendlyScore":   map[string]any{"type": "number"},
			"approxBox":            box,
			"editInstruction":      map[string]any{"type": "string"},
			"reason":               map[string]any{"type": "string"},
		},
		"required": []string{"candidateId", "objectName", "diffType", "visibilityScore", "isolationScore", "editRiskScore", "childDifficultyScore", "childFriendlyScore", "approxBox", "editInstruction", "reason"},
	}
	return map[string]any{
		"type":                 "object",
		"additionalProperties": false,
		"properties": map[string]any{
			"candidates": map[string]any{
				"type":  "array",
				"items": candidate,
			},
		},
		"required": []string{"candidates"},
	}
}

func verifierSchema() map[string]any {
	difference := map[string]any{
		"type":                 "object",
		"additionalProperties": false,
		"properties": map[string]any{
			"candidateId":     map[string]any{"type": "string"},
			"label":           map[string]any{"type": "string"},
			"componentIds":    map[string]any{"type": "array", "items": map[string]any{"type": "integer"}},
			"isChildFriendly": map[string]any{"type": "boolean"},
			"isCoveredByBbox": map[string]any{"type": "boolean"},
			"confidence":      map[string]any{"type": "number"},
		},
		"required": []string{"candidateId", "label", "componentIds", "isChildFriendly", "isCoveredByBbox", "confidence"},
	}
	repair := map[string]any{
		"type":                 "object",
		"additionalProperties": false,
		"properties": map[string]any{
			"reason":      map[string]any{"type": "string"},
			"description": map[string]any{"type": "string"},
			"bbox": map[string]any{
				"type":                 "object",
				"additionalProperties": false,
				"properties": map[string]any{
					"x": map[string]any{"type": "integer"},
					"y": map[string]any{"type": "integer"},
					"w": map[string]any{"type": "integer"},
					"h": map[string]any{"type": "integer"},
				},
				"required": []string{"x", "y", "w", "h"},
			},
		},
		"required": []string{"reason", "description", "bbox"},
	}
	return map[string]any{
		"type":                 "object",
		"additionalProperties": false,
		"properties": map[string]any{
			"visibleDifferenceCount":       map[string]any{"type": "integer"},
			"hasUnlistedVisibleDifference": map[string]any{"type": "boolean"},
			"hasAmbiguousDifference":       map[string]any{"type": "boolean"},
			"differences":                  map[string]any{"type": "array", "items": difference},
			"repairRequests":               map[string]any{"type": "array", "items": repair},
			"confidence":                   map[string]any{"type": "number"},
		},
		"required": []string{"visibleDifferenceCount", "hasUnlistedVisibleDifference", "hasAmbiguousDifference", "differences", "repairRequests", "confidence"},
	}
}
