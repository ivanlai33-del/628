# Governing Rules: 628SP (Strategic Protocol)

### 1. Mounting Protocol (3-Step Setup)
1.  **Orchestrated Mapping:** Acting Commander scans assets and generates `PROJECT_ROLE_MAP.md`.
2.  **Territory Claiming:** Persona agents generate `{ROLE}_SCOPE.md` defining their project-specific watches.
3.  **Command Approval:** Supreme Leader approves the scope, generating the final `PROJECT_ROLE_CHART.md`.

### 2. 80/20 Scoring Matrix (Lead Selection)
Every task must be scored by the Data Persona before recruitment:
*   **Impact Score (1-10):** Direct effect on the primary KPI (e.g., revenue, stability).
*   **Effort Score (1-10):** Resource/Token consumption.
*   **Priority:** Impact / Effort.
*   **Top 20% Rule:** Only tasks with Priority > X are eligible for Full Scan (5-person) mode.

### 3. Automatic Task Allocation
*   **Lead Identification:** Assigned to the persona whose assets are primarily impacted (see [PROJECT_ROLE_CHART.md](file:///Users/ivanlai/Downloads/project-architecture/sandbox-test/628-main/PROJECT_ROLE_CHART.md)).
*   **Recruitment Ratio:** 1 Lead (20% resp.) + 2 Support (80% resp.) = **1+2 Standard Group**.

### 4. Veto & Audit Protocols
*   **Veto Logic:** Rejection occurs if output Priority < Threshold or if it creates cross-persona logic debt.
*   **Lead Hand-off:** The Lead must perform a "Modular Review" of support output before report submission.

### 5. Standardized Reporting
Reports must contain: **Composition, Lead Persona, 80/20 Priority Score, Veto Status, API Efficiency Rating.**

### 6. Precision Strike Protocol (PSP)
*   **PSP 6.1 (Target Lock):** NO `replace_file_content` without prior `grep` or `view_file` verification in the same task turn.
*   **PSP 6.2 (Atomic Edits):** Keep edit chunks under 50 lines to preserve context window.
*   **PSP 6.3 (Collateral Check):** Lead must list "Likely Impacted Files" from `PROJECT_ROLE_MAP.md` before execution.

### 7. Anti-Loop & Circuit Breaker
*   **AL 7.1 (Retry Limit):** Max 3 attempts per logic block. Auto-veto and "Strategic Reset" required if exceeded.
*   **AL 7.2 (Verification Loop):** Every edit MUST be followed by a verification tool call (read/exec/test) before notifying the leader.

**Core Role Reference: [ROLES_BASE.md](file:///Users/ivanlai/Downloads/project-architecture/sandbox-test/628-main/ROLES_BASE.md)**
