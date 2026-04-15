import { request, requestWithAuth } from './client';
import { getOrCreateSessionId, getStoredToken } from '../storage';

const DRAFT_BASE = '/draft-service-requests';

export type DraftServiceRequest = {
  _id: string;
  id?: string;
  title?: string;
  address?: string;
  city?: string;
  brand?: string;
  model?: string;
  problemDescription?: string;
  problemType?: string;
  requestType?: 'self' | 'other';
  serviceType?: 'pickup-drop' | 'visit-shop' | 'onsite';
  currentStep?: number;
  currentStepKey?: string;
  issueImages?: string[];
  updatedAt?: string;
  createdAt?: string;
  [key: string]: any;
};

type DraftSavePayload = {
  draftId?: string;
  createNew?: boolean | 'true' | 'false';
  address?: string;
  city?: string;
  brand?: string;
  model?: string;
  problemDescription?: string;
  userName?: string;
  userPhone?: string;
  requestType?: 'self' | 'other';
  serviceType?: 'pickup-drop' | 'visit-shop' | 'onsite';
  beneficiaryName?: string;
  beneficiaryPhone?: string;
  preferredDate?: string;
  preferredTime?: string;
  selectedDate?: string;
  selectedTimeSlot?: string;
  budget?: number;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  isUrgent?: boolean;
  issueLevel?: 'software' | 'hardware' | 'board' | string;
  urgency?: 'standard' | 'express' | 'urgent';
  wantsWarranty?: boolean;
  wantsDataSafety?: boolean;
  calculatedPricing?: object;
  aiPredictions?: any[] | string;
  selectedProblem?: object | string;
  aiPredicted?: boolean;
  problemType?: string;
  problemTypeLabel?: string;
  knowsProblem?: boolean | 'true' | 'false';
  location?: {
    address?: string;
    lat?: number;
    lng?: number;
    latitude?: number;
    longitude?: number;
  };
  currentStep?: number;
  currentStepKey?: string;
  issueImages?: string[];
  [key: string]: any;
};

type SaveDraftResponse = {
  success: boolean;
  message?: string;
  draft?: DraftServiceRequest | null;
  data?: {
    draft?: DraftServiceRequest | null;
  };
};

type MyDraftsResponse = {
  success: boolean;
  drafts?: DraftServiceRequest[];
  data?: {
    drafts?: DraftServiceRequest[];
  };
};

type DeleteDraftResponse = {
  success: boolean;
  message?: string;
};

async function getSessionHeaders() {
  const sessionId = await getOrCreateSessionId();
  return {
    'Content-Type': 'application/json',
    ...(sessionId ? { 'x-session-id': sessionId } : {}),
  } satisfies Record<string, string>;
}

async function callDraftEndpoint<T>(params: {
  path: string;
  method: 'GET' | 'POST' | 'DELETE';
  body?: object;
}) {
  const headers = await getSessionHeaders();
  return request<T>(params.path, {
    method: params.method,
    body: params.body,
    headers,
  });
}

export async function saveDraftServiceRequest(payload: DraftSavePayload) {
  return callDraftEndpoint<SaveDraftResponse>({
    path: DRAFT_BASE,
    method: 'POST',
    body: payload,
  });
}

export async function getMyDraftServiceRequests() {
  return callDraftEndpoint<MyDraftsResponse>({
    path: `${DRAFT_BASE}/my-drafts`,
    method: 'GET',
  });
}

export async function getDraftServiceRequestById(draftId: string) {
  return callDraftEndpoint<SaveDraftResponse>({
    path: `${DRAFT_BASE}/${draftId}`,
    method: 'GET',
  });
}

export async function deleteDraftServiceRequest(draftId: string) {
  return callDraftEndpoint<DeleteDraftResponse>({
    path: `${DRAFT_BASE}/${draftId}`,
    method: 'DELETE',
  });
}

export async function migrateDraftsToUser() {
  const token = await getStoredToken();
  if (!token) {
    return {
      error: {
        message: 'Auth token required for migration',
      },
    };
  }

  const sessionId = await getOrCreateSessionId();
  return requestWithAuth<{ success: boolean; migratedCount?: number }>(
    `${DRAFT_BASE}/migrate`,
    token,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(sessionId ? { 'x-session-id': sessionId } : {}),
      } satisfies Record<string, string>,
    }
  );
}