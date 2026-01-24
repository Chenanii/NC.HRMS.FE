import { apiClient } from "../../utilits/apiClient";

const ONBOARDING_TEMPLATES_BASE = "/api/OnboardingTemplates";

export const createOnboardingTemplate = async (templateDto) => {
  const res = await apiClient.post(ONBOARDING_TEMPLATES_BASE, templateDto);
  return res.data;
};

export const updateOnboardingTemplate = async (id, templateDto) => {
  const res = await apiClient.put(`${ONBOARDING_TEMPLATES_BASE}/updateonboardingtemplate/${id}`, templateDto);
  return res.data;
};

export const deleteOnboardingTemplate = async (templateId) => {
  const res = await apiClient.delete(`${ONBOARDING_TEMPLATES_BASE}/${templateId}`);
  return res.data;
};

export const getOnboardingTemplates = async (includeInactive = true) => {
  const res = await apiClient.get(ONBOARDING_TEMPLATES_BASE, {
    params: { includeInactive }
  });
  return res.data;
};

export const getOnboardingTemplateById = async (templateId) => {
  const res = await apiClient.get(`${ONBOARDING_TEMPLATES_BASE}/${templateId}`);
  return res.data;
};
