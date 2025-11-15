import type { ExportPacket } from "@/types/domain";

export type ExportPayload = {
  workspaceId: string;
  type: ExportPacket["type"];
  periodStart: string;
  periodEnd: string;
  taxes?: Record<string, unknown>;
  ledger?: Record<string, unknown>;
  documents?: Array<{ id: string; name: string }>;
  metadata?: Record<string, unknown>;
};

const encode = (input: string) => new TextEncoder().encode(input);

const bufferToHex = (buffer: ArrayBuffer) =>
  Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");

export const generateExportChecksum = async (payload: unknown): Promise<string> => {
  const body = typeof payload === "string" ? payload : JSON.stringify(payload);
  if (typeof crypto !== "undefined" && crypto.subtle) {
    const digest = await crypto.subtle.digest("SHA-256", encode(body));
    return bufferToHex(digest);
  }
  // Fallback simple hash
  let hash = 0;
  for (let i = 0; i < body.length; i += 1) {
    hash = (hash << 5) - hash + body.charCodeAt(i);
    hash |= 0;
  }
  return hash.toString(16);
};

export const buildExportPacket = async (input: ExportPayload): Promise<ExportPacket> => {
  const packetBody = {
    version: "1.0",
    generatedAt: new Date().toISOString(),
    workspaceId: input.workspaceId,
    taxes: input.taxes ?? {},
    ledger: input.ledger ?? {},
    documents: input.documents ?? [],
    metadata: input.metadata ?? {},
  };

  const checksum = await generateExportChecksum(packetBody);

  return {
    id: `${input.workspaceId}-${Date.now()}`,
    workspaceId: input.workspaceId,
    type: input.type,
    periodStart: input.periodStart,
    periodEnd: input.periodEnd,
    status: "ready",
    format: "json",
    checksum,
    payloadUrl: undefined,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    metadata: packetBody.metadata,
  };
};

export const createExportBlob = (payload: unknown) =>
  new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });

export const generateQrPayload = async (packet: ExportPacket) => {
  const checksum = packet.checksum || (await generateExportChecksum(packet));
  const qrData = {
    id: packet.id,
    workspaceId: packet.workspaceId,
    checksum,
    period: `${packet.periodStart}:${packet.periodEnd}`,
  };
  return `proga-export:${btoa(JSON.stringify(qrData))}`;
};

