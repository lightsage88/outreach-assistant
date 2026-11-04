import type {Campaign} from "@/app/types/campaign";

const STORAGE_KEY = "outreach-assistant:campaign:v1";

export function saveCampaign(campaign: Campaign): void {
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(campaign)
    );
}

export function loadCampaign(): Campaign | null {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
        return null;
    }j

    const parsed: unknown = JSON.parse(saved);

    if (typeof parsed !== "object" ||
        parsed === null ||
        !("version" in parsed) ||
        parsed.version !== 1
    )
    {
        throw new Error("Unsupported saved campaign format.");
    }

    return parsed as Campaign;
}

export function clearCampaign(): void {
    localStorage.removeItem(STORAGE_KEY);
}