import type { Metadata } from "next";
import FormPage from "@/components/enquire/FormPage";
import ClientForm from "@/components/enquire/ClientForm";

export const metadata: Metadata = {
  title: "Find My Home | Portal Property Thailand",
  description: "Tell us what you're looking for and we'll curate matching properties across Bangkok.",
};

export default function ClientEnquiryPage() {
  return (
    <FormPage eyebrow="Renters & Buyers" heading="Let's find your home">
      <ClientForm />
    </FormPage>
  );
}
