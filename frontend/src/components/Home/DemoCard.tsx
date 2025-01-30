import { BorderBeam } from "@/components/magicui/BorderBeam";


export default function DemoCard() {
  return (
    <div className=
      "flex justify-center items-center  mx-auto px-4 sm:px-6 lg:px-8 -mt-5 sm:mt-0"
      
    >
      <div 
        className="relative w-full max-w-[1100px] aspect-[1.83/1] rounded-xl lg:rounded-2xl bg-gradient-to-b from-transparent to-black/5"
        style={{ 
          boxShadow: 'var(--card-shadow, 0 -40px 100px 10px rgba(255, 179, 71, 0.3))',
          minHeight: '300px'
        }}
      >
        <BorderBeam  />
      </div>
    </div>
  );
}