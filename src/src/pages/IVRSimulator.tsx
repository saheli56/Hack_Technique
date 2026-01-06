import { useMemo, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

type TwiMLParseResult = {
  says: string[];
  gatherAction?: string;
  gatherNumDigits?: number;
};

function parseTwiML(xmlText: string): TwiMLParseResult {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlText, "text/xml");

  const sayNodes = Array.from(doc.getElementsByTagName("Say"));
  const says = sayNodes
    .map((n) => (n.textContent ?? "").trim())
    .filter(Boolean);

  const gather = doc.getElementsByTagName("Gather")[0];
  const gatherAction = gather?.getAttribute("action") ?? undefined;
  const gatherNumDigitsRaw = gather?.getAttribute("numDigits") ?? undefined;
  const gatherNumDigits = gatherNumDigitsRaw ? Number(gatherNumDigitsRaw) : undefined;

  return { says, gatherAction, gatherNumDigits };
}

function toAbsoluteUrl(baseUrl: string, action?: string) {
  if (!action) return undefined;
  // Twilio action can be relative like /api/ivr/main-menu?lang=hi
  if (action.startsWith("http://") || action.startsWith("https://")) return action;
  if (action.startsWith("/")) return `${baseUrl}${action}`;
  return `${baseUrl}/${action}`;
}

async function postForm(url: string, payload: Record<string, string>) {
  const body = new URLSearchParams(payload);
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body
  });

  const text = await res.text();
  if (!res.ok) {
    throw new Error(`Request failed (${res.status}): ${text}`);
  }
  return text;
}

const DEFAULT_API_BASE = "http://localhost:3001";

const digitLayout = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
  ["*", "0", "#"]
];

export default function IVRSimulator() {
  const [apiBaseUrl, setApiBaseUrl] = useState(DEFAULT_API_BASE);
  const [callSid, setCallSid] = useState(() => `DEMO_${Date.now()}`);
  const [fromNumber, setFromNumber] = useState("+919876543210");
  const [toNumber, setToNumber] = useState("+17656272931");

  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [currentActionUrl, setCurrentActionUrl] = useState<string | undefined>(undefined);
  const [expectedDigits, setExpectedDigits] = useState<number | undefined>(undefined);

  const [spokenLog, setSpokenLog] = useState<string[]>([]);
  const [xmlLog, setXmlLog] = useState<string[]>([]);

  const canSendDigit = useMemo(() => Boolean(currentActionUrl) && !isBusy, [currentActionUrl, isBusy]);

  const handleResponse = (xmlText: string) => {
    setXmlLog((prev) => [xmlText, ...prev].slice(0, 20));

    const parsed = parseTwiML(xmlText);
    if (parsed.says.length) {
      setSpokenLog((prev) => [...prev, ...parsed.says].slice(-200));
    }

    const nextActionUrl = toAbsoluteUrl(apiBaseUrl, parsed.gatherAction);
    setCurrentActionUrl(nextActionUrl);
    setExpectedDigits(parsed.gatherNumDigits);
  };

  const startCall = async () => {
    setIsBusy(true);
    setError(null);

    try {
      const nextSid = `DEMO_${Date.now()}`;
      setCallSid(nextSid);
      setSpokenLog([]);
      setXmlLog([]);
      setCurrentActionUrl(undefined);
      setExpectedDigits(undefined);

      const xmlText = await postForm(`${apiBaseUrl}/api/ivr/incoming`, {
        CallSid: nextSid,
        From: fromNumber,
        To: toNumber
      });

      handleResponse(xmlText);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setIsBusy(false);
    }
  };

  const sendDigit = async (digit: string) => {
    if (!currentActionUrl) return;

    setIsBusy(true);
    setError(null);

    try {
      setSpokenLog((prev) => [...prev, `▶ You pressed: ${digit}`]);

      const xmlText = await postForm(currentActionUrl, {
        CallSid: callSid,
        Digits: digit,
        From: fromNumber,
        To: toNumber
      });

      handleResponse(xmlText);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        <section className="py-10">
          <div className="container mx-auto px-4">
            <div className="flex items-start justify-between gap-6 flex-col lg:flex-row">
              <div className="flex-1">
                <h1 className="text-2xl md:text-3xl font-bold">IVR Simulator (Demo)</h1>
                <p className="text-muted-foreground mt-2">
                  Judge-friendly IVR demo: press keypad buttons and see what the caller would hear (parsed from TwiML).
                </p>
              </div>
              <div className="flex gap-2">
                <Button onClick={startCall} disabled={isBusy}>
                  Start Call
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSpokenLog([]);
                    setXmlLog([]);
                    setError(null);
                  }}
                  disabled={isBusy}
                >
                  Clear
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle>Config</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="text-sm font-medium">API Base URL</div>
                    <Input value={apiBaseUrl} onChange={(e) => setApiBaseUrl(e.target.value)} placeholder="http://localhost:3001" />
                    <div className="text-xs text-muted-foreground">
                      Use localhost for local demo or your ngrok base URL for live webhook demo.
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    <div className="space-y-2">
                      <div className="text-sm font-medium">From</div>
                      <Input value={fromNumber} onChange={(e) => setFromNumber(e.target.value)} placeholder="+919876543210" />
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm font-medium">To</div>
                      <Input value={toNumber} onChange={(e) => setToNumber(e.target.value)} placeholder="+17656272931" />
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm font-medium">CallSid</div>
                      <Input value={callSid} onChange={(e) => setCallSid(e.target.value)} />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="secondary">Next action: {currentActionUrl ? "ready" : "none"}</Badge>
                    {expectedDigits ? <Badge variant="outline">Digits: {expectedDigits}</Badge> : null}
                    {isBusy ? <Badge>Working…</Badge> : null}
                  </div>

                  {error ? (
                    <div className="text-sm text-destructive">{error}</div>
                  ) : null}

                  <div className="space-y-2">
                    <div className="text-sm font-medium">Keypad</div>
                    <div className="grid grid-cols-3 gap-2">
                      {digitLayout.flat().map((d) => (
                        <Button
                          key={d}
                          variant={d === "*" || d === "#" ? "outline" : "secondary"}
                          onClick={() => sendDigit(d)}
                          disabled={!canSendDigit}
                        >
                          {d}
                        </Button>
                      ))}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Start Call first, then press digits to navigate.
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>What the caller hears</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[360px] rounded-md border p-3">
                    <div className="space-y-2">
                      {spokenLog.length === 0 ? (
                        <div className="text-sm text-muted-foreground">Press Start Call to begin…</div>
                      ) : (
                        spokenLog.map((line, idx) => (
                          <div key={idx} className="text-sm">
                            {line}
                          </div>
                        ))
                      )}
                    </div>
                  </ScrollArea>

                  <details className="mt-4">
                    <summary className="text-sm font-medium cursor-pointer">Show raw TwiML (last 20)</summary>
                    <div className="mt-2 space-y-3">
                      {xmlLog.map((xml, idx) => (
                        <pre key={idx} className="text-xs whitespace-pre-wrap rounded-md border p-3 overflow-auto">
                          {xml}
                        </pre>
                      ))}
                    </div>
                  </details>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
