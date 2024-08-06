import { Home, Headphones, Search, Star } from "lucide-react";
import Index from "./pages/Index.jsx";

/**
 * Central place for defining the navigation items. Used for navigation components and routing.
 */
export const navItems = [
  {
    title: "Home",
    to: "/",
    icon: <Home className="h-4 w-4" />,
    page: <Index />,
  },
  {
    title: "Explore",
    to: "/explore",
    icon: <Headphones className="h-4 w-4" />,
    page: <Index />, // Placeholder, replace with actual Explore component when created
  },
  {
    title: "Search",
    to: "/search",
    icon: <Search className="h-4 w-4" />,
    page: <Index />, // Placeholder, replace with actual Search component when created
  },
  {
    title: "Favorites",
    to: "/favorites",
    icon: <Star className="h-4 w-4" />,
    page: <Index />, // Placeholder, replace with actual Favorites component when created
  },
];
