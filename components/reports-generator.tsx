"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePicker } from "@/components/date-picker"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Download, FileText } from "lucide-react"
import { generateReport } from "@/app/actions"
import { useLanguage } from "@/components/language-provider"

export function ReportsGenerator() {
  const { t } = useLanguage()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [reportType, setReportType] = useState("daily")
  const [startDate, setStartDate] = useState<Date | undefined>(new Date())
  const [endDate, setEndDate] = useState<Date | undefined>(new Date())
  const [format, setFormat] = useState("pdf")
  const [generatedReport, setGeneratedReport] = useState<{
    id: number
    name: string
    url: string
    format: string
  } | null>(null)

  const handleGenerateReport = async () => {
    if (!startDate || !endDate) {
      toast({
        title: t("general.error"),
        description: t("reports.selectDates"),
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const result = await generateReport({
        type: reportType as "daily" | "weekly" | "monthly" | "custom",
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
        format: format as "pdf" | "excel" | "csv",
      })

      if (result.success) {
        toast({
          title: t("reports.generated"),
          description: `${t("reports.reportGenerated")} ${reportType}.`,
        })
        setGeneratedReport(result.report)
      } else {
        toast({
          title: t("general.error"),
          description: t("reports.generationError"),
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: t("general.error"),
        description: t("reports.generationError"),
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (date: Date): string => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  const handleDownload = () => {
    if (!generatedReport) return

    // Simuler un téléchargement
    toast({
      title: t("reports.downloadingReport"),
      description: `${t("reports.downloading")} ${generatedReport.format.toUpperCase()}...`,
    })

    // Dans une application réelle, vous redirigeriez vers l'URL du rapport
    // window.open(generatedReport.url, '_blank')

    // Simuler un téléchargement après un court délai
    setTimeout(() => {
      const link = document.createElement("a")
      link.href = generatedReport.url
      link.download = `${generatedReport.name}.${generatedReport.format}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="report-type">{t("reports.type")}</Label>
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger id="report-type">
              <SelectValue placeholder={t("reports.selectReportType")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">{t("reports.daily")}</SelectItem>
              <SelectItem value="weekly">{t("reports.weekly")}</SelectItem>
              <SelectItem value="monthly">{t("reports.monthly")}</SelectItem>
              <SelectItem value="custom">{t("reports.custom")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="format">{t("reports.format")}</Label>
          <Select value={format} onValueChange={setFormat}>
            <SelectTrigger id="format">
              <SelectValue placeholder={t("reports.selectFormat")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pdf">PDF</SelectItem>
              <SelectItem value="excel">Excel</SelectItem>
              <SelectItem value="csv">CSV</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>{t("reports.startDate")}</Label>
          <DatePicker date={startDate} setDate={setStartDate} />
        </div>

        <div className="space-y-2">
          <Label>{t("reports.endDate")}</Label>
          <DatePicker date={endDate} setDate={setEndDate} />
        </div>
      </div>

      <Button onClick={handleGenerateReport} disabled={isLoading} className="w-full sm:w-auto">
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {t("reports.generating")}
          </>
        ) : (
          t("reports.generate")
        )}
      </Button>

      {generatedReport && (
        <div className="mt-6 p-4 border rounded-md bg-muted">
          <h3 className="font-medium mb-2">{t("reports.generated")}</h3>
          <div className="flex items-center gap-2 mb-4">
            <FileText className="h-4 w-4 text-primary" />
            <p className="text-sm">{generatedReport.name}</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleDownload} variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              {t("general.download")} ({generatedReport.format.toUpperCase()})
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
