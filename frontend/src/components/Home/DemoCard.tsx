import { BorderBeam } from "@/components/magicui/BorderBeam";

 
export default function DemoCard() {
  return (
    <div className="flex justify-center items-center mt-[-90px] h-screen">
    <div className="relative h-[600px] w-[1100px] rounded-xl"
    style={{ boxShadow: '0 -40px 100px 10px rgba(255, 179, 71, 0.3)' }}
    >
      <BorderBeam />
    </div>
    </div>

  );
}

//rgba(255, 218, 185, 0.2) peach orange
//rgba(255, 204, 153, 0.2) light orange