"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { updateUserProfile } from "@/app/actions"

interface ProfileFormProps {
  user: {
    id: number
    name: string
    email: string
    isAdmin?: boolean
  }
}

export function ProfileForm({ user }: ProfileFormProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Vérifier si les mots de passe correspondent
      if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
        toast({
          title: "Erreur",
          description: "Les mots de passe ne correspondent pas.",
          variant: "destructive",
        })
        return
      }

      const result = await updateUserProfile(user.id, {
        name: formData.name,
        email: formData.email,
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      })

      if (result.success) {
        toast({
          title: "Profil mis à jour",
          description: "Vos informations ont été mises à jour avec succès.",
        })

        // Réinitialiser les champs de mot de passe
        setFormData({
          ...formData,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        })
      } else {
        toast({
          title: "Erreur",
          description: result.error || "Une erreur est survenue lors de la mise à jour du profil.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour du profil.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src="/placeholder.svg?height=64&width=64" alt={user.name} />
          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <Button type="button" variant="outline" size="sm">
            Changer la photo
          </Button>
          <p className="mt-2 text-xs text-muted-foreground">JPG, PNG ou GIF. 1MB maximum.</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Nom complet</Label>
          <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Changer le mot de passe</h3>
        <div className="grid gap-2">
          <Label htmlFor="currentPassword">Mot de passe actuel</Label>
          <Input
            id="currentPassword"
            name="currentPassword"
            type="password"
            value={formData.currentPassword}
            onChange={handleChange}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="newPassword">Nouveau mot de passe</Label>
          <Input
            id="newPassword"
            name="newPassword"
            type="password"
            value={formData.newPassword}
            onChange={handleChange}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
        </div>
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Mise à jour..." : "Mettre à jour le profil"}
      </Button>
    </form>
  )
}
