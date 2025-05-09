import { redirect } from "next/navigation";

export async function GET() {
  redirect("/dashboard/Management/coop/landManagement");
}
