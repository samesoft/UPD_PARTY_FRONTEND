import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";


const router = useRouter();
const actions = [
  {
    title: "MEMBERSHIP",
    description: "Join our party and make a difference in your community.",
    image: "/campaign.jpg",
    buttonText: "Join Now",
    onClick: () => {
      router.push('/create-account');
    },
  },
  {
    title: "VOLUNTEER",
    description: "Contribute your time and skills to support our cause.",
    image: "/Volun...jpg",
    buttonText: "Volunteer",
    onClick: () => { },
  },
  {
    title: "DONATE",
    description:
      "Support our campaign financially to help us reach more people.",
    image: "/HSMPIC1.jpg",
    buttonText: "Donate",
    onClick: () => { },
  },
];

export default function ActionCards({
  onMembershipClick,
}: {
  onMembershipClick: () => void;
}) {
  return (
    <section className="py-20 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-6xl font-bold text-center mb-12 text-primary">
          GET INVOLVED
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {actions.map((action, index) => (
            <div
              key={index}
              className="flex flex-col bg-white shadow-lg rounded-lg overflow-hidden"
            >
              <div className="relative aspect-[4/3]">
                <Image
                  src={action.image || "/placeholder.svg"}
                  alt={action.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-2xl font-bold mb-2 text-primary">
                  {action.title}
                </h3>
                <p className="text-gray-600 mb-4 flex-grow">
                  {action.description}
                </p>
                <Button
                  className="w-full text-lg py-6"
                  variant="default"
                  onClick={
                    action.title === "MEMBERSHIP"
                      ? onMembershipClick
                      : action.onClick
                  }
                >
                  {action.buttonText}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
