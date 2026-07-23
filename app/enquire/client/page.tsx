import type { Metadata } from "next";
import FormPage from "@/components/enquire/FormPage";
import ClientForm from "@/components/enquire/ClientForm";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Find My Home in Bangkok | Portal Property Thailand",
  description: "Tell us what you're looking for and we'll curate matching condos and houses across Bangkok's BTS corridor. Book a viewing today.",
  path: "/enquire/client",
});

export default function ClientEnquiryPage() {
  return (
    <FormPage eyebrow="Renters & Buyers" heading="Let's find your home">
      <ClientForm />
    </FormPage>
  );
}
