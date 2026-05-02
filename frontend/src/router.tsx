import { createBrowserRouter } from "react-router-dom";
import { RootLayout } from "./layouts/main";
import { Login } from "./pages/login";
import { Register } from "./pages/register";
import { Home } from "./pages/home";
import { Dashboard } from "./pages/dashboard";
import { ProductDiscovery } from "./pages/productDiscovery";
import { ProductDetail } from "./pages/productDetail";
import { Checkout } from "./pages/checkout";
import { Tracking } from "./pages/tracking";
import { AdminPanel } from "./pages/admin";
import { SellerDashboard } from "./pages/sellerDashboard";
import { AddProduct } from "./pages/addProduct";
import { ExportDocs } from "./pages/exportProduct";
import { HelpCenter } from "./pages/helpCenter";
import { SupportTicket } from "./pages/supportCenter";
import { Profile } from "./pages/profile";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: Home },
      { path: "login", Component: Login },
      { path: "register", Component: Register },
      { path: "dashboard", Component: Dashboard },
      { path: "products", Component: ProductDiscovery },
      { path: "products/:id", Component: ProductDetail },
      { path: "checkout/:id", Component: Checkout },
      { path: "tracking", Component: Tracking },
      { path: "admin", Component: AdminPanel },
      { path: "seller", Component: SellerDashboard },
      { path: "seller/products/new", Component: AddProduct },
      { path: "seller/products/:id/edit", Component: AddProduct },
      { path: "seller/export-docs", Component: ExportDocs },
      { path: "help", Component: HelpCenter },
      { path: "support", Component: SupportTicket },
      { path: "profile", Component: Profile },
    ],
  },
]);
