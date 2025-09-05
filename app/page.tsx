import { redirect } from "next/navigation";

/**
 * Home page component.
 * 
 * Redirects users to the polls listing page.
 */
export default function Home() {
  redirect("/polls");
}
