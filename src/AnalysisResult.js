// frontend/src/AnalysisResult.js
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

export default function AnalysisResult({ title = "Report", content }) {
  if (!content) {
    return (
      <Paper sx={{ p: 2 }}>
        <Typography variant="body2" color="text.secondary">
          No analysis yet
        </Typography>
      </Paper>
    );
  }

  // If content is a raw string, attempt to split like your sample.
  const sections =
    typeof content === "string"
      ? content.split(/###\s+/).filter((s) => s.trim())
      : // if content is already structured, map accordingly
        [];

  return (
    <Paper
      elevation={3}
      sx={{ p: 2, borderRadius: 2, maxHeight: 640, overflow: "auto" }}
    >
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        🧾 {title}
      </Typography>
      <Divider sx={{ mb: 1 }} />

      {sections.length > 0 ? (
        sections.map((section, idx) => {
          const titleMatch = section.match(/^\*\*(.*?)\*\*/);
          const resultMatch = section.match(/\*\*Result:\*\*\s*(Good|Bad)/i);
          const reasonMatch = section.match(/\*\*Reason:\*\*\s*([\s\S]*)/i);
          const heading = titleMatch ? titleMatch[1] : `Section ${idx + 1}`;
          const result = resultMatch ? resultMatch[1] : null;
          const reason = reasonMatch ? reasonMatch[1].trim() : section;

          return (
            <Accordion key={idx} defaultExpanded={idx < 2} sx={{ mb: 1 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography sx={{ flexGrow: 1, fontWeight: "bold" }}>
                  {heading}
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
                <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
                  {reason.replace(/\*\*/g, "")}
                </Typography>
              </AccordionDetails>
            </Accordion>
          );
        })
      ) : (
        <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
          {content}
        </Typography>
      )}
    </Paper>
  );
}
