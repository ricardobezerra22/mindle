import { ref, type Ref } from "vue";

declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: any;
      };
    };
  }
}

type GoogleButtonOptions = {
  text?: "continue_with" | "signup_with";
  theme?: "filled_blue" | "outline";
  size?: "large" | "medium" | "small";
  shape?: "pill" | "rectangular";
  width?: number;
};

export const useGoogleAuth = () => {
  const googleReady = ref(false);
  const googleButtonContainer = ref<HTMLElement | null>(null);

  const initializeGoogleButton = (
    containerRef: Ref<HTMLElement | null>,
    onSuccess: (response: any) => void,
    options?: GoogleButtonOptions,
  ) => {
    const clientId = useRuntimeConfig().public.googleClientId;

    const renderGoogleButton = () => {
      if (!window.google?.accounts?.id || !containerRef.value) {
        setTimeout(renderGoogleButton, 100);
        return;
      }

      try {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: onSuccess,
        });

        window.google.accounts.id.renderButton(containerRef.value, {
          theme: options?.theme || "filled_blue",
          size: options?.size || "large",
          text: options?.text || "continue_with",
          shape: options?.shape || "pill",
          width: options?.width || 200,
        });

        googleReady.value = true;
      } catch (error) {
        console.error("Error rendering Google button:", error);
        setTimeout(renderGoogleButton, 100);
      }
    };

    if (window.google?.accounts?.id) {
      renderGoogleButton();
    } else if (!document.querySelector('script[src*="accounts.google.com"]')) {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = renderGoogleButton;
      document.head.appendChild(script);
    } else {
      renderGoogleButton();
    }
  };

  return {
    googleReady,
    googleButtonContainer,
    initializeGoogleButton,
  };
};
