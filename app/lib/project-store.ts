/**
 * Ordinance Systems — Shared Project Store
 * 
 * Central data layer shared across all apps via localStorage + BroadcastChannel.
 * When any app updates project data, all other apps receive the update in real time.
 * 
 * Data flow (factory assembly line):
 *   Measure → Numbers → Ledger
 *              ↓
 *         PaddleDuck → Inspect → Reveal
 */

export interface OSRoom {
    id: string;
    name: string;
    length: number;
    width: number;
    height: number;
}

export interface OSQuoteItem {
    id: string;
    zone: string;
    trade: string;
    description: string;
    amount: number;
}

export interface OSSnag {
    id: string;
    zone: string;
    category: string;
    description: string;
    severity: "low" | "medium" | "high";
    status: "open" | "fixed";
}

export interface OSTransaction {
    id: string;
    date: string;
    description: string;
    category: string;
    amount: number;
    type: "income" | "expense";
    status: "paid" | "pending" | "overdue";
}

export interface OSProject {
    id: string;
    clientName: string;
    propertyType: string;
    style: string;
    size: string;
    // Measure data
    rooms: OSRoom[];
    totalFloorArea: number;
    totalWallArea: number;
    // Numbers data
    quoteItems: OSQuoteItem[];
    quoteTotalAmount: number;
    quoteDate: string;
    // Ledger data
    transactions: OSTransaction[];
    totalIncome: number;
    totalExpense: number;
    // Inspect data
    snags: OSSnag[];
    openSnags: number;
    fixedSnags: number;
    inspectionComplete: boolean;
    // Reveal data
    revealReady: boolean;
    photosUploaded: number;
    // Pipeline status
    stage: "measure" | "quote" | "execution" | "inspect" | "reveal" | "complete";
    lastUpdatedBy: string;
    lastUpdatedAt: string;
}

const STORAGE_KEY = "os_current_project";
const CHANNEL_NAME = "os_project_sync";

let channel: BroadcastChannel | null = null;
const listeners: Array<(project: OSProject) => void> = [];

/** Initialize the broadcast channel for cross-tab sync */
function ensureChannel() {
    if (channel) return channel;
    if (typeof BroadcastChannel !== "undefined") {
        channel = new BroadcastChannel(CHANNEL_NAME);
        channel.onmessage = (event) => {
            if (event.data?.type === "project_update") {
                listeners.forEach((fn) => fn(event.data.project));
            }
        };
    }
    return channel;
}

/** Create a blank project */
export function createProject(clientName: string, propertyType: string = ""): OSProject {
    const project: OSProject = {
        id: `proj_${Date.now()}`,
        clientName,
        propertyType,
        style: "",
        size: "",
        rooms: [],
        totalFloorArea: 0,
        totalWallArea: 0,
        quoteItems: [],
        quoteTotalAmount: 0,
        quoteDate: "",
        transactions: [],
        totalIncome: 0,
        totalExpense: 0,
        snags: [],
        openSnags: 0,
        fixedSnags: 0,
        inspectionComplete: false,
        revealReady: false,
        photosUploaded: 0,
        stage: "measure",
        lastUpdatedBy: "hub",
        lastUpdatedAt: new Date().toISOString(),
    };
    saveProject(project);
    return project;
}

/** Save project to localStorage and broadcast to other tabs */
export function saveProject(project: OSProject) {
    project.lastUpdatedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(project));
    ensureChannel()?.postMessage({ type: "project_update", project });
}

/** Load the current project from localStorage */
export function loadProject(): OSProject | null {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

/** Subscribe to real-time project updates from other tabs */
export function onProjectUpdate(callback: (project: OSProject) => void) {
    ensureChannel();
    listeners.push(callback);
    return () => {
        const idx = listeners.indexOf(callback);
        if (idx >= 0) listeners.splice(idx, 1);
    };
}

/** Update just the Measure data */
export function updateMeasureData(rooms: OSRoom[]) {
    const project = loadProject();
    if (!project) return;
    project.rooms = rooms;
    project.totalFloorArea = rooms.reduce((s, r) => s + r.length * r.width, 0);
    project.totalWallArea = rooms.reduce((s, r) => s + 2 * (r.length + r.width) * r.height, 0);
    project.stage = project.stage === "measure" ? "quote" : project.stage;
    project.lastUpdatedBy = "measure";
    saveProject(project);
}

/** Update just the Quote data */
export function updateQuoteData(items: OSQuoteItem[], total: number) {
    const project = loadProject();
    if (!project) return;
    project.quoteItems = items;
    project.quoteTotalAmount = total;
    project.quoteDate = new Date().toISOString().split("T")[0];
    if (project.stage === "quote") project.stage = "execution";
    project.lastUpdatedBy = "numbers";
    saveProject(project);
}

/** Update just the Ledger data */
export function updateLedgerData(transactions: OSTransaction[]) {
    const project = loadProject();
    if (!project) return;
    project.transactions = transactions;
    project.totalIncome = transactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
    project.totalExpense = transactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
    project.lastUpdatedBy = "ledger";
    saveProject(project);
}

/** Update just the Inspect data */
export function updateInspectData(snags: OSSnag[]) {
    const project = loadProject();
    if (!project) return;
    project.snags = snags;
    project.openSnags = snags.filter((s) => s.status === "open").length;
    project.fixedSnags = snags.filter((s) => s.status === "fixed").length;
    project.inspectionComplete = snags.length > 0 && project.openSnags === 0;
    if (project.inspectionComplete && project.stage === "inspect") {
        project.stage = "reveal";
        project.revealReady = true;
    }
    project.lastUpdatedBy = "inspect";
    saveProject(project);
}

/** Update reveal status */
export function updateRevealData(photosUploaded: number) {
    const project = loadProject();
    if (!project) return;
    project.photosUploaded = photosUploaded;
    if (photosUploaded > 0 && project.stage === "reveal") project.stage = "complete";
    project.lastUpdatedBy = "reveal";
    saveProject(project);
}
