import { useState, useCallback } from "react";
import Papa from "papaparse";
import { Upload, FileText, BarChart3, CheckCircle2, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export interface DatasetResult {
  total_matches: number;
  accuracy: number;
  sample_data: Array<Record<string, string>>;
}

interface CsvUploadProps {
  onResult: (result: DatasetResult) => void;
}

const CsvUpload = ({ onResult }: CsvUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processFile = useCallback(
    (file: File) => {
      setFileName(file.name);
      setIsProcessing(true);
      setError(null);

      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          try {
            const rawData = results.data as Record<string, string>[];
            // Normalize all column names to lowercase
            const data = rawData.map((row) => {
              const normalized: Record<string, string> = {};
              for (const key of Object.keys(row)) {
                normalized[key.toLowerCase().trim()] = row[key];
              }
              return normalized;
            });

            // Map alternative column names
            const headers = Object.keys(data[0] || {});
            const columnMap: Record<string, string> = {
              batting_team: "team1",
              bowling_team: "team2",
              match_won_by: "winner",
            };

            const mapped = data.map((row) => {
              const out: Record<string, string> = {};
              for (const [key, val] of Object.entries(row)) {
                out[columnMap[key] || key] = val;
              }
              return out;
            });

            const required = ["team1", "team2", "toss_winner", "winner"];
            const mappedHeaders = Object.keys(mapped[0] || {});
            const missing = required.filter((r) => !mappedHeaders.includes(r));

            if (missing.length > 0) {
              setError(`Missing columns: ${missing.join(", ")}`);
              setIsProcessing(false);
              return;
            }

            let correct = 0;
            const processed = mapped.map((row) => {
              const predicted_winner = row.toss_winner || "";
              if (predicted_winner === row.winner) correct++;
              return { ...row, predicted_winner };
            });

            const result: DatasetResult = {
              total_matches: processed.length,
              accuracy: processed.length > 0 ? parseFloat(((correct / processed.length) * 100).toFixed(2)) : 0,
              sample_data: processed.slice(0, 10),
            };

            onResult(result);
            setIsProcessing(false);
          } catch {
            setError("Failed to process CSV file");
            setIsProcessing(false);
          }
        },
        error: () => {
          setError("Failed to parse CSV file");
          setIsProcessing(false);
        },
      });
    },
    [onResult]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file && file.name.endsWith(".csv")) processFile(file);
      else setError("Please upload a .csv file");
    },
    [processFile]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <FileText className="h-5 w-5 text-primary" />
          Upload Dataset
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-all duration-200 ${
            isDragging
              ? "border-primary bg-primary/5"
              : "border-border/50 hover:border-primary/50 hover:bg-secondary/30"
          }`}
        >
          <Upload className={`mb-3 h-10 w-10 ${isDragging ? "text-primary" : "text-muted-foreground"}`} />
          <p className="mb-1 text-sm font-medium">
            {isProcessing ? "Processing..." : "Drop your IPL matches CSV here"}
          </p>
          <p className="mb-4 text-xs text-muted-foreground">
            Required: team1, team2, toss_winner, winner
          </p>
          <label>
            <input type="file" accept=".csv" onChange={handleFileSelect} className="hidden" />
            <Button variant="outline" size="sm" asChild className="cursor-pointer">
              <span>Browse Files</span>
            </Button>
          </label>
          {fileName && !error && (
            <p className="mt-3 flex items-center gap-1.5 text-xs text-success">
              <CheckCircle2 className="h-3.5 w-3.5" />
              {fileName}
            </p>
          )}
          {error && (
            <p className="mt-3 flex items-center gap-1.5 text-xs text-destructive">
              <XCircle className="h-3.5 w-3.5" />
              {error}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CsvUpload;
