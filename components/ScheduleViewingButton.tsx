"use client";
import { useState } from "react";
import { CalendarDays } from "lucide-react";
import ScheduleViewingModal, { type ScheduleViewingContext } from "@/components/ScheduleViewingModal";

// Opens the schedule-viewing form. `variant` matches the two placements:
// "primary" — gold CTA on a listing page; "outline" — on the enquiry hub.
export default function ScheduleViewingButton({
  context = {},
  variant = "primary",
  className = "",
}: {
  context?: ScheduleViewingContext;
  variant?: "primary" | "outline";
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  const styles =
    variant === "primary"
      ? "bg-[#B8935A] text-white hover:bg-[#a07d4a]"
      : "bg-white text-[#0A0A0A] border border-[#E8E4DC] hover:border-[#B8935A]";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`press w-full inline-flex items-center justify-center gap-2 font-sans text-[14px] font-medium py-3.5 rounded-full transition-colors duration-300 ${styles} ${className}`}
      >
        <CalendarDays size={16} strokeWidth={1.8} />
        Schedule Viewing
      </button>
      {open && <ScheduleViewingModal context={context} onClose={() => setOpen(false)} />}
    </>
  );
}
