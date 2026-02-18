import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Telefonlar from "./pages/Telefonlar";
import Paketler from "./pages/Paketler";
import Aksesuarlar from "./pages/Aksesuarlar";
import Hakkimizda from "./pages/Hakkimizda";
import Iletisim from "./pages/Iletisim";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminPhones from "./pages/admin/AdminPhones";
import AdminPackages from "./pages/admin/AdminPackages";
import AdminAccessories from "./pages/admin/AdminAccessories";
import Superbox from "./pages/Superbox";
import AdminSuperbox from "./pages/admin/AdminSuperbox";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/telefonlar" component={Telefonlar} />
      <Route path="/paketler" component={Paketler} />
      <Route path="/aksesuarlar" component={Aksesuarlar} />
      <Route path="/hakkimizda" component={Hakkimizda} />
      <Route path="/iletisim" component={Iletisim} />
      <Route path="/superbox" component={Superbox} />
      <Route path="/admin">
        <AdminLayout><AdminDashboard /></AdminLayout>
      </Route>
      <Route path="/admin/telefonlar">
        <AdminLayout><AdminPhones /></AdminLayout>
      </Route>
      <Route path="/admin/paketler">
        <AdminLayout><AdminPackages /></AdminLayout>
      </Route>
      <Route path="/admin/aksesuarlar">
        <AdminLayout><AdminAccessories /></AdminLayout>
      </Route>
      <Route path="/admin/superbox">
        <AdminLayout><AdminSuperbox /></AdminLayout>
      </Route>
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
