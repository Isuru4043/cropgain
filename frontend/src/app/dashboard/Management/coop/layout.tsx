"use client";

import React, { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface CoopStateLayoutProps {
  children: ReactNode;
}

// Reusable Navigation Item Component
const NavItem = ({ href, label }: { href: string; label: string }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <li>
      <Link
        href={href}
        className={`cursor-pointer p-2 rounded-md block font-semibold transition-colors duration-200 ${
          isActive
            ? "bg-green-700 text-gray-100"
            : "text-white hover:text-gray-300"
        }`}
        aria-current={isActive ? "page" : undefined}
      >
        {label}
      </Link>
    </li>
  );
};

export default function CoopStateLayout({ children }: CoopStateLayoutProps) {
  return (
    <div className="h-screen flex bg-background font-roboto">
      {/* Left Sidebar */}
      <aside className="w-1/5 bg-green-800 text-white h-full p-4 flex flex-col">
        <nav className="flex-1">
          <ul className="space-y-2">
            <NavItem
              href="/dashboard/Management/coop/cropManagement"
              label="Crop Management"
            />
            <NavItem
              href="/dashboard/Management/coop/landManagement"
              label="Land Management"
            />
            <NavItem
              href="/dashboard/Management/coop/plantingGrowthTracking"
              label="Planting & Growth Tracking"
            />
            <NavItem
              href="/dashboard/Management/coop/harvestManagement"
              label="Harvest Management"
            />
            <NavItem
              href="/dashboard/Management/coop/fertilizationManagement"
              label="Fertilization Management"
            />
            <NavItem
              href="/dashboard/Management/coop/laborManagement"
              label="Labor Management"
            />
            <NavItem
              href="/dashboard/Management/coop/resourceManagement"
              label="Resource Management"
            />
            <NavItem
              href="/dashboard/Management/coop/integrationCapabilities"
              label="Integration Capabilities"
            />
          </ul>
        </nav>
        {/* Optional: Add Footer or Additional Content Here */}
      </aside>

      {/* Content Area */}
      <main className="flex-1 p-3 overflow-auto">{children}</main>
    </div>
  );
}
