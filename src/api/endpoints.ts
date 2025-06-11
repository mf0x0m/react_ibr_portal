const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export const ENDPOINTS = {
  auth: {
    login: `${BASE_URL}/api/auth/login`,
  },
  trainingSearch: {
    csv: `${BASE_URL}/api/training-search/csv`,
    detail: (web_id: string) => `${BASE_URL}/api/training-detail/${web_id}`,
  },
  traineeSearch: {
    detail: (applicationId: string) => `${BASE_URL}/api/trainee/detail/${applicationId}`,
  },
  cancelRequest: {
    confirm: `${BASE_URL}/api/cancel-request/confirm`,
    submit: `${BASE_URL}/api/cancel-request/submit`,
  },
  closeRequest: {
    prepare: `${BASE_URL}/api/close-request/prepare`,
    scrape: `${BASE_URL}/api/close-request/scrape`,
  },
};

// import { ENDPOINTS } from "@/api/endpoints"