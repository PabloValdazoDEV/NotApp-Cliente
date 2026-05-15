import api from "./config";

export const getOnboarding = async () => {
  try {
    const response = await api.get("/onboarding/me");
    return response.data;
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message || "No se ha podido cargar el tutorial",
    };
  }
};

export const ensureTutorialHome = async () => {
  try {
    const response = await api.post("/onboarding/tutorial-home");
    return response.data;
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "No se ha podido preparar el hogar tutorial",
    };
  }
};

export const completeOnboarding = async ({ version }) => {
  try {
    const response = await api.post("/onboarding/complete", { version });
    return response.data;
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message || "No se ha podido completar el tutorial",
    };
  }
};

export const skipOnboarding = async ({ version }) => {
  try {
    const response = await api.post("/onboarding/skip", { version });
    return response.data;
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message || "No se ha podido saltar el tutorial",
    };
  }
};

export const completeInstallPrompt = async () => {
  try {
    const response = await api.post("/onboarding/install-prompt/complete");
    return response.data;
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "No se ha podido guardar el paso de instalación",
    };
  }
};

export const skipInstallPrompt = async () => {
  try {
    const response = await api.post("/onboarding/install-prompt/skip");
    return response.data;
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "No se ha podido saltar el paso de instalación",
    };
  }
};
