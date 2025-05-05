"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/components/language-provider"

export function NotificationSettings() {
  const { t } = useLanguage()
  const { toast } = useToast()
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    dailySummary: true,
    lateCheckInAlert: true,
    missedCheckOutAlert: true,
  })

  const handleSaveSettings = () => {
    // Dans une application réelle, vous enverriez ces paramètres à une API
    toast({
      title: t("settings.settingsSaved"),
      description: t("settings.settingsUpdated"),
    })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="email-notifications">{t("settings.emailNotifications")}</Label>
            <p className="text-sm text-muted-foreground">{t("settings.receiveEmailNotifications")}</p>
          </div>
          <Switch
            id="email-notifications"
            checked={settings.emailNotifications}
            onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="push-notifications">{t("settings.pushNotifications")}</Label>
            <p className="text-sm text-muted-foreground">{t("settings.receivePushNotifications")}</p>
          </div>
          <Switch
            id="push-notifications"
            checked={settings.pushNotifications}
            onCheckedChange={(checked) => setSettings({ ...settings, pushNotifications: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="daily-summary">{t("settings.dailySummary")}</Label>
            <p className="text-sm text-muted-foreground">{t("settings.receiveDailySummary")}</p>
          </div>
          <Switch
            id="daily-summary"
            checked={settings.dailySummary}
            onCheckedChange={(checked) => setSettings({ ...settings, dailySummary: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="late-check-in">{t("settings.lateAlert")}</Label>
            <p className="text-sm text-muted-foreground">{t("settings.receiveLateAlert")}</p>
          </div>
          <Switch
            id="late-check-in"
            checked={settings.lateCheckInAlert}
            onCheckedChange={(checked) => setSettings({ ...settings, lateCheckInAlert: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="missed-check-out">{t("settings.missedCheckOutAlert")}</Label>
            <p className="text-sm text-muted-foreground">{t("settings.receiveMissedCheckOutAlert")}</p>
          </div>
          <Switch
            id="missed-check-out"
            checked={settings.missedCheckOutAlert}
            onCheckedChange={(checked) => setSettings({ ...settings, missedCheckOutAlert: checked })}
          />
        </div>
      </div>

      <Button onClick={handleSaveSettings}>{t("general.save")}</Button>
    </div>
  )
}
