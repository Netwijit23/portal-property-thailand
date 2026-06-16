import Navbar from "@/components/Navbar";
import SubmitForm from "@/components/SubmitForm";

export default function SubmitPage() {
  return (
    <>
      <Navbar />
      <main className="pt-16 min-h-screen bg-[#FAFAF8]">
        <div className="max-w-2xl mx-auto px-4 py-10">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-px w-8 bg-[#B8935A]" />
              <span className="font-sans text-xs uppercase tracking-[0.25em] text-[#B8935A]">For Agents</span>
            </div>
            <h1 className="font-cormorant font-light text-3xl md:text-4xl text-[#0A0A0A] mb-2">
              List a property
            </h1>
            <p className="font-sans text-sm text-[#8A8680]">
              Fill in the details below. Your listing will be reviewed and published shortly.
            </p>
          </div>
          <SubmitForm />
        </div>
      </main>
    </>
  );
}
