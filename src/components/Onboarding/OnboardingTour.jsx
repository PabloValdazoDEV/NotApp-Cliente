import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import toast from "react-hot-toast";
import { user } from "../../store/userAtom";
import {
  completeInstallPrompt,
  completeOnboarding,
  ensureTutorialHome,
  getOnboarding,
  skipInstallPrompt,
  skipOnboarding,
} from "../../api/onboarding";
import ButtonGeneral from "../Buttons/ButtonGeneral";
import ButtonSecondary from "../Buttons/ButtonSecondary";

const ONBOARDING_VERSION = 1;
const ONBOARDING_REPLAY_KEY = "notapp:onboarding:replay";
const CARD_WIDTH = 360;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const getInstallInstructions = () => {
  const userAgent = navigator.userAgent.toLowerCase();
  const isIOS = /iphone|ipad|ipod/.test(userAgent);
  const isAndroid = /android/.test(userAgent);

  if (isIOS) {
    return {
      title: "Añade NotApp a tu inicio en iPhone",
      items: [
        "Abre NotApp desde Safari.",
        "Pulsa el botón Compartir.",
        "Elige Añadir a pantalla de inicio.",
        "Confirma con Añadir.",
      ],
    };
  }

  if (isAndroid) {
    return {
      title: "Añade NotApp a tu inicio en Android",
      items: [
        "Abre NotApp desde Chrome.",
        "Pulsa el menú de tres puntos.",
        "Elige Añadir a pantalla de inicio o Instalar app.",
        "Confirma la instalación.",
      ],
    };
  }

  return {
    title: "Añade NotApp a tus accesos",
    items: [
      "En móvil puedes añadir NotApp a la pantalla de inicio.",
      "Busca la opción Instalar app o Añadir a pantalla de inicio en tu navegador.",
      "Puedes saltar este paso y seguir usando NotApp desde el navegador.",
    ],
  };
};

const buildSteps = ({ onboarding, tutorialHomeId }) => {
  const installDone =
    onboarding?.installPromptCompletedAt || onboarding?.installPromptSkippedAt;
  const installInstructions = getInstallInstructions();

  return [
    {
      id: "welcome",
      title: "Bienvenido a NotApp",
      text: "Te voy a enseñar lo esencial para crear hogares, preparar listas y hacer la compra sin tocar datos reales.",
    },
    !installDone && {
      id: "install",
      title: installInstructions.title,
      text: "Si quieres usar NotApp como una app, crea un acceso directo en tu pantalla de inicio.",
      items: installInstructions.items,
    },
    {
      id: "home-create",
      route: "/home",
      target: "home-create",
      title: "Crea tus hogares",
      text: "Un hogar es el espacio compartido donde estarán los miembros, productos y listas.",
    },
    {
      id: "home-card",
      route: "/home",
      target: "home-card",
      title: "Entra en un hogar",
      text: "Desde cada tarjeta puedes abrir un hogar. Si no ves el tutorial en la lista, ahora iremos al hogar de práctica directamente.",
    },
    tutorialHomeId && {
      id: "tutorial-home",
      route: `/hogar/${tutorialHomeId}`,
      title: "Hogar Tutorial",
      text: "Este hogar es para practicar. Puedes tocar opciones, probar productos y aprender sin miedo a cambiar un hogar real.",
    },
    tutorialHomeId && {
      id: "home-tabs",
      route: `/hogar/${tutorialHomeId}`,
      target: "hogar-tabs",
      title: "Secciones del hogar",
      text: "Aquí cambias entre listas, productos y miembros. En móvil también puedes deslizar entre secciones.",
    },
    tutorialHomeId && {
      id: "members",
      route: `/hogar/${tutorialHomeId}`,
      target: "hogar-members-tab",
      title: "Miembros",
      text: "Desde miembros puedes invitar personas, ver pendientes y controlar quién participa en el hogar.",
    },
    tutorialHomeId && {
      id: "lists",
      route: `/hogar/${tutorialHomeId}`,
      target: "hogar-lists-tab",
      title: "Listas",
      text: "Las listas son lo que usarás para preparar una compra concreta.",
    },
    tutorialHomeId && {
      id: "list-create",
      route: `/hogar/${tutorialHomeId}`,
      target: "list-create",
      title: "Crea listas",
      text: "Con este botón puedes crear una nueva lista para una compra o una necesidad concreta.",
    },
    tutorialHomeId && {
      id: "products",
      route: `/hogar/${tutorialHomeId}`,
      target: "hogar-products-tab",
      title: "Productos",
      text: "En productos guardas los artículos habituales del hogar para reutilizarlos en listas.",
    },
    tutorialHomeId && {
      id: "product-create",
      route: `/hogar/${tutorialHomeId}`,
      target: "product-create",
      title: "Añade productos",
      text: "Puedes crear productos con nombre, descripción, supermercado, categorías e imagen.",
    },
    {
      id: "profile",
      route: "/profile",
      target: "profile-link",
      title: "Perfil e invitaciones",
      text: "En tu perfil puedes editar tus datos y revisar invitaciones a hogares.",
    },
    {
      id: "finish",
      title: "Ya tienes lo básico",
      text: "Cuando quieras practicar más, entra en el hogar Tutorial. Cuando termines este paso, no volveré a mostrarte la guía automáticamente.",
    },
  ].filter(Boolean);
};

