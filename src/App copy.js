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

  const handleSubmit = async () => {
    setLoading(true);
    setResult(null);

    try {
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("http://localhost:2000/analyze-csv", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        setResult(data);
      } else if (url) {
        const res = await fetch("http://localhost:2000/analyze-url", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
        });
        const data = await res.json();
        setResult(data);
      }
    } catch (error) {
      setResult({ error: "Something went wrong while connecting to backend." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      // maxWidth="md"
      sx={{
        // mt: 8,
        p: 4,
        backgroundColor: "#fff",
        borderRadius: 3,
        // boxShadow: 3,
      }}
    >
      <Typography
        variant="h5"
        align="center"
        fontWeight="bold"
        padding={5}
        gutterBottom
      >
        🔍 CSV / Website Analyzer
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 3,
          mt: 4,
        }}
      >
        {/* ===== Left Side: Upload & Input ===== */}
        <Paper
          variant="outlined"
          sx={{
            p: 3,
            borderStyle: "dashed",
            borderColor: "#ccc",
            textAlign: "center",
          }}
        >
          <UploadFileIcon color="action" sx={{ fontSize: 40, mb: 1 }} />
          <Typography variant="body1">
            {file ? file.name : "Attach a CSV File"}
          </Typography>
          <Button variant="contained" component="label" sx={{ mt: 2 }}>
            Upload CSV
            <input
              type="file"
              accept=".csv"
              hidden
              onChange={(e) => setFile(e.target.files[0])}
            />
          </Button>

          <Divider sx={{ my: 3 }}>or</Divider>

          <Box display="flex" alignItems="center" gap={1}>
            <LanguageIcon color="action" />
            <TextField
              label="Website URL"
              fullWidth
              variant="outlined"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </Box>

          <Button
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 4 }}
            endIcon={
              loading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <SendIcon />
              )
            }
            onClick={handleSubmit}
            disabled={loading || (!file && !url)}
          >
            {loading ? "Processing..." : "Send"}
          </Button>
        </Paper>

        {/* ===== Right Side: Result ===== */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            backgroundColor: "#f9f9f9",
            border: "1px solid #ddd",
            borderRadius: 2,
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 300,
          }}
        >
          {!result ? (
            <Typography variant="body2" color="textSecondary">
              Results will appear here →
            </Typography>
          ) : result.error ? (
            <Alert severity="error">{result.error}</Alert>
          ) : result.csv ? (
            <Box>
              <CloudDownloadIcon sx={{ color: "green", fontSize: 40, mb: 1 }} />
              <Typography variant="h6" color="green">
                {result.message}
              </Typography>
              <Button
                variant="outlined"
                sx={{ mt: 2 }}
                href={`/${result.csv}`}
                download
              >
                Download Modified CSV
              </Button>
            </Box>
          ) : (
            <Box>
              <Typography
                variant="h6"
                color={result.isGood ? "green" : "error"}
                fontWeight="bold"
              >
                {result.isGood ? "Good Website ✅" : "Bad Website ❌"}
              </Typography>
              {/* <Typography variant="body1" sx={{ mt: 1 }}>
                {result.reason}
              </Typography> */}
              <AnalysisResult content={result.reason} />
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  );
}

export default App;
