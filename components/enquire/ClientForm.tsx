"use client";
import { useState } from "react";
import { Field, TextInput, TextArea, PrefixInput, Segmented, ChipMulti, ChipSingle, StepShell, SuccessCard, ShortStayNotice, isShortStayCase, submitEnquiry } from "./kit";

const AREAS = [
  "Sukhumvit", "Silom", "Sathorn", "Thonglor", "Ekkamai", "Ari",
  "Asok", "Phrom Phong", "On Nut", "Ratchada", "Rama 9", "Riverside",
];
const BEDS = [
  { label: "Studio", value: "Studio" },
  { label: "1", value: "1" },
  { label: "2", value: "2" },
  { label: "3", value: "3" },
  { label: "4+", value: "4+" },
];
const OCCUPANTS = [
  { label: "1", value: "1" },
  { label: "2", value: "2" },
  { label: "3", value: "3" },
  { label: "4+", value: "4+" },
];
const STAY_LENGTHS = ["Under 6 months", "6–12 months", "1 year", "2 years+"];
const TIMELINES = ["ASAP", "Within 1 month", "1–3 months", "Just browsing"];

export default function ClientForm() {
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [showShortStay, setShowShortStay] = useState(false);

  const [intent, setIntent] = useState<"rent" | "buy">("rent");
  const [propType, setPropType] = useState<"condo" | "house" | "any">("condo");
  const [beds, setBeds] = useState<string | null>(null);
  const [areas, setAreas] = useState<string[]>([]);
  const [budget, setBudget] = useState("");
  const [stayLength, setStayLength] = useState("");
  const [timeline, setTimeline] = useState("");

  // About you
  const [nationality, setNationality] = useState("");
  const [occupants, setOccupants] = useState<string | null>(null);
  const [pets, setPets] = useState<"no" | "yes">("no");
  const [petDetails, setPetDetails] = useState("");
  const [occupation, setOccupation] = useState("");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [line, setLine] = useState("");
  const [notes, setNotes] = useState("");

  const isRent = intent === "rent";
  const totalSteps = 4;

  function toggleArea(a: string) {
    setAreas((p) => (p.includes(a) ? p.filter((x) => x !== a) : [...p, a]));
  }

  // Step 2 → 3, with the short-stay check for rentals
  function nextFromStep2() {
    if (isRent && isShortStayCase(stayLength, budget)) {
      setShowShortStay(true);
      return;
    }
    setStep(3);
  }

  async function submit() {
    setSubmitting(true);
    setSubmitError("");
    const ok = await submitEnquiry({
      kind: "CLIENT ENQUIRY (Renter / Buyer)",
      name, phone, line, email,
      summaryTitle: `${isRent ? "Rental" : "Purchase"} enquiry — ${name}`,
      notesLines: [
        `Looking to: ${isRent ? "Rent" : "Buy"}`,
        `Property type: ${propType}`,
        beds ? `Bedrooms: ${beds}` : null,
        areas.length ? `Preferred areas: ${areas.join(", ")}` : null,
        budget ? `Budget: ฿${budget}${isRent ? " / month" : ""}` : null,
        isRent && stayLength ? `Length of stay: ${stayLength}` : null,
        timeline ? `Timeline: ${timeline}` : null,
        `── About the client ──`,
        nationality ? `Nationality: ${nationality}` : null,
        occupants ? `Occupants: ${occupants}` : null,
        `Pets: ${pets === "yes" ? petDetails || "Yes" : "No"}`,
        occupation ? `Occupation: ${occupation}` : null,
        email ? `Email: ${email}` : null,
        notes ? `Notes: ${notes}` : null,
      ],
    });
    setSubmitting(false);
    if (ok) setDone(true);
    else setSubmitError("Something went wrong sending your enquiry. Please try again, or contact us on LINE or WhatsApp.");
  }

  if (done) {
    return (
      <SuccessCard
        title="Thank you"
        message="We've received your requirements and our team will curate matching properties and reach out within 2 hours during business hours."
      />
    );
  }

  return (
    <>
      <ShortStayNotice
        open={showShortStay}
        onContinue={() => { setShowShortStay(false); setStep(3); }}
        onAdjust={() => setShowShortStay(false)}
      />

      {step === 1 && (
        <StepShell
          step={1} total={totalSteps}
          title="What are you looking for?"
          subtitle="Tell us the essentials so we can match the right homes."
          canNext={true}
          onNext={() => setStep(2)}
          nextLabel="Continue"
        >
          <Field label="I'm looking to">
            <Segmented
              value={intent}
              onChange={setIntent}
              options={[{ label: "Rent", value: "rent" }, { label: "Buy", value: "buy" }]}
            />
          </Field>
          <Field label="Property type">
            <Segmented
              value={propType}
              onChange={setPropType}
              options={[
                { label: "Condo", value: "condo" },
                { label: "House", value: "house" },
                { label: "Any", value: "any" },
              ]}
            />
          </Field>
          <Field label="Bedrooms">
            <ChipSingle options={BEDS} value={beds} onChange={setBeds} />
          </Field>
        </StepShell>
      )}

      {step === 2 && (
        <StepShell
          step={2} total={totalSteps}
          title="Where and how much?"
          subtitle="Pick the areas you love and your budget."
          canNext={true}
          onBack={() => setStep(1)}
          onNext={nextFromStep2}
          nextLabel="Continue"
        >
          <Field label="Preferred areas" hint="select any">
            <ChipMulti options={AREAS} selected={areas} onToggle={toggleArea} />
          </Field>
          <Field label={`Budget${isRent ? " (per month)" : ""}`} hint="optional">
            <PrefixInput
              prefix="฿"
              inputMode="numeric"
              value={budget}
              onChange={(e) => setBudget(e.target.value.replace(/[^\d,.]/g, ""))}
              placeholder={isRent ? "e.g. 45,000" : "e.g. 8,000,000"}
            />
          </Field>
          {isRent && (
            <Field label="Length of stay">
              <ChipSingle
                options={STAY_LENGTHS.map((s) => ({ label: s, value: s }))}
                value={stayLength || null}
                onChange={setStayLength}
              />
            </Field>
          )}
          <Field label="Move-in timeline">
            <ChipSingle
              options={TIMELINES.map((t) => ({ label: t, value: t }))}
              value={timeline || null}
              onChange={setTimeline}
            />
          </Field>
        </StepShell>
      )}

      {step === 3 && (
        <StepShell
          step={3} total={totalSteps}
          title="About you"
          subtitle="Landlords ask us these — it helps us negotiate the best terms for you."
          canNext={true}
          onBack={() => setStep(2)}
          onNext={() => setStep(4)}
          nextLabel="Continue"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Nationality"><TextInput value={nationality} onChange={(e) => setNationality(e.target.value)} placeholder="e.g. British" /></Field>
            <Field label="Occupation"><TextInput value={occupation} onChange={(e) => setOccupation(e.target.value)} placeholder="e.g. Teacher, Engineer" /></Field>
          </div>
          <Field label="How many occupants?">
            <ChipSingle options={OCCUPANTS} value={occupants} onChange={setOccupants} />
          </Field>
          <Field label="Any pets?">
            <Segmented
              value={pets}
              onChange={setPets}
              options={[{ label: "No pets", value: "no" }, { label: "Yes", value: "yes" }]}
            />
          </Field>
          {pets === "yes" && (
            <Field label="Tell us about them" hint="type & size help us match pet-friendly buildings">
              <TextInput value={petDetails} onChange={(e) => setPetDetails(e.target.value)} placeholder="e.g. 1 small dog (poodle)" />
            </Field>
          )}
        </StepShell>
      )}

      {step === 4 && (
        <StepShell
          step={4} total={totalSteps}
          title="How can we reach you?"
          subtitle="We'll send tailored options — no spam, ever."
          canNext={name.trim().length > 0 && phone.trim().length > 0}
          onBack={() => setStep(3)}
          onNext={submit}
          nextLabel="Send my requirements"
          submitting={submitting}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Name"><TextInput value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" /></Field>
            <Field label="Phone / WhatsApp"><TextInput value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+66…" /></Field>
            <Field label="Email" hint="optional"><TextInput type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" /></Field>
            <Field label="LINE ID" hint="optional"><TextInput value={line} onChange={(e) => setLine(e.target.value)} placeholder="@yourid" /></Field>
          </div>
          <Field label="Anything else?" hint="optional">
            <TextArea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Furnished, high floor, near international school…" />
          </Field>
          {submitError && (
            <p className="font-sans text-[13px] text-red-500">{submitError}</p>
          )}
        </StepShell>
      )}
    </>
  );
}
