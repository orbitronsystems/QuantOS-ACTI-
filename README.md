# QuantOS ACTI — Adaptive Collective Trading Intelligence Platform

<p align="center">
  <img src="https://raw.githubusercontent.com/quantos-acti/assets/main/banner.png" alt="QuantOS ACTI Banner" width="100%" onerror="this.style.display='none'"/>
</p>

<p align="center">
  <strong>Next-Generation Autonomous Quantitative Trading Intelligence, Physics-Inspired Market Modeling, Cognitive Bias Rectification, and Quantum Entropy Pool Integration.</strong>
</p>

<p align="center">
  <a href="#license"><img src="https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge" alt="License: MIT"></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"></a>
  <a href="https://react.dev/"><img src="https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19"></a>
  <a href="https://vitejs.dev/"><img src="https://img.shields.io/badge/Vite-6.2-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite"></a>
  <a href="https://ai.google.dev/"><img src="https://img.shields.io/badge/AI-Google%20Gemini%203.0-orange?style=for-the-badge&logo=google" alt="Google Gemini"></a>
  <a href="https://qiskit.org/"><img src="https://img.shields.io/badge/Quantum-Qiskit%20Runtime-6929C4?style=for-the-badge" alt="Qiskit Quantum"></a>
</p>

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Theoretical & Mathematical Foundations](#-theoretical--mathematical-foundations)
  - [1. Fokker-Planck & Kolmogorov Probability Density Flux](#1-fokker-planck--kolmogorov-probability-density-flux)
  - [2. Thermodynamic Entropy & Free Energy Minimization](#2-thermodynamic-entropy--free-energy-minimization)
  - [3. Dynamic Swarm Weighting with Drift Penalization](#3-dynamic-swarm-weighting-with-drift-penalization)
  - [4. Role-Capped Consensus Enforcement](#4-role-capped-consensus-enforcement)
- [System Architecture](#-system-architecture)
- [Platform Modules](#-platform-modules)
- [Quick Start & Installation](#-quick-start--installation)
  - [Prerequisites](#prerequisites)
  - [Setup Instructions](#setup-instructions)
  - [Environment Variables](#environment-variables)
- [Pushing to GitHub (Open Source Setup)](#-pushing-to-github-open-source-setup)
- [Repository Structure](#-repository-structure)
- [Contributing](#-contributing)
- [Security & Kill Switch Governance](#-security--kill-switch-governance)
- [License](#-license)

---

## ⚡ Overview

**QuantOS ACTI** (*Adaptive Collective Trading Intelligence*) is a high-performance, multimodal fintech analytics and autonomous execution ecosystem. It unifies non-equilibrium thermodynamics, statistical physics, cognitive behavioral science, and multi-agent AI networks into an institutional-grade algorithmic terminal.

Standard quantitative platforms suffer from model collapse during non-stationary market regimes, regime shifts, and human emotional bias (e.g., loss aversion, liquidity grabbing, revenge trading). QuantOS ACTI solves this through:

1. **Continuous Multi-Agent Swarm Orchestration**: Autonomous agents specialize across market, signal, risk, security, behavior, and knowledge roles with dynamic consensus balancing.
2. **Physics-Inspired Market Dynamics**: Models order flow, liquidity density, and gamma exposure using Fokker-Planck drift-diffusion equations and thermodynamic entropy.
3. **Cognitive Bias Rectification**: Real-time behavioral monitoring identifies cognitive distortion and computes automated corrective actions.
4. **Multimodal LLM Reasoning Loop**: Seamlessly integrates Google Gemini 3.0 Pro & Flash for real-time market synthesis and structured behavioral analytics.
5. **Quantum Entropy Verification**: Transpiles optimization circuits via Qiskit and measures quantum state vector entropy for true non-deterministic seed generation.

---

## 🚀 Key Features

- **Dynamic Swarm Weight Allocation**: Continuous recalculation of agent influence based on signal drift penalty ($\delta_i$) and institutional role ceilings.
- **Institutional Market Regime Engine**: Live classification of market states across Bullish, Bearish, Neutral, Volatile, and Stagnant regimes with real-time liquidity density curves.
- **Cognitive Behavioral Correction**: Evaluates emotional status (Calm, Aggressive, Fearful) and flags cognitive pitfalls such as Loss Aversion Alpha and HFT Signal Decay.
- **Sim & Historical Market Replay Engine**: Backtest scenarios against live streaming state or synthetic crisis replaying with dynamic backtesting PnL.
- **Global Exchange Gateway**: Direct connectivity tracking for Bloomberg B-Pipe, LSEG Workspace, Binance Cloud, Bybit Direct, Kraken Pro, and FIX Protocol v4.4.
- **Hardware-Bound Licensing & Cryptographic Attestation**: SHA-256 and RSA-4096 machine binding ensuring node integrity and audit accountability.
- **Model Accountability & Decision Audit Trail**: Every decision is logged with constituent agent attribution weights and cryptographically signed action logs.
- **Emergency Hardware Kill Switch**: Immediate cluster isolation with sub-millisecond execution abort.

---

## 📐 Theoretical & Mathematical Foundations

QuantOS ACTI is engineered from rigorous mathematical foundations:

### 1. Fokker-Planck & Kolmogorov Probability Density Flux

Price probability distributions $P(x, t)$ under volatile market regimes are modeled as continuous drift-diffusion processes:

$$\frac{\partial P(x, t)}{\partial t} = -\frac{\partial}{\partial x} \Big[ \mu(x, t) P(x, t) \Big] + \frac{\partial^2}{\partial x^2} \Big[ D(x, t) P(x, t) \Big]$$

Where:
- $\mu(x, t)$: Drift coefficient reflecting order flow imbalance (OFI) and aggregate market momentum.
- $D(x, t)$: Diffusion tensor reflecting volatility density and microstructural noise.

### 2. Thermodynamic Entropy & Free Energy Minimization

Market instability is quantified as thermodynamic Gibbs-Shannon entropy:

$$S = -k_B \sum_{i} p_i \ln(p_i)$$

The cluster minimizes Helmhotz Free Energy $F = U - TS$ to find equilibrium order routing between decentralized liquidity venues.

### 3. Dynamic Swarm Weighting with Drift Penalization

Agents undergo continuous weight recalibration:

$$\text{Drift Penalty: } \quad d_p = \max\Big(0, \, (\text{drift} - 0.2) \times 0.5\Big)$$

$$\text{Decay Target: } \quad \tau = \max(0.1, \, 1.0 - d_p)$$

$$\text{Effective Weight: } \quad W_i = \frac{\min\big(P_{i,\text{raw}} \times \delta_i, \; \text{Cap}_{\text{role}}\big)}{\sum_j \min\big(P_{j,\text{raw}} \times \delta_j, \; \text{Cap}_{\text{role}}\big)}$$

Where $\delta_i$ is the exponential moving average of the decay factor.

### 4. Role-Capped Consensus Enforcement

To prevent rogue agent takeovers, strict institutional caps are enforced:

| Agent Role | Max Weight Cap | Responsibility |
|:---|:---:|:---|
| **Risk** | 50% | Maximum drawdown bounds, Value-at-Risk (VaR), portfolio limits |
| **Security** | 50% | Cryptographic licensing, node handshake, anomaly isolation |
| **Market** | 40% | Orderbook microstructure, price-volume dynamics, OFI |
| **Signal** | 30% | Statistical arbitrage, momentum vectors, mean-reversion |
| **Behavior** | 20% | Cognitive bias mitigation, emotional variance damping |
| **Knowledge** | 15% | Fundamental ingestion, macroeconomic feed synthesis |

---

## 🏛 System Architecture

```
                                  +------------------------------+
                                  |    Global Exchange Gateway   |
                                  | (Binance, Bloomberg, FIX 4.4)|
                                  +--------------+---------------+
                                                 |
                                      Market Data Ingestion
                                                 v
+------------------------+        +--------------+---------------+        +------------------------+
|  IBM Qiskit Quantum    | -----> |   Stochastic Regime Engine   | <----- | Google Gemini 3.0 Pro  |
|  Entropy Generator     |        |   (Fokker-Planck Diffusion)  |        | Multimodal Reasoning   |
+------------------------+        +--------------+---------------+        +------------------------+
                                                 |
                                    Regime State & Entropy Flux
                                                 v
                                  +--------------+---------------+
                                  |   ACTI Consensus Matrix      |
                                  |  (Dynamic Role-Capped Swarm) |
                                  +--------------+---------------+
                                                 |
                       +-------------------------+-------------------------+
                       |                                                   |
                       v                                                   v
        +--------------+---------------+                    +--------------+---------------+
        |   Cognitive Behavioral Loop  |                    |  Execution & Security Engine |
        | (Bias Detection & Mitigation)|                    |  (SHA-256 License + Kill Sw) |
        +------------------------------+                    +------------------------------+
```

---

## 🖥 Platform Modules

| Module | Route / View | Description |
|:---|:---|:---|
| **Dashboard Core** | `Terminal` | Real-time order flow charts, live tick stream, behavioral radar, and AI reasoning loop. |
| **Consensus Matrix** | `Investor` | Multi-agent conformity matrix, options/futures forecasting panels, and order flow imbalance. |
| **Fleet Management** | `Institutional` | Latency topology, cross-venue order routing status, and institutional node telemetry. |
| **Audit Trail** | `Accountability` | Decision audits, attribution weights, and cryptographic transaction logging. |
| **Security Hub** | `Security` | Machine-bound license integrity, SHA-256 fingerprints, and emergency kill switches. |
| **Quant Lab** | `Developer` | Mathematical formula derivations, Fokker-Planck solver, and Qiskit quantum terminal. |
| **Connectivity** | `Connect` | REST, WebSocket, gRPC, and FIX protocol integration manager. |

---

## 🚀 Quick Start & Installation

### Prerequisites

- **Node.js**: `v18.0.0` or higher (Node 20+ recommended)
- **Package Manager**: `npm`, `yarn`, `pnpm`, or `bun`
- **Gemini API Key**: Free key from [Google AI Studio](https://aistudio.google.com/)

### Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/<YOUR_GITHUB_USERNAME>/QuantOS-ACTI.git
   cd QuantOS-ACTI
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment:**
   ```bash
   cp .env.example .env.local
   ```
   Add your Gemini API key inside `.env.local`:
   ```env
   GEMINI_API_KEY=AIzaSy...your_real_key_here
   ```

4. **Launch development server:**
   ```bash
   npm run dev
   ```
   Navigate to `http://localhost:3000` in your browser.

5. **Build for production:**
   ```bash
   npm run build
   npm run preview
   ```

### Environment Variables

| Variable | Description | Default | Required |
|:---|:---|:---:|:---:|
| `GEMINI_API_KEY` | Google Gemini API key for reasoning & behavioral analytics | — | **Yes** |
| `PORT` | Local dev server port | `3000` | No |
| `NODE_ENV` | Environment mode (`development` / `production`) | `development` | No |

---

## 📤 Pushing to GitHub (Open Source Setup)

To push this codebase to your own GitHub repository:

### Method 1: Using the automated helper script
```bash
chmod +x scripts/push-to-github.sh
./scripts/push-to-github.sh https://github.com/<YOUR_GITHUB_USERNAME>/QuantOS-ACTI.git
```

### Method 2: Standard Git CLI

1. **Create an empty repository** on GitHub named `QuantOS-ACTI`.
2. **Add remote and push**:
   ```bash
   git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/QuantOS-ACTI.git
   git branch -M main
   git push -u origin main
   ```

### Method 3: Using GitHub CLI (`gh`)
```bash
gh repo create QuantOS-ACTI --public --source=. --remote=origin --push
```

---

## 📁 Repository Structure

```
QuantOS-ACTI/
├── .github/
│   ├── workflows/
│   │   └── ci.yml                 # Automated CI build & type-check pipeline
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md          # Standardized bug reporting
│   │   └── feature_request.md     # Feature proposal template
│   └── PULL_REQUEST_TEMPLATE.md   # Pull request review checklist
├── components/
│   ├── AgentStatusPanel.tsx       # Live agent swarm monitor and execution triggers
│   ├── AuthSystem.tsx             # Node authorization & institutional tier login
│   ├── BehavioralCorrection.tsx   # Cognitive bias assessment & radar visualization
│   ├── CreateAgentModal.tsx       # Custom agent instantiation interface
│   ├── ForecastingPanel.tsx       # Options / Futures / Spot predictive models
│   ├── GlobalExchangeGateway.tsx  # Multi-venue connection telemetry
│   ├── IntegrationManager.tsx     # Protocol endpoints (REST, WebSocket, FIX, gRPC)
│   ├── LogModal.tsx               # Granular agent execution telemetry inspector
│   ├── MarketRegimeChart.tsx      # Multi-dimensional regime & entropy visualization
│   ├── MathematicalFoundations.tsx# Fokker-Planck, Free Energy, and SDE LaTeX derivations
│   ├── ModelAccountability.tsx    # Decision attribution ledger and consensus log
│   ├── PreFlightCheck.tsx         # Node initialization & cryptographic handshake
│   ├── SecurityDashboard.tsx      # License binding, tamper detection, and kill switch
│   ├── SimulationController.tsx   # Historical playback & scenario stress test engine
│   ├── TerminalTicker.tsx         # Real-time institutional price ticker
│   └── TrainingEngine.tsx         # Gradient training & Sharpe optimization panel
├── services/
│   └── geminiService.ts           # Google GenAI SDK integration with resilient retry/cooldown
├── scripts/
│   └── push-to-github.sh          # One-click open source push utility
├── types.ts                       # Domain types, interfaces, enums, and role caps
├── constants.tsx                  # System constants, presets, and SVG icons
├── App.tsx                        # Master layout, navigation tabs, and simulation loop
├── index.html                     # Application HTML entry point
├── index.tsx                      # React 19 root mounting
├── vite.config.ts                 # Vite bundler configuration
├── tsconfig.json                  # TypeScript strict compiler options
├── package.json                   # Project dependencies and script runner
├── .env.example                   # Safe environment template
├── .gitignore                     # Git ignore specifications
├── CONTRIBUTING.md                # Open source contribution guidelines
├── CODE_OF_CONDUCT.md             # Contributor covenant
└── LICENSE                        # MIT License
```

---

## 🤝 Contributing

We welcome contributions from quantitative analysts, machine learning researchers, systems engineers, and traders!

1. Fork the Project.
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3. Commit your Changes with [Conventional Commits](https://www.conventionalcommits.org/) (`git commit -m 'feat: implement order flow entropy metric'`).
4. Push to the Branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

Please review [CONTRIBUTING.md](CONTRIBUTING.md) and our [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) before submitting code.

---

## 🛡 Security & Kill Switch Governance

QuantOS ACTI incorporates a multi-tier security framework:
- **Tamper Detection**: Monitored machine hardware fingerprints with periodic cryptographic handshakes.
- **Fail-Safe Isolation**: When an agent's entropy or drift exceeds tolerance thresholds, it is automatically penalized and isolated without halting unaffected cluster nodes.
- **Immediate Hardware Kill Switch**: Accessible directly from the navigation bar and Security Hub to instantaneously freeze all live order routing.

To report security vulnerabilities, please refer to [CONTRIBUTING.md](CONTRIBUTING.md) or contact `security@quantos-acti.org`.

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for complete details.

---

<p align="center">
  Built with precision for the global quantitative intelligence community.
</p>