export default function OnboardingTour() {
  const userContext = useAtomValue(user);
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [stepIndex, setStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState(null);
  const [ensuredTutorialHomeId, setEnsuredTutorialHomeId] = useState("");
  const [forceReplay, setForceReplay] = useState(
    () => localStorage.getItem(ONBOARDING_REPLAY_KEY) === "true"
  );

  const { data: onboardingResponse, isLoading } = useQuery({
    queryKey: ["onboarding", userContext?.id],
    queryFn: getOnboarding,
    enabled: Boolean(userContext?.id),
    staleTime: 1000 * 60 * 5,
  });

  const onboarding = onboardingResponse?.onboarding;
  const tutorialHomeId =
    onboarding?.tutorialHomeId || ensuredTutorialHomeId || "";
  const shouldShow =
    onboardingResponse?.success !== false &&
    onboarding &&
    (onboarding.completed === false || forceReplay);
  const steps = useMemo(
    () => buildSteps({ onboarding, tutorialHomeId }),
    [onboarding, tutorialHomeId]
  );
  const currentStep = steps[stepIndex];

  useEffect(() => {
    const replayOnboarding = () => {
      localStorage.setItem(ONBOARDING_REPLAY_KEY, "true");
      setStepIndex(0);
      setForceReplay(true);
    };

    window.addEventListener("notapp:onboarding:replay", replayOnboarding);

    return () => {
      window.removeEventListener("notapp:onboarding:replay", replayOnboarding);
    };
  }, []);

  const closeReplay = (message = "Tutorial cerrado") => {
    localStorage.removeItem(ONBOARDING_REPLAY_KEY);
    setForceReplay(false);
    setStepIndex(0);
    toast.success(message);
  };

  const mutationEnsureTutorialHome = useMutation({
    mutationFn: ensureTutorialHome,
    onSuccess: (response) => {
      if (response?.success === false) {
        toast.error(response.message);
        return;
      }

      if (response?.homeId) {
        setEnsuredTutorialHomeId(response.homeId);
        queryClient.invalidateQueries({ queryKey: ["onboarding", userContext?.id] });
      }
    },
  });

  const mutationComplete = useMutation({
    mutationFn: completeOnboarding,
    onSuccess: (response) => {
      if (response?.success === false) {
        toast.error(response.message);
        return;
      }

      queryClient.invalidateQueries({ queryKey: ["onboarding", userContext?.id] });
      toast.success("Tutorial completado");
    },
  });

  const mutationSkip = useMutation({
    mutationFn: skipOnboarding,
    onSuccess: (response) => {
      if (response?.success === false) {
        toast.error(response.message);
        return;
      }

      queryClient.invalidateQueries({ queryKey: ["onboarding", userContext?.id] });
      toast.success("Tutorial saltado");
    },
  });

  const mutationCompleteInstall = useMutation({
    mutationFn: completeInstallPrompt,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["onboarding", userContext?.id] });
    },
  });

  const mutationSkipInstall = useMutation({
    mutationFn: skipInstallPrompt,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["onboarding", userContext?.id] });
    },
  });

  useEffect(() => {
    if (!shouldShow || isLoading) return;
    if (tutorialHomeId || mutationEnsureTutorialHome.isPending) return;

    mutationEnsureTutorialHome.mutate();
  }, [
    isLoading,
    mutationEnsureTutorialHome,
    shouldShow,
    tutorialHomeId,
  ]);

  useEffect(() => {
    if (!shouldShow || !currentStep?.route) return;
    if (location.pathname === currentStep.route) return;

    navigate(currentStep.route);
  }, [currentStep?.route, location.pathname, navigate, shouldShow]);

  useEffect(() => {
    if (!shouldShow || !currentStep?.target) {
      setTargetRect(null);
      return undefined;
    }

    const measureTarget = () => {
      const elements = Array.from(
        document.querySelectorAll(`[data-tour="${currentStep.target}"]`)
      );
      const visibleElement = elements.find((element) => {
        const rect = element.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0;
      });

      if (!visibleElement) {
        setTargetRect(null);
        return;
      }

      setTargetRect(visibleElement.getBoundingClientRect());
    };

    const timeoutId = window.setTimeout(measureTarget, 250);
    window.addEventListener("resize", measureTarget);
    window.addEventListener("scroll", measureTarget, true);

    return () => {
      window.clearTimeout(timeoutId);
      window.removeEventListener("resize", measureTarget);
      window.removeEventListener("scroll", measureTarget, true);
    };
  }, [currentStep?.target, location.pathname, shouldShow]);

  useEffect(() => {
    if (stepIndex <= steps.length - 1) return;
    setStepIndex(Math.max(steps.length - 1, 0));
  }, [stepIndex, steps.length]);

  if (!shouldShow || isLoading || !currentStep) return null;

  const isLastStep = stepIndex === steps.length - 1;
  const isInstallStep = currentStep.id === "install";
  const cardLeft = targetRect
    ? clamp(
        targetRect.left,
        16,
        window.innerWidth - Math.min(CARD_WIDTH, window.innerWidth - 32) - 16
      )
    : 16;
  const cardTop = targetRect
    ? targetRect.bottom + 260 > window.innerHeight
      ? Math.max(16, targetRect.top - 240)
      : targetRect.bottom + 12
    : Math.max(80, window.innerHeight / 2 - 190);
  const cardStyle = targetRect
    ? {
        left: `${cardLeft}px`,
        top: `${cardTop}px`,
        width: `min(${CARD_WIDTH}px, calc(100vw - 32px))`,
      }
    : {
        left: "50%",
        top: "50%",
        width: "min(380px, calc(100vw - 32px))",
        transform: "translate(-50%, -50%)",
      };

  const goNext = () => {
    if (isInstallStep && !onboarding?.installPromptCompletedAt) {
      mutationCompleteInstall.mutate();
    }

    if (isLastStep) {
      if (forceReplay) {
        closeReplay("Tutorial visto");
        return;
      }

      mutationComplete.mutate({ version: ONBOARDING_VERSION });
      return;
    }

    setStepIndex((prev) => prev + 1);
  };

  const skipStep = () => {
    if (isInstallStep && !onboarding?.installPromptSkippedAt) {
      mutationSkipInstall.mutate();
    }

    if (isLastStep) {
      if (forceReplay) {
        closeReplay();
        return;
      }

      mutationComplete.mutate({ version: ONBOARDING_VERSION });
      return;
    }

    setStepIndex((prev) => prev + 1);
  };

  const skipAll = () => {
    if (forceReplay) {
      closeReplay();
      return;
    }

    mutationSkip.mutate({ version: ONBOARDING_VERSION });
  };

  return (
    <div className="fixed inset-0 z-[90]">
      {!targetRect && (
        <div className="absolute inset-0 bg-slate-950/55 backdrop-blur-[1px]" />
      )}
      {targetRect ? (
        <div
          className="pointer-events-none fixed rounded-xl border-2 border-white shadow-[0_0_0_9999px_rgba(15,23,42,0.55)] ring-4 ring-(--color-primary)"
          style={{
            left: targetRect.left - 6,
            top: targetRect.top - 6,
            width: targetRect.width + 12,
            height: targetRect.height + 12,
          }}
        />
      ) : (
        null
      )}
      <div
        className="fixed rounded-2xl bg-white p-5 shadow-2xl"
        style={cardStyle}
        role="dialog"
        aria-modal="true"
        aria-labelledby="onboarding-title"
      >
        <div className="mb-3 flex items-center justify-between gap-3">
          <span className="rounded-full bg-(--color-primary)/10 px-3 py-1 text-xs font-bold text-(--color-primary)">
            Paso {stepIndex + 1} de {steps.length}
          </span>
          <button
            type="button"
            className="text-xs font-semibold text-gray-500 hover:text-gray-900"
            onClick={skipAll}
          >
            Saltar tutorial
          </button>
        </div>
        <h2 id="onboarding-title" className="text-xl font-bold text-gray-900">
          {currentStep.title}
        </h2>
        <p className="mt-2 text-sm leading-6 text-gray-600">
          {currentStep.text}
        </p>
        {currentStep.items && (
          <ol className="mt-3 flex list-decimal flex-col gap-2 pl-5 text-sm text-gray-700">
            {currentStep.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        )}
        <div className="mt-5 grid grid-cols-2 gap-3">
          <ButtonSecondary
            type="button"
            className="w-full px-3"
            onClick={skipStep}
            loading={mutationSkipInstall.isPending}
            loadingText="Saltando..."
          >
            Saltar paso
          </ButtonSecondary>
          <ButtonGeneral
            type="button"
            className="w-full px-3"
            onClick={goNext}
            loading={mutationComplete.isPending || mutationCompleteInstall.isPending}
          >
            {isLastStep ? "Finalizar" : "Siguiente"}
          </ButtonGeneral>
        </div>
      </div>
    </div>
  );
}
