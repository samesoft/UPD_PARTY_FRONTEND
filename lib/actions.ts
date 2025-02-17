"use server"

export async function submitVolunteerForm(formData: FormData) {
  const data = {
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    postcode: formData.get("postcode"),
    email: formData.get("email"),
    mobile: formData.get("mobile"),
    activities: formData.getAll("activities"),
    newsletter: formData.get("newsletter") === "true",
  }

  // This would typically connect to your backend service
  console.log("Form submitted:", data)

  return { success: true }
}

