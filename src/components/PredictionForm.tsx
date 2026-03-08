import { useState } from "react";
import { Zap, Trophy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const IPL_TEAMS = [
  "Chennai Super Kings",
  "Delhi Capitals",
  "Gujarat Titans",
  "Kolkata Knight Riders",
  "Lucknow Super Giants",
  "Mumbai Indians",
  "Punjab Kings",
  "Rajasthan Royals",
  "Royal Challengers Bangalore",
  "Sunrisers Hyderabad",
];

const PredictionForm = () => {
  const [form, setForm] = useState({
    team1: "",
    team2: "",
    toss_winner: "",
    toss_decision: "",
    venue: "",
    city: "",
  });
  const [prediction, setPrediction] = useState<string | null>(null);

  const handlePredict = () => {
    if (!form.team1 || !form.team2 || !form.toss_winner) return;
    setPrediction(form.toss_winner);
  };

  const tossTeams = [form.team1, form.team2].filter(Boolean);

  return (
    <div className="space-y-4">
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Zap className="h-5 w-5 text-primary" />
            Match Prediction
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Batting Team</Label>
              <Select value={form.team1} onValueChange={(v) => setForm({ ...form, team1: v, toss_winner: "" })}>
                <SelectTrigger><SelectValue placeholder="Select batting team" /></SelectTrigger>
                <SelectContent>
                  {IPL_TEAMS.filter((t) => t !== form.team2).map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Bowling Team</Label>
              <Select value={form.team2} onValueChange={(v) => setForm({ ...form, team2: v, toss_winner: "" })}>
                <SelectTrigger><SelectValue placeholder="Select bowling team" /></SelectTrigger>
                <SelectContent>
                  {IPL_TEAMS.filter((t) => t !== form.team1).map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Toss Winner</Label>
              <Select value={form.toss_winner} onValueChange={(v) => setForm({ ...form, toss_winner: v })}>
                <SelectTrigger><SelectValue placeholder="Select toss winner" /></SelectTrigger>
                <SelectContent>
                  {tossTeams.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Toss Decision</Label>
              <Select value={form.toss_decision} onValueChange={(v) => setForm({ ...form, toss_decision: v })}>
                <SelectTrigger><SelectValue placeholder="Select decision" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="bat">Bat</SelectItem>
                  <SelectItem value="field">Field</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Venue</Label>
              <Input
                placeholder="e.g. Wankhede Stadium"
                value={form.venue}
                onChange={(e) => setForm({ ...form, venue: e.target.value })}
                className="bg-secondary/50"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">City</Label>
              <Input
                placeholder="e.g. Mumbai"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="bg-secondary/50"
              />
            </div>
          </div>
          <Button
            onClick={handlePredict}
            disabled={!form.team1 || !form.team2 || !form.toss_winner}
            className="w-full font-heading font-semibold"
          >
            <Zap className="mr-2 h-4 w-4" />
            Predict Winner
          </Button>
        </CardContent>
      </Card>

      {prediction && (
        <Card className="border-primary/30 bg-card/80 backdrop-blur-sm animate-pulse-glow">
          <CardContent className="flex flex-col items-center py-8">
            <Trophy className="mb-3 h-10 w-10 text-primary" />
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Predicted Winner</p>
            <p className="text-2xl font-bold font-heading text-primary">{prediction}</p>
            <p className="mt-2 text-xs text-muted-foreground">Based on: toss_winner rule</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PredictionForm;
