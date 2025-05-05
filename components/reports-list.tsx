"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Download, Eye } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Report {
  id: number
  name: string
  type: string
  date: string
  format: string
  size: string
  url: string
}

interface ReportsListProps {
  reports: Report[]
}

export function ReportsList({ reports }: ReportsListProps) {
  const { toast } = useToast()

  const handleDownload = (report: Report) => {
    // Simuler un téléchargement
    toast({
      title: "Téléchargement",
      description: `Téléchargement du rapport "${report.name}" au format ${report.format.toUpperCase()}...`,
    })

    // Dans une application réelle, vous redirigeriez vers l'URL du rapport
    // window.open(report.url, '_blank')
  }

  const handleView = (report: Report) => {
    // Simuler une visualisation
    toast({
      title: "Visualisation",
      description: `Ouverture du rapport "${report.name}"...`,
    })

    // Dans une application réelle, vous redirigeriez vers une page de visualisation
    // window.open(`/reports/view/${report.id}`, '_blank')
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nom</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Format</TableHead>
          <TableHead>Taille</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {reports.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
              Aucun rapport trouvé
            </TableCell>
          </TableRow>
        ) : (
          reports.map((report) => (
            <TableRow key={report.id}>
              <TableCell className="font-medium">{report.name}</TableCell>
              <TableCell>
                {report.type === "daily"
                  ? "Quotidien"
                  : report.type === "weekly"
                    ? "Hebdomadaire"
                    : report.type === "monthly"
                      ? "Mensuel"
                      : "Personnalisé"}
              </TableCell>
              <TableCell>{report.date}</TableCell>
              <TableCell>{report.format.toUpperCase()}</TableCell>
              <TableCell>{report.size}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => handleView(report)}>
                    <Eye className="h-4 w-4" />
                    <span className="sr-only">Voir</span>
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDownload(report)}>
                    <Download className="h-4 w-4" />
                    <span className="sr-only">Télécharger</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}
