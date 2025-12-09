"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { VoteResultCard } from "@/components/vote-result-card";
import { VotePieChart } from "@/components/vote-pie-chart";
import { Navbar } from "@/components/navbar";
import { QRScanSummary } from "@/components/qr-scan-summary";
import type { QRScanAttempt } from "@/components/qr-scan-summary";
import { USE_MOCK_DATA, mockVoteResults, mockQRScanResponse } from "@/mockData";

interface Candidate {
  id: string;
  name: string;
  team: string;
  image: string;
  color: string;
}

interface VoteResults {
  electionId: number;
  results: Record<string, number>;
}

interface QRScanResponse {
  content: QRScanAttempt[];
  totalElements: number;
}

const NULL_VOTES_UUID = "00000000-0000-0000-0000-000000000000";

export default function App() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [voteResults, setVoteResults] = useState<VoteResults | null>(null);
  const [qrScanAttempts, setQrScanAttempts] = useState<QRScanAttempt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const candidatesRes = await fetch("/candidates.json");
      const candidatesData = await candidatesRes.json();
      setCandidates(candidatesData);
      try {
        if (USE_MOCK_DATA) {
          setVoteResults(mockVoteResults);
          setQrScanAttempts(mockQRScanResponse.content);
        } else {
          // Fetch vote results
          const votesRes = await fetch("/api/get-votes");
          const votesData = await votesRes.json();
          setVoteResults(votesData);

          // Fetch QR scan attempts
          const qrRes = await fetch("/qr-api/qr-scan-attempt");
          const qrData: QRScanResponse = await qrRes.json();
          setQrScanAttempts(qrData.content);

          // Process QR scan data for console
          const scanSummary: Record<string, number> = {};
          qrData.content.forEach((scan) => {
            scanSummary[scan.qrScanStatus] =
              (scanSummary[scan.qrScanStatus] || 0) + 1;
          });
        }
      } catch (error) {
        console.error("[v0] Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-2xl text-muted-foreground">
          Cargando resultados...
        </div>
      </div>
    );
  }

  if (!voteResults || candidates.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-2xl text-muted-foreground">
          No hay datos disponibles
        </div>
      </div>
    );
  }

  const nullVotes = voteResults.results[NULL_VOTES_UUID] || 0;
  const candidateVotes = { ...voteResults.results };
  delete candidateVotes[NULL_VOTES_UUID];

  const totalVotes = Object.values(voteResults.results).reduce(
    (sum, votes) => sum + votes,
    0
  );

  const candidatesWithVotes = candidates.map((candidate) => ({
    ...candidate,
    votes: voteResults.results[candidate.id] || 0,
    percentage:
      totalVotes > 0
        ? ((voteResults.results[candidate.id] || 0) / totalVotes) * 100
        : 0,
  }));

  candidatesWithVotes.sort((a, b) => b.votes - a.votes);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />

      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Total Voters Card */}
        <Card className="mb-8 md:mb-12 p-8 bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 border-0 shadow-xl">
          <div className="text-center">
            <p className="text-blue-100 text-lg mb-2 font-medium">
              Total de Votantes
            </p>
            <p className="text-6xl md:text-7xl font-bold text-white">
              {(totalVotes - nullVotes).toLocaleString('es-AR')}
            </p>
          </div>
        </Card>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Candidate Results List - Left Side */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-6">
              Resultados por Candidato
            </h2>
            {candidatesWithVotes.map((candidate, index) => (
              <VoteResultCard
                key={candidate.id}
                candidate={candidate}
                rank={index + 1}
              />
            ))}
          </div>

          {/* Pie Chart - Right Side */}
          <div className="lg:sticky lg:top-8">
            <Card className="p-6 shadow-lg">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-6">
                Distribución de Votos
              </h2>
              <VotePieChart data={candidatesWithVotes} />
            </Card>

            {nullVotes > 0 && (
              <Card className="mt-8 md:mt-12 p-6 dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-1">
                      Votos Nulos
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Votos que no fueron asignados a ningún candidato
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-4xl font-bold text-slate-900 dark:text-slate-50">
                      {nullVotes.toLocaleString('es-AR')}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                      {((nullVotes / (totalVotes + nullVotes)) * 100).toLocaleString('es-AR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                      %
                    </p>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* QR Scan Summary Section */}
        {qrScanAttempts.length > 0 && (
          <div className="mt-12">
            <QRScanSummary scanAttempts={qrScanAttempts} />
          </div>
        )}
      </div>
    </div>
  );
}
