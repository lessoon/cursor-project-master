"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Package, Settings } from "lucide-react"

interface NavbarProps {
  onToggleContextPack: () => void
  onOpenSettings: () => void
  contextPackCount?: number
}

export function Navbar({ onToggleContextPack, onOpenSettings, contextPackCount = 0 }: NavbarProps) {
  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0B0E14]/80 backdrop-blur-[12px]">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-gradient-to-br from-[#5B8EFF] to-[#4ADE80] rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">C</span>
        </div>
        <span className="font-semibold text-white text-lg">CPM</span>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="text-white/60 hover:text-white hover:bg-white/10"
          onClick={onOpenSettings}
        >
          <Settings className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="text-white/60 hover:text-white hover:bg-white/10 relative"
          onClick={onToggleContextPack}
        >
          <Package className="h-4 w-4 mr-2" />
          Context Pack
          {contextPackCount > 0 && (
            <Badge className="ml-2 bg-[#5B8EFF] text-white text-xs px-1.5 py-0.5">
              {contextPackCount}
            </Badge>
          )}
        </Button>
      </div>
    </nav>
  )
}
