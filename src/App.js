// frontend/src/App.js
import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  Typography,
  TextField,
  Paper,
  Divider,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Link,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import SendIcon from "@mui/icons-material/Send";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import LanguageIcon from "@mui/icons-material/Language";
import AnalysisResult from "./AnalysisResult";

function App() {
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [csvPreview, setCsvPreview] = useState([]);
  const [downloadUrl, setDownloadUrl] = useState(null);

  const handleSubmit = async () => {
    setLoading(true);
    setResult(null);
    setCsvPreview([]);
    setDownloadUrl(null);

    try {
      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/analyze-csv`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || "CSV upload failed");
        }

        const data = await res.json();
        // data.rows is preview, data.downloadUrl is the path to file
        setCsvPreview(data.rows || []);
        setResult({ type: "csv", message: data.message });
        if (data.downloadUrl) {
          setDownloadUrl(
            `${process.env.REACT_APP_API_BASE_URL}${data.downloadUrl}`
          );
        }
      } else if (url) {
        const res = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/analyze-url`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url }),
          }
        );
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || "URL analysis failed");
        }
        const data = await res.json();
        setResult({ type: "url", ...data });
      }
    } catch (error) {
      setResult({
        error:
          error.message || "Something went wrong while connecting to backend.",
      });
    } finally {
      setLoading(false);
      setUrl("");
      setFile(null);
    }
  };

  // quick CSV preview reader (for local preview before upload)
  const handleFileChange = (f) => {
    setFile(f);
    // optional: read first lines to show preview on client
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const lines = text.split("\n").slice(0, 8).filter(Boolean);
      const headers =
        lines[0]?.split(",").map((h) => h.trim().toLowerCase()) || [];
      const rows = lines.slice(1).map((ln) => {
        const cols = ln.split(",");
        const obj = {};
        headers.forEach((h, i) => (obj[h] = cols[i] || ""));
        return obj;
      });
      setCsvPreview(rows);
    };
    reader.readAsText(f);
  };

  return (
    <Container sx={{ mt: 6 }}>
      <Typography variant="h4" align="center" gutterBottom>
        🔍 CSV & Website Analyzer
      </Typography>

      <Box
        sx={{
          display: "flex",
          gap: 3,
          mt: 8,
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        {/* Left: Upload/URL */}
        <Paper
          sx={{
            flex: 0.4, // smaller left panel
            p: 3,
            borderRadius: 2,
            backgroundColor: "#fafafa",
            minWidth: { md: 260 }, // keep compact
          }}
        >
          <Typography variant="h6" sx={{ fontSize: "1rem" }}>
            Input
          </Typography>

          <Paper
            variant="outlined"
            sx={{
              mt: 2,
              p: 2,
              borderStyle: "dashed",
              textAlign: "center",
              fontSize: "0.85rem",
            }}
          >
            <UploadFileIcon sx={{ fontSize: 32 }} />
            <Typography sx={{ fontSize: "0.85rem" }}>
              {file ? file.name : "Attach a CSV file"}
            </Typography>
            <Button variant="contained" component="label" sx={{ mt: 1 }}>
              Choose CSV
              <input
                type="file"
                accept=".csv"
                hidden
                onChange={(e) => handleFileChange(e.target.files[0])}
              />
            </Button>
          </Paper>

          <Divider sx={{ my: 2 }}>or</Divider>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <LanguageIcon fontSize="small" />
            <TextField
              fullWidth
              label="Website URL"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              size="small"
              InputLabelProps={{ sx: { fontSize: "0.85rem" } }}
              inputProps={{ style: { fontSize: "0.85rem" } }}
            />
          </Box>

          <Button
            variant="contained"
            fullWidth
            sx={{ mt: 2, fontSize: "0.85rem", py: 1 }}
            onClick={handleSubmit}
            disabled={loading || (!file && !url)}
            endIcon={
              loading ? (
                <CircularProgress size={18} color="inherit" />
              ) : (
                <SendIcon />
              )
            }
          >
            {loading ? "Processing…" : "Analyze"}
          </Button>
        </Paper>

        {/* Right: Results */}
        <Paper
          sx={{
            flex: 0.9,
            p: 2,
            borderRadius: 2,
            backgroundColor: "#fafafa",
            minWidth: { md: 280 },
            fontSize: "0.9rem",
            "& .MuiTextField-root": { fontSize: "0.9rem" },
            "& .MuiTypography-root": { fontSize: "0.9rem" },
          }}
        >
          {!result ? (
            <Typography
              color="text.secondary"
              sx={{ mt: 4, textAlign: "center" }}
            >
              Results will appear here →
            </Typography>
          ) : result.error ? (
            <Alert severity="error">{result.error}</Alert>
          ) : result.type === "csv" ? (
            <>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography variant="h6">CSV Analysis</Typography>
                {downloadUrl && (
                  <Link
                    href={downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    underline="none"
                  >
                    <Button startIcon={<CloudDownloadIcon />}>
                      Download CSV
                    </Button>
                  </Link>
                )}
              </Box>

              <Typography variant="body2" sx={{ mt: 1 }}>
                {result.message}
              </Typography>

              <Divider sx={{ my: 1 }} />

              <Typography variant="subtitle2" sx={{ mt: 1 }}>
                Preview results (first {csvPreview.length} rows)
              </Typography>

              {/* If backend provided preview rows (with status/reason), show them */}
              {csvPreview && csvPreview.length > 0 ? (
                <Box sx={{ mt: 1, maxHeight: 280, overflow: "auto" }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        {Object.keys(csvPreview[0]).map((h) => (
                          <TableCell key={h} sx={{ fontWeight: "bold" }}>
                            {h}
                          </TableCell>
                        ))}
                        {/* backend preview rows may include status/reason; we don't rely on it here */}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {csvPreview.map((r, i) => (
                        <TableRow key={i}>
                          {Object.keys(r).map((k) => (
                            <TableCell key={k}>{r[k]}</TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No preview available.
                </Typography>
              )}
            </>
          ) : (
            // URL result object
            <>
              <Typography variant="h6">Website Analysis</Typography>
              <Divider sx={{ my: 1 }} />
              <Typography
                variant="subtitle1"
                sx={{
                  color: result.isGood ? "green" : "error",
                  fontWeight: "bold",
                }}
              >
                {result.isGood ? "Good Website ✅" : "Bad Website ❌"}
              </Typography>

              <Box sx={{ mt: 1 }}>
                <AnalysisResult content={result.reason} />
                {result.raw && (
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      Raw AI response (collapsed for readability)
                    </Typography>
                  </Box>
                )}
              </Box>
            </>
          )}
        </Paper>
      </Box>
    </Container>
  );
}

export default App;
