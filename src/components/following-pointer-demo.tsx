import { FollowerPointerCard } from "@/components/ui/following-pointer";

export default function FollowingPointerDemo() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4">
      <FollowerPointerCard
        title={
          <TitleComponent
            title={projectContent.author}
          />
        }
        className="w-full"
      >
        <div className="group relative overflow-hidden rounded-2xl border border-zinc-100 bg-white transition duration-200 hover:shadow-xl">
          <div className="flex flex-row">
            <div className="relative w-[40%] min-h-[200px] overflow-hidden rounded-l-2xl bg-gray-100">
              <img
                src={projectContent.image}
                alt="Projektinhallinta"
                className="absolute inset-0 h-full w-full transform object-cover transition duration-200 group-hover:scale-105"
              />
            </div>
            <div className="p-6 w-[60%] flex flex-col justify-center">
              <h2 className="text-xl font-bold text-zinc-800 mb-3">
                {projectContent.title}
              </h2>
              <p className="text-sm text-zinc-500 leading-relaxed mb-4">
                {projectContent.description}
              </p>
              <div className="flex flex-row items-center justify-between gap-4">
                <span className="text-xs text-gray-500 font-medium">{projectContent.date}</span>
                <div className="relative z-10 block rounded-xl bg-green-600 hover:bg-green-700 transition-colors px-5 py-2 text-xs font-bold text-white">
                  Lue lisää
                </div>
              </div>
            </div>
          </div>
        </div>
      </FollowerPointerCard>
    </div>
  );
}

const projectContent = {
  author: "LÄHDE Solutions",
  date: "Käytössä 2024",
  title: "Digitaalinen projektinhallinta",
  description:
    "Reaaliaikaiset kuvat, ohjeet ja tuntikirjaukset aina saatavilla. Turvallisuuskortit mukana jokaisella työmaalla.",
  image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=2940&auto=format&fit=crop",
};

const TitleComponent = ({ title }: { title: string }) => (
  <div className="flex items-center space-x-2">
    <div className="w-5 h-5 rounded-full bg-green-600 flex items-center justify-center">
      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
      </svg>
    </div>
    <p>{title}</p>
  </div>
);
