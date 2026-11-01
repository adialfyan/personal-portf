import { ContributionMatrixClient, type ContributionDay } from "./contribution-matrix-client";

interface CommitSummary {
  sha: string;
  message: string;
  date: string;
  repo: string;
}

interface GitHubCommitResponse {
  sha?: string;
  commit?: {
    message?: string;
    author?: {
      date?: string;
    };
  };
}

async function getGitHubData(): Promise<{
  totalContributions: number;
  weeks: ContributionDay[][];
  recentCommits: CommitSummary[];
}> {
  try {
    const [contribRes, commitsRes] = await Promise.all([
      fetch("https://github-contributions-api.jogruber.de/v4/adialfyan?y=last", {
        next: { revalidate: 3600 },
      }).catch(() => null),
      fetch("https://api.github.com/repos/adialfyan/personal-portfolio/commits?per_page=6", {
        headers: { "User-Agent": "Portfolio-App" },
        next: { revalidate: 3600 },
      }).catch(() => null),
    ]);

    let totalContributions = 0;
    const days: ContributionDay[] = [];

    if (contribRes && contribRes.ok) {
      const data = await contribRes.json();
      totalContributions = data?.total?.lastYear || 0;
      if (Array.isArray(data?.contributions)) {
        days.push(...data.contributions);
      }
    }

    // Chunk into 7-day weeks for matrix rendering
    const weeks: ContributionDay[][] = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }

    let recentCommits: CommitSummary[] = [];
    if (commitsRes && commitsRes.ok) {
      const rawCommits = (await commitsRes.json()) as GitHubCommitResponse[];
      if (Array.isArray(rawCommits)) {
        recentCommits = rawCommits.map((c) => ({
          sha: (c.sha || "").slice(0, 7),
          message: (c.commit?.message || "").split("\n")[0],
          date: c.commit?.author?.date || "",
          repo: "adialfyan/personal-portfolio",
        }));
      }
    }

    return { totalContributions, weeks, recentCommits };
  } catch {
    return { totalContributions: 0, weeks: [], recentCommits: [] };
  }
}

function formatDate(iso: string): string {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export async function GitHubActivityLedger() {
  const { totalContributions, weeks, recentCommits } = await getGitHubData();

  // Pick last 38 weeks for optimal responsive horizontal spread without vertical bloat
  const displayWeeks = weeks.length > 38 ? weeks.slice(-38) : weeks;

  return (
    <section className="py-16 md:py-24 border-b border-border bg-background text-foreground">
      <div className="mx-auto max-w-[1440px] px-6 md:px-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 mb-8">
          <div>
            <p
              className="text-xs font-medium tracking-[0.2em] uppercase text-muted mb-2"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Engineering &bull; Commit Ledger
            </p>
            <h2
              className="text-3xl sm:text-4xl md:text-5xl tracking-tight text-foreground font-normal"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Public Activity &amp; Cadence
            </h2>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium tracking-[0.18em] uppercase text-muted">
            <span>
              {totalContributions.toLocaleString()} Contributions Past Year
            </span>
            <span>&bull;</span>
            <a
              href="https://github.com/adialfyan"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors inline-flex items-center gap-1"
            >
              <span>github.com/adialfyan</span>
              <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </div>

        {/* Artsy Editorial Contribution Matrix */}
        <ContributionMatrixClient
          weeks={displayWeeks}
          totalContributions={totalContributions}
        />

        {/* Recent Public Engineering Commits */}
        <div>
          <div className="pb-3 border-b border-border text-xs font-medium tracking-[0.2em] uppercase text-muted flex items-center justify-between">
            <span>Recent Public Commits</span>
            <span>Repository &bull; Date</span>
          </div>

          <div className="divide-y divide-border">
            {recentCommits.map((c) => (
              <div
                key={c.sha}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 -mx-2 px-2 hover:bg-neutral-50/80 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-muted font-normal">
                    {c.sha}
                  </span>
                  <span className="text-sm text-foreground font-normal">
                    {c.message}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted font-mono shrink-0">
                  <span className="hidden md:inline">{c.repo}</span>
                  <span className="hidden md:inline">&bull;</span>
                  <span>{formatDate(c.date)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
