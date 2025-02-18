import { redirect } from "next/navigation";

export default function IndexPage() {
  redirect("/landing"); // Automatically redirects to the Home Page
}
