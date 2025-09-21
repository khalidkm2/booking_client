import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}



export async function uploadToCloudinary(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "your_unsigned_preset");

  const res = await fetch(
    "https://api.cloudinary.com/v1_1/<your-cloud-name>/image/upload",
    { method: "POST", body: formData }
  );

  const data = await res.json();
  return data.secure_url; // ✅ cloud URL
}
