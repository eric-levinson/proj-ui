"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

type NavLink = {
  href: string;
  label: string;
  external?: boolean;
};

const NAV_LINKS: NavLink[] = [
  { href: "/players", label: "Players" },
  { href: "/ff-opp", label: "FF Opportunity" },
];

function isActivePath(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Navbar() {
  const pathname = usePathname();

  return (
    <div className="sticky top-0 z-40 w-full border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-6 px-4 py-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-foreground"
        >
          Projection Explorer
        </Link>
        <NavigationMenu className="justify-end" viewport={false}>
          <NavigationMenuList>
            {NAV_LINKS.map(({ href, label, external }) => (
              <NavigationMenuItem key={href}>
                <NavigationMenuLink asChild data-active={isActivePath(pathname, href)}>
                  {external ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      className={cn(
                        "rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                        "data-[active=true]:bg-accent/60 data-[active=true]:text-accent-foreground"
                      )}
                    >
                      {label}
                    </a>
                  ) : (
                    <Link
                      href={href}
                      className={cn(
                        "rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                        "data-[active=true]:bg-accent/60 data-[active=true]:text-accent-foreground"
                      )}
                      prefetch
                    >
                      {label}
                    </Link>
                  )}
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
  );
}

export default Navbar;
