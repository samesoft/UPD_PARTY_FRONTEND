import DonateHero from "@/components/donate-hero";
import DonateForm from "@/components/donate-form";
import LegalInformation from "@/components/legal-information";

// export default function DonatePage() {
//   return (
//     <main className="min-h-screen">
//       <DonateHero />
//       <div className="py-12 bg-gray-50">
//         <div className="max-w-2xl mx-auto px-4">
//           <DonateForm />
//           <LegalInformation className="mt-8 w-full shadow-3xl" />
//         </div>
//       </div>
//     </main>
//   )
// }

export default function DonatePage() {
  return (
    <main className="min-h-screen">
      <DonateHero />
      <div className="py-12 bg-gray-50">
        {/* Increased width from max-w-2xl to max-w-4xl */}
        <div className="max-w-2xl mx-auto px-4">
          <DonateForm />
          {/* Ensure full width within the container */}
        </div>
      </div>
      <LegalInformation className="mt-8 mb-20 w-full " />
    </main>
  );
}
