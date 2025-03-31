"use client"

import { useLanguage } from "@/lib/language-context"
import { Button } from "@/components/ui/button"
import { Globe } from "lucide-react"

export function LanguageSelector() {
  const { language, setLanguage, t } = useLanguage()

  return (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4 text-blue-300" />
      <div className="flex rounded-md overflow-hidden">
        <Button
          variant={language === "en" ? "default" : "outline"}
          size="sm"
          onClick={() => setLanguage("en")}
          className={`px-2 py-1 text-xs ${
            language === "en"
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "border-blue-400 text-blue-300 hover:bg-blue-800"
          }`}
        >
          EN
        </Button>
        <Button
          variant={language === "pt" ? "default" : "outline"}
          size="sm"
          onClick={() => setLanguage("pt")}
          className={`px-2 py-1 text-xs ${
            language === "pt"
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "border-blue-400 text-blue-300 hover:bg-blue-800"
          }`}
        >
          PT
        </Button>
      </div>
    </div>
  )
}

