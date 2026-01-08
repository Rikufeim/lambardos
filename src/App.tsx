import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Laskutus from "./pages/Laskutus";
import Tietosuoja from "./pages/Tietosuoja";
import IntroGameOverlay from "./components/IntroGameOverlay";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <IntroGameOverlay>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/laskutus" element={<Laskutus />} />
            <Route path="/tietosuoja" element={<Tietosuoja />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </IntroGameOverlay>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
