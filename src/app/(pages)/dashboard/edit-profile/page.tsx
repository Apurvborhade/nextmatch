import { ProfileEditForm } from "@/components/profile-edit-form"
import { Toaster } from "sonner"

export default function ProfileEditPage() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-semibold text-gray-900 text-center mb-8">Edit Your Profile</h1>
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <ProfileEditForm />
          <Toaster />
        </div>
      </div>
    </div>
  )
}

