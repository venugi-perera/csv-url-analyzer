import React from "react";
import {
  Box,
  Typography,
  Paper,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function AnalysisResult({ content }) {
  // Split sections by headings (###)
  const sections = content
    .split(/###\s+/)
    .filter((section) => section.trim().length > 0);

  return (
    <Box
      elevation={3}
      sx={{
        p: 3,
        borderRadius: 3,
        backgroundColor: "#fdfdfd",
        maxHeight: 600,
        overflowY: "auto",
        scrollbarWidth: "thin",
      }}
    >
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        🧠 Website Quality Analysis Report
      </Typography>
      <Divider sx={{ mb: 2 }} />

      {sections.map((section, index) => {
        const titleMatch = section.match(/^\*\*(.*?)\*\*/); // Extract title
        const resultMatch = section.match(/\*\*Result:\*\*\s*(Good|Bad)/i);
        const reasonMatch = section.match(/\*\*Reason:\*\*\s*([\s\S]*)/i);

        const title = titleMatch ? titleMatch[1] : `Section ${index + 1}`;
        const result = resultMatch ? resultMatch[1] : null;
        const reason = reasonMatch ? reasonMatch[1].trim() : section;

        return (
          <Accordion
            key={index}
            defaultExpanded={index < 2}
            sx={{
              mb: 1,
              borderRadius: 2,
              "&:before": { display: "none" },
            }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography sx={{ flexGrow: 1, fontWeight: "bold" }}>
                {title}
              </Typography>
              {result && (
                <Chip
                  label={result}
                  color={result === "Good" ? "success" : "error"}
                  size="small"
                />
              )}
            </AccordionSummary>
            <AccordionDetails>
              <Typography
                variant="body2"
                sx={{
                  whiteSpace: "pre-line",
                  color: "#333",
                  lineHeight: 1.6,
                }}
              >
                {reason.replace(/\*\*/g, "")}
              </Typography>
            </AccordionDetails>
          </Accordion>
        );
      })}

      <Divider sx={{ my: 2 }} />

      {/* Overall Summary */}
      {content.includes("Overall Assessment") && (
        <Box sx={{ mt: 2, p: 2, borderRadius: 2, backgroundColor: "#f5f9f5" }}>
          <Typography variant="h6" fontWeight="bold" color="primary">
            🏁 Overall Assessment
          </Typography>
          <Typography
            variant="body1"
            sx={{ mt: 1, whiteSpace: "pre-line", color: "text.secondary" }}
          >
            {content.split("### **Overall Assessment:**")[1]?.trim() ||
              "No summary provided."}
          </Typography>
        </Box>
      )}
    </Box>
  );
}
