import { Button } from "@/components/ui/button";

// export default function ShopHero() {
//   return (
//     <div className="bg-primary text-white py-16">
//       <div className="container mx-auto px-4">
//         <h1 className="text-4xl md:text-6xl font-bold mb-4">Official Party Store</h1>
//         <p className="text-xl mb-8">Show your support with official merchandise</p>
//         <Button variant="secondary" size="lg">
//           Shop Now
//         </Button>
//       </div>
//     </div>
//   )
// }

export default function ShopHero() {
  return (
    <div className="bg-primary text-white py-16">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Official Party Store
        </h1>
        <p className="text-xl mb-8">
          Show your support with official merchandise
        </p>
        <Button variant="secondary" size="lg">
          Shop Now
        </Button>
      </div>
    </div>
  );
}
