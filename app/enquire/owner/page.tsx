import type { Metadata } from "next";
import FormPage from "@/components/enquire/FormPage";
import OwnerForm from "@/components/enquire/OwnerForm";

export const metadata: Metadata = {
  title: "List My Property | Portal Property Thailand",
  description: "Owners: rent out or sell your unit with Portal Property's full-service marketing.",
};

export default function OwnerEnquiryPage() {
  return (
    <FormPage eyebrow="Owners & Landlords" heading="List your property">
      <OwnerForm />
    </FormPage>
  );
}
