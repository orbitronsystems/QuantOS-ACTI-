
export enum MarketRegime {
  BULLISH = 'BULLISH',
  BEARISH = 'BEARISH',
  NEUTRAL = 'NEUTRAL',
  VOLATILE = 'VOLATILE',
  STAGNANT = 'STAGNANT'
}

export enum AgentStatus {
  IDLE = 'IDLE',
  TRAINING = 'TRAINING',
  EXECUTING = 'EXECUTING',
  ERROR = 'ERROR'
}

export enum ConnectionSource {
  MT5 = 'MetaTrader 5',
  TRADINGVIEW = 'TradingView',
  NINJATRADER = 'NinjaTrader',
  RITHMIC = 'Rithmic',
  BINANCE = 'Binance Cloud',
  BYBIT = 'Bybit Direct',
  BLOOMBERG = 'Bloomberg B-Pipe',
  LSEG = 'LSEG Workspace',
  FIX = 'FIX Protocol v4.4',
  KRAKEN = 'Kraken Pro',
  BITSTAMP = 'Bitstamp Institutional',
  QISKIT = 'Qiskit Quantum Runtime'
}

export enum IntegrationType {
  REST_API = 'REST_API',
  WEBHOOK = 'WEBHOOK',
  WEBSOCKET = 'WEBSOCKET',
  GRPC = 'GRPC',
  QUANTUM_CIRCUIT = 'QUANTUM_CIRCUIT'
}

export interface User {
  id: string;
  username: string;
  email: string;
  tier: 'PRO' | 'INSTITUTIONAL' | 'QUANT';
  sessionToken: string;
}

export interface ConsumerIntegration {
  id: string;
  name: string;
  type: IntegrationType;
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
  apiKey?: string;
  endpointUrl?: string;
  lastPing?: string;
}

export interface DecisionAudit {
  id: string;
  timestamp: string;
  action: string;
  regime: MarketRegime;
  consensusScore: number;
  attributions: {
    agentId: string;
    agentName: string;
    weight: number;
    contribution: string;
  }[];
}

// Secure Execution & Licensing Pillar
export interface License {
  id: string;
  type: 'ENTERPRISE' | 'QUANTUM_NODE' | 'DEVELOPER';
  status: 'VALID' | 'REVOKED' | 'EXPIRED';
  issuedTo: string;
  sha256Binding: string;
  expiry: string;
}

export interface LicenseHeartbeat {
  timestamp: string;
  latency: number;
  integrityScore: number;
  nodeStatus: 'STABLE' | 'DEGRADED' | 'LOCKED';
}

export interface SecurityAudit {
  id: string;
  timestamp: string;
  event: string;
  actor: string;
  hash: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface EABinding {
  entityId: string;
  bindingType: 'SHA256' | 'RSA_4096';
  status: 'SECURE' | 'BREACHED' | 'RE-BINDING';
  lastHandshake: string;
}

export enum AssetClass {
  CRYPTO = 'CRYPTO',
  STOCKS = 'STOCKS',
  FOREX = 'FOREX',
  COMMODITIES = 'COMMODITIES',
  INDICES = 'INDICES'
}

export interface ExchangeStatus {
  id: string;
  name: string;
  latency: number;
  status: 'CONNECTED' | 'RECONNECTING' | 'OFFLINE' | 'CONNECTING';
  volume24h: string;
  type: ConnectionSource;
}

export interface LogEntry {
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
  message: string;
}

export interface TrainingMetrics {
  sharpeGradient: number;
  drawdownPenalty: number;
  learningRate: number;
  epoch: number;
  convergence: number;
}

export interface ForecastingModel {
  id: string;
  type: 'Options' | 'Futures' | 'Spot';
  buyingRatio: number; 
  patternMatch: number; 
  timeToRecognition: number; 
  orderFlowImbalance: number; 
  gammaExposure: number; 
  prediction: 'CALL' | 'PUT' | 'LONG' | 'SHORT' | 'ACCUMULATE' | 'DISTRIBUTE';
  confidence: number;
}

export type AgentRole = 'Market' | 'Signal' | 'Behavior' | 'Risk' | 'Security' | 'Knowledge';

export interface AgentPreset {
  id: string;
  name: string;
  type: AgentRole;
  weight: number;
  source: ConnectionSource;
}

export const ROLE_CAPS: Record<AgentRole, number> = {
  Market: 0.40,
  Signal: 0.30,
  Risk: 0.50,
  Security: 0.50,
  Behavior: 0.20,
  Knowledge: 0.15
};

export interface Agent {
  id: string;
  name: string;
  type: AgentRole;
  status: AgentStatus;
  rawPriority: number; 
  normalizedWeight: number; 
  lastUpdate: string;
  errorMessage?: string;
  logs: LogEntry[];
  connectionSource?: ConnectionSource;
  training?: TrainingMetrics;
  algorithm?: string;
  parameters?: string;
  metrics: {
    entropy: number;
    drift: number;
    usage: number;
    consensusDelta: number;
    decayFactor: number; 
    backtestPnl?: number; 
  };
}

export interface MarketDataPoint {
  timestamp: string;
  price: number;
  volume: number;
  entropy: number;
  riskEnergy: number;
  liquidityDensity: number;
  gammaExposure: number;
  regime: MarketRegime;
  actualOutcome?: number;
}

export interface SimulationScenario {
  id: string;
  name: string;
  description: string;
  data: MarketDataPoint[];
}

export interface BehaviorMetric {
  category: string;
  value: number;
  correctionRequired: boolean;
  recommendation: string;
}

export interface EmotionalAssessment {
  score: number;
  status: 'Calm' | 'Aggressive' | 'Fearful' | 'Neutral';
  lastEvaluated: string;
  guidance: string;
}
