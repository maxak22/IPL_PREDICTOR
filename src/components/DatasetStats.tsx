import { BarChart3, Target, Hash, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DatasetResult } from "./CsvUpload";

const DatasetStats = ({ result }: { result: DatasetResult }) => {
  const correct = Math.round((result.accuracy / 100) * result.total_matches);
  const incorrect = result.total_matches - correct;

  const stats = [
    { label: "Total Matches", value: result.total_matches, icon: Hash, color: "text-accent" },
    { label: "Accuracy", value: `${result.accuracy}%`, icon: Target, color: "text-primary" },
    { label: "Correct", value: correct, icon: TrendingUp, color: "text-success" },
    { label: "Incorrect", value: incorrect, icon: BarChart3, color: "text-destructive" },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardContent className="flex flex-col items-center p-4">
              <s.icon className={`mb-2 h-5 w-5 ${s.color}`} />
              <p className="text-2xl font-bold font-heading">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Accuracy bar */}
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-muted-foreground">Prediction Accuracy</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-3 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-700"
              style={{ width: `${result.accuracy}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Rule: predicted_winner = toss_winner
          </p>
        </CardContent>
      </Card>

      {/* Sample data table */}
      {result.sample_data.length > 0 && (
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Sample Data (first 10)</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border/50 bg-secondary/50">
                    {["batting_team", "bowling_team", "toss_winner", "match_won_by", "predicted_winner", "result"].map((h) => (
                      <th key={h} className="px-3 py-2 text-left font-medium text-muted-foreground whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {result.sample_data.map((row, i) => (
                    <tr key={i} className="border-b border-border/30 last:border-0">
                      <td className="px-3 py-2 whitespace-nowrap">{row.team1}</td>
                      <td className="px-3 py-2 whitespace-nowrap">{row.team2}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-primary">{row.toss_winner}</td>
                      <td className="px-3 py-2 whitespace-nowrap">{row.winner}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-accent">{row.predicted_winner}</td>
                      <td className="px-3 py-2">
                        {row.predicted_winner === row.winner ? (
                          <span className="text-success">✓</span>
                        ) : (
                          <span className="text-destructive">✗</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DatasetStats;
