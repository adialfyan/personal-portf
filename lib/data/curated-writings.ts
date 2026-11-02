import type { Writing } from "@/lib/queries/types";

export const CURATED_WRITINGS: Writing[] = [
  {
    id: "00000000-0000-0000-0000-000000000010",
    title:
      "Securing Educational Financial Data Against Insider Threats: A Hybrid Blockchain Approach with Merkle Tree Aggregation",
    slug: "securing-educational-financial-data-hybrid-blockchain",
    subtitle:
      "Peer-reviewed research on multi-tier cryptographic audit trails, Merkle tree daily aggregation, and public Ethereum anchoring for institutional ledgers.",
    summary:
      "Published in Journal of Information Systems and Informatics (SINTA 2). An empirical examination of hybrid blockchain architectures for detecting internal database manipulation in educational financial systems with zero false positives and 99.90% cost efficiency.",
    category: "paper",
    reading_time_minutes: 14,
    status: "published",
    is_featured: true,
    sort_order: 1,
    cover_image_path: null,
    published_at: "2026-08-22T00:00:00Z",
    created_at: "2026-08-22T00:00:00Z",
    updated_at: "2026-08-22T00:00:00Z",
    tags: [
      "Blockchain",
      "Information Security",
      "Cryptography",
      "SINTA 2",
      "Peer-Reviewed",
      "Ethereum",
      "Smart Contracts",
    ],
    content: `
> **Official Publication Reference**  
> **Journal**: *Journal of Information Systems and Informatics (JournalISI)*, Vol. 8, No. 4, August 2026, pp. 4159–4183  
> **Accreditation**: SINTA 2 (Kemdiktisaintek) • DOAJ • Crossref • Dimensions • BASE  
> **Authors**: Adi Alfian Hafis & Soiful Hadi (Universitas Semarang)  
> **DOI**: [https://doi.org/10.63158/journalisi.v8i4.1719](https://doi.org/10.63158/journalisi.v8i4.1719)  
> **Direct Publisher PDF**: [Download Official Article PDF](https://journal-isi.org/index.php/isi/article/view/1719/933)

---

## Abstract

Financial information systems in educational institutions face significant insider threats where privileged administrators can manipulate database records undetected by conventional security controls. This study investigates a Hybrid Blockchain architecture integrating Merkle Tree Aggregation and a Reversal Entry mechanism to establish a tamper-evident financial audit trail. 

Developed via the Design Science Research Methodology (DSRM), the system implements three cryptographic layers: a SHA-256 Recursive Transaction Hash Chain for local integrity, a Keccak-256 Merkle Tree for daily batch aggregation, and public Ethereum anchoring for non-repudiation. 

Empirical evaluations across five distinct database manipulation attack scenarios demonstrated successful cryptographic detection across 100% of attack vectors with zero false positives under normal operational workflows. Computational latency remained stable at 3.45 ms per transaction. Furthermore, the 1,000:1 Merkle compression yielded a 99.90% cost efficiency compared to pure public blockchains, confirming the technical and economic viability of hybrid blockchain security for institutional financial governance.

---

## 01 — The Insider Threat in Institutional Ledgers

Educational institutions routinely manage millions of dollars in student tuition, government grants, and operational disbursements through centralized relational databases. While perimeter defenses (firewalls, WAFs, application role-based access control) protect against external intruders, they remain structurally ineffective against **privileged insider threats**.

A rogue Database Administrator (DBA) or compromised server root account operates beneath the application layer:
1. **Direct SQL Manipulation**: A privileged insider can execute raw SQL \`UPDATE\` or \`DELETE\` queries directly on relational tables, altering payment amounts or wiping records without triggering application event listeners.
2. **Audit Log Tampering**: Because native database audit logs and triggers reside within the same centralized server environment, an administrator with elevated privileges can truncate log tables or disable trigger execution to erase forensic evidence.
3. **Salami Slicing & Surgical Edits**: Fractional amounts can be diverted systematically over prolonged periods, evading standard periodic threshold audits.

While enterprise Write-Once-Read-Many (WORM) hardware storage provides immutability, its prohibitive infrastructure licensing costs make it impractical for secondary and higher education institutions. Conversely, logging every high-throughput financial transaction directly to a public blockchain introduces severe gas fee volatility and exposes student financial privacy.

---

## 02 — Three-Tier Hybrid Cryptographic Architecture

To resolve the tension between relational performance, regulatory data privacy (UU PDP / GDPR), and public immutability, the proposed system establishes a three-tier hybrid architecture that segregates off-chain operational data from on-chain cryptographic proofs.

### Tier 1: Local Recursive Transaction Hash Chain (RTHC)
Every financial transaction inserted into the off-chain relational database (MySQL/PostgreSQL) is sequentially linked into a forward-secure cryptographic chain. Each transaction block generates a deterministic hash:

\`\`\`text
H(n) = SHA-256( Nonce(n) || H(n-1) || Amount || Timestamp || User_UUID || Category )
\`\`\`

- **CSPRNG Nonce (32 bytes)**: Guarantees pre-image entropy and eliminates rainbow table attacks.
- **Linkage Invariant**: Altering a historical record at index $k$ invalidates the computed hash of every subsequent record from $k+1$ through $n$, immediately exposing tampering.

### Tier 2: Daily Batch Merkle Tree Aggregation
At the close of each accounting day, background workers aggregate all valid transaction hashes generated during that 24-hour cycle into a binary Merkle Tree.

\`\`\`text
Parent(i) = Keccak-256( sort( H_left, H_right ) )
\`\`\`

- **EVM Compatibility**: The transition to \`Keccak-256\` ensures native execution within the Ethereum Virtual Machine, minimizing smart contract verification gas costs.
- **Lexicographical Sorting**: Child node hashes are sorted lexicographically prior to concatenation, eliminating branch order ambiguity.
- **Node Balancing**: If an odd number of transactions occurs, the trailing leaf node is paired with a duplicate of itself to preserve complete binary balance.

### Tier 3: Public Ethereum Anchoring
The resulting single 32-byte Merkle Root is committed via smart contract transaction to the public Ethereum network (tested on Sepolia with mainnet parity analysis). 

Once confirmed in a public block, the daily financial state receives:
- **Global Timestamp Consensus**: Proof of existence independent of institutional control.
- **Non-Repudiation**: Even if an attacker deletes the entire internal database server, the historical Merkle Root anchored on Ethereum remains mathematically verifiable against physical bank statements or external copies.

---

## 03 — The Reversal Entry: Immutability Without Disruption

A common obstacle in applying blockchain immutability to real-world accounting is human error: cashiers mistype figures, and billing classifications require genuine administrative adjustments. 

In traditional systems, administrators simply edit or delete the row. In a tamper-evident system, \`DELETE\` and \`UPDATE\` permissions are completely revoked at the database user level. Instead, the architecture incorporates the double-entry accounting principle of the **Reversal Entry**:

1. **Negative Balancing Voucher**: When an erroneous entry of +Rp 500,000 is identified, the system writes an offsetting entry of -Rp 500,000.
2. **Correction Entry**: The correct figure (+Rp 50,000) is inserted as a subsequent discrete transaction.
3. **Cryptographic Continuity**: Both the reversal and the correction receive sequential hash positions in the Tier 1 chain. 

This enables auditors to reconstruct the full chronological history of human error and rectification without breaking the cryptographic integrity of the ledger.

---

## 04 — Empirical Attack Simulation & Evaluation

The architecture was evaluated across controlled experimental trials ($n = 10$ iterations per scenario) orchestrating five direct database manipulation attack vectors alongside five normal operational workflows:

| Scenario ID | Attack Vector / Operation | Category | Detection Result | Anomaly Signal |
| :--- | :--- | :--- | :--- | :--- |
| **S0a–S0e** | Standard Income, Expense & Reversal Entries | Normal Operation | **Intact (100%)** | Zero False Positives (0.0%) |
| **S1** | Surgical Edit (Direct SQL Amount Manipulation) | Attack | **Detected (100%)** | Hash mismatch at modified index |
| **S2** | Date Tampering (Retroactive Ledger Manipulation) | Attack | **Detected (100%)** | Hash mismatch & temporal violation |
| **S3** | Chain Injection (Unauthorized Row Insertion) | Attack | **Detected (100%)** | Cryptographic linkage break |
| **S4** | Silent Deletion (Direct SQL DELETE on Ledger) | Attack | **Detected (100%)** | Chain gap & missing sequence counter |
| **S5** | Category Swap (Reclassifying Budget Accounts) | Attack | **Detected (100%)** | Payload mismatch against chain |

### Benchmark Metrics
- **Verification Latency**: Average detection latency of **3.45 ms** per transaction across all attack scenarios, confirming that deterministic cryptographic verification outperforms machine-learning anomaly detection in both speed and deterministic certainty.
- **False-Positive Resilience**: Across all normal transaction flows, zero false positives were observed, eliminating audit alert fatigue.

---

## 05 — Economic Viability & Gas Cost Scaling

A primary critique of blockchain integration in public administration is operational cost. Storing 1,000 individual financial transactions directly on a public blockchain consumes unsustainable transaction fees.

Under the proposed hybrid model:
- **Compression Ratio**: 1,000 transactions are compressed into a single 32-byte Merkle root on-chain.
- **Cost Reduction**: Achieves **99.90% cost efficiency** relative to pure public blockchain architectures.
- **Sensitivity Analysis**: At fluctuating Ethereum gas prices ranging from 15 to 80 Gwei and ETH exchange rates from $2,000 to $4,500, daily anchoring costs remain between $0.18 and $0.85 per day, making the framework financially accessible for institutional deployment.

---

## 06 — How to Cite

If you reference this architecture or research methodology in your academic work, please use the following citation:

### IEEE Format
\`\`\`text
A. A. Hafis and S. Hadi, "Securing Educational Financial Data Against Insider Threats: A Hybrid Blockchain Approach with Merkle Tree Aggregation," Journal of Information Systems and Informatics (JournalISI), vol. 8, no. 4, pp. 4159–4183, Aug. 2026, doi: 10.63158/journalisi.v8i4.1719.
\`\`\`

### BibTeX Format
\`\`\`bibtex
@article{hafis2026securing,
  author    = {Hafis, Adi Alfian and Hadi, Soiful},
  title     = {Securing Educational Financial Data Against Insider Threats: A Hybrid Blockchain Approach with Merkle Tree Aggregation},
  journal   = {Journal of Information Systems and Informatics (JournalISI)},
  volume    = {8},
  number    = {4},
  pages     = {4159--4183},
  year      = {2026},
  month     = {August},
  publisher = {Asosiasi Doktor Sistem Informasi Indonesia (ADSII)},
  doi       = {10.63158/journalisi.v8i4.1719},
  url       = {https://journal-isi.org/index.php/isi/article/view/1719}
}
\`\`\`
    `.trim(),
  },
  {
    id: "00000000-0000-0000-0000-000000000001",
    title: "On Deterministic Ledgers in Multi-Entity ERPs",
    slug: "deterministic-ledgers-multi-entity-erp",
    subtitle: "Architecture patterns for double-entry invariants across distributed institutions.",
    summary:
      "A technical examination of double-entry ledger design, atomicity guarantees, and audit trail immutability in multi-tenant financial software.",
    category: "architecture",
    reading_time_minutes: 7,
    status: "published",
    is_featured: true,
    sort_order: 2,
    cover_image_path: null,
    published_at: "2025-02-15T00:00:00Z",
    created_at: "2025-02-15T00:00:00Z",
    updated_at: "2025-02-15T00:00:00Z",
    tags: ["Distributed Systems", "Accounting Systems", "PostgreSQL", "Architecture"],
    content: `
## 01 — The Invariant of Zero-Sum Balance

In enterprise financial engineering, the primary guarantee of an accounting engine is simple yet unforgiving: every transaction must balance to zero. 

\`\`\`sql
-- Mathematical invariant check
SELECT transaction_id, SUM(amount) AS net_balance
FROM journal_entries
GROUP BY transaction_id
HAVING SUM(amount) <> 0;
\`\`\`

If this query ever returns a single row in production, the system has failed. Deterministic ledgers require that entries are append-only. Modifying or deleting a past entry is strictly prohibited; corrections are applied solely through reversing journal vouchers.

## 02 — Multi-Entity Isolation vs Shared Clearing

When designing ERP platforms spanning universities, foundations, or subsidiaries, accounts must maintain cryptographic isolation while allowing automated inter-company clearing. 

We address this by separating **Tenant Boundary Keys** from the **Consolidation Pipeline**, ensuring that operational autonomy never compromises centralized financial compliance.
    `.trim(),
  },
  {
    id: "00000000-0000-0000-0000-000000000002",
    title: "Host-to-Host Banking Clearing: Zero-Tolerance Settlement",
    slug: "host-to-host-banking-clearing",
    subtitle: "Engineering real-time automated clearing pipelines with national banking APIs.",
    summary:
      "Lessons learned building direct Host-to-Host banking clearing infrastructure handling student tuition and high-volume institutional disbursements.",
    category: "paper",
    reading_time_minutes: 9,
    status: "published",
    is_featured: true,
    sort_order: 3,
    cover_image_path: null,
    published_at: "2025-01-20T00:00:00Z",
    created_at: "2025-01-20T00:00:00Z",
    updated_at: "2025-01-20T00:00:00Z",
    tags: ["Banking", "API Security", "Idempotency", "Payment Gateways"],
    content: `
## 01 — Idempotency Under Network Partitions

When executing bank clearing transactions over public or leased infrastructure, network timeouts are inevitable. The golden rule of Host-to-Host integration is that a timeout does not mean failure—it means state uncertainty.

Every outbound clearing request must embed a cryptographically deterministic **Idempotency Key** composed of:
1. Originating transaction UUID
2. Ledger sequence counter
3. Unix epoch millisecond timestamp

## 02 — State Machine Reconciliation

Automated background workers poll banking status endpoints using exponential backoff with jitter. Once confirmed, the invoice state transitions deterministically from \`pending_clearing\` to \`settled\`, generating automated push notifications and updating real-time treasury balances.
    `.trim(),
  },
  {
    id: "00000000-0000-0000-0000-000000000003",
    title: "Systems Over Tools: Building Software for Long-Term Operation",
    slug: "systems-over-tools",
    subtitle: "Reflections on software longevity, architectural restraint, and boring technology.",
    summary:
      "Why durable business systems prioritize relational stability, explicit data modeling, and minimal dependency trees over fleeting frontend trends.",
    category: "essay",
    reading_time_minutes: 5,
    status: "published",
    is_featured: true,
    sort_order: 4,
    cover_image_path: null,
    published_at: "2024-11-10T00:00:00Z",
    created_at: "2024-11-10T00:00:00Z",
    updated_at: "2024-11-10T00:00:00Z",
    tags: ["Philosophy", "Software Engineering", "Reliability"],
    content: `
## 01 — The Fallacy of Novelty

In modern software development, there is immense pressure to rewrite infrastructure every two years following whatever framework tops Hacker News. 

Yet, when you build software that organizations depend on for their daily financial survival—payroll, tuition clearing, budgeting—the most valuable attribute of code is not novelty; it is predictability.

## 02 — The Power of Relational Constraints

A well-modeled relational database schema with foreign keys, check constraints, and indexed join tables will outlive five generations of frontend state management libraries. Invest heavily in your data model first.
    `.trim(),
  },
];
