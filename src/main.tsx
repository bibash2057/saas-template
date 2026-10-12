import "./i18n";
import "./index.css";
import App from "./App.tsx";
import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { Spinner } from "#components/ui/spinner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Suspense
        fallback={
          <div className="grid h-dvh place-items-center">
            <Spinner className="size-6" />
          </div>
        }
      >
        <App />
      </Suspense>
    </QueryClientProvider>
  </StrictMode>,
);
