"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { updateUserPreferences } from "@/app/actions"
import { useTheme } from "next-themes"
import { useLanguage } from "@/components/language-provider"

interface AppSettingsProps {
  userId: number
  initialLanguage?: "fr" | "en"
  initialTheme?: "light" | "dark" | "system"
}

export function AppSettings({ userId, initialLanguage = "fr", initialTheme = "system" }: AppSettingsProps) {
  const { toast } = useToast()
  const { setTheme } = useTheme()
  const { t, setLanguage } = useLanguage()
  const [isLoading, setIsLoading] = useState(false)
  const [settings, setSettings] = useState({
    language: initialLanguage,
    theme: initialTheme,
  })

  // Mettre à jour le thème lorsqu'il change
  useEffect(() => {
    setTheme(settings.theme)
  }, [settings.theme, setTheme])

  const handleSaveSettings = async () => {
    setIsLoading(true)
    try {
      const result = await updateUserPreferences(userId, {
        language: settings.language,
        theme: settings.theme,
      })

      if (result.success) {
        // Mettre à jour le thème et la langue dans l'application
        setTheme(settings.theme)
        setLanguage(settings.language)

        toast({
          title: t("settings.settingsSaved"),
          description: t("settings.settingsUpdated"),
        })
      } else {
        toast({
          title: t("general.error"),
          description: result.error || t("general.error"),
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: t("general.error"),
        description: t("general.error"),
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="theme">{t("settings.theme")}</Label>
          <Select value={settings.theme} onValueChange={(value) => setSettings({ ...settings, theme: value as any })}>
            <SelectTrigger id="theme">
              <SelectValue placeholder={t("settings.selectTheme")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">{t("settings.light")}</SelectItem>
              <SelectItem value="dark">{t("settings.dark")}</SelectItem>
              <SelectItem value="system">{t("settings.system")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="language">{t("settings.language")}</Label>
          <Select
            value={settings.language}
            onValueChange={(value) => setSettings({ ...settings, language: value as any })}
          >
            <SelectTrigger id="language">
              <SelectValue placeholder={t("settings.selectLanguage")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fr">{t("settings.french")}</SelectItem>
              <SelectItem value="en">{t("settings.english")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button onClick={handleSaveSettings} disabled={isLoading}>
        {isLoading ? t("general.processing") : t("general.save")}
      </Button>
    </div>
  )
}
