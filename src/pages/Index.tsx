import { useState } from "react";
import { Activity } from "lucide-react";
import CsvUpload, { type DatasetResult } from "@/components/CsvUpload";
import DatasetStats from "@/components/DatasetStats";
import PredictionForm from "@/components/PredictionForm";

const Index = () => {
  const [datasetResult, setDatasetResult] = useState<DatasetResult | null>(null);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container flex items-center gap-3 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
            <Activity className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-bold font-heading tracking-tight">
              IPL Match Predictor
            </h1>
            <p className="text-xs text-muted-foreground">
              Upload dataset & predict match outcomes
            </p>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container py-6 space-y-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Left column */}
          <div className="space-y-6">
            <CsvUpload onResult={setDatasetResult} />
            <PredictionForm />
          </div>

          {/* Right column */}
          <div>
            {datasetResult ? (
              <DatasetStats result={datasetResult} />
            ) : (
              <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-border/50 p-12">
                <div className="text-center">
                  <Activity className="mx-auto mb-3 h-10 w-10 text-muted-foreground/30" />
                  <p className="text-sm text-muted-foreground">
                    Upload a dataset to see statistics
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
