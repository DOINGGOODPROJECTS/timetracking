"use client"

import type React from "react"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UserPlus, MapPin, Pencil, Trash2, FileText } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { updateEmployee } from "@/app/actions"
import Link from "next/link"

interface Employee {
  id: number
  name: string
  email: string
  department: string
  status: "active" | "inactive"
  lastLocation?: {
    latitude: number
    longitude: number
    address?: string
  }
}

interface EmployeesTableProps {
  employees: Employee[]
}

export function EmployeesTable({ employees: initialEmployees }: EmployeesTableProps) {
  const { toast } = useToast()
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleAddEmployee = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    const newEmployee: Employee = {
      id: employees.length + 1,
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      department: formData.get("department") as string,
      status: "active",
    }

    setEmployees([...employees, newEmployee])
    setIsAddDialogOpen(false)

    toast({
      title: "Employé ajouté",
      description: `${newEmployee.name} a été ajouté avec succès.`,
    })
  }

  const handleEditEmployee = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!currentEmployee) return

    setIsLoading(true)

    const formData = new FormData(event.currentTarget)

    const updatedEmployee: Employee = {
      ...currentEmployee,
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      department: formData.get("department") as string,
    }

    try {
      const result = await updateEmployee(updatedEmployee.id, {
        name: updatedEmployee.name,
        email: updatedEmployee.email,
        department: updatedEmployee.department,
      })

      if (result.success) {
        setEmployees(employees.map((emp) => (emp.id === updatedEmployee.id ? updatedEmployee : emp)))

        toast({
          title: "Employé mis à jour",
          description: `Les informations de ${updatedEmployee.name} ont été mises à jour.`,
        })

        setIsEditDialogOpen(false)
      } else {
        toast({
          title: "Erreur",
          description: result.error || "Une erreur est survenue lors de la mise à jour.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour de l'employé.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Liste des employés</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Ajouter un employé
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleAddEmployee}>
              <DialogHeader>
                <DialogTitle>Ajouter un nouvel employé</DialogTitle>
                <DialogDescription>
                  Remplissez les informations pour ajouter un nouvel employé au système.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nom complet</Label>
                  <Input id="name" name="name" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="department">Département</Label>
                  <Input id="department" name="department" required />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Ajouter</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Département</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Dernière position</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.map((employee) => (
            <TableRow key={employee.id}>
              <TableCell className="font-medium">{employee.name}</TableCell>
              <TableCell>{employee.email}</TableCell>
              <TableCell>{employee.department}</TableCell>
              <TableCell>
                <Badge variant={employee.status === "active" ? "default" : "secondary"}>
                  {employee.status === "active" ? "Actif" : "Inactif"}
                </Badge>
              </TableCell>
              <TableCell>
                {employee.lastLocation ? (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs truncate max-w-[100px]">
                      {employee.lastLocation.address
                        ? employee.lastLocation.address
                        : typeof employee.lastLocation.latitude === "number" &&
                          typeof employee.lastLocation.longitude === "number"
                        ? `${employee.lastLocation.latitude.toFixed(4)}, ${employee.lastLocation.longitude.toFixed(4)}`
                        : "Coordonnées non disponibles"}
                    </span>
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground">Non disponible</span>
                )}
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/admin/timesheet/${employee.id}`}>
                      <FileText className="h-4 w-4" />
                      <span className="sr-only">Voir les pointages</span>
                    </Link>
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setCurrentEmployee(employee)
                      setIsEditDialogOpen(true)
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Modifier</span>
                  </Button>
{/* 
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4 text-destructive" />
                        <span className="sr-only">Supprimer</span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Cette action ne peut pas être annulée. Cela supprimera définitivement l'employé
                          {employee.name} et toutes les données associées.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteEmployee(employee.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          {isLoading ? "Suppression..." : "Supprimer"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog> */}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Dialog pour modifier un employé */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          {currentEmployee && (
            <form onSubmit={handleEditEmployee}>
              <DialogHeader>
                <DialogTitle>Modifier un employé</DialogTitle>
                <DialogDescription>Modifiez les informations de l'employé.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-name">Nom complet</Label>
                  <Input id="edit-name" name="name" defaultValue={currentEmployee.name} required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-email">Email</Label>
                  <Input id="edit-email" name="email" type="email" defaultValue={currentEmployee.email} required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-department">Département</Label>
                  <Input id="edit-department" name="department" defaultValue={currentEmployee.department} required />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Mise à jour..." : "Mettre à jour"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
