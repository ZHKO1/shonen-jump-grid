import Canvas from "@/components/canvas";
import HeaderBar from "@/components/header-bar";
import AttrCard from "@/components/attr-card";

export default function Home() {
  return (
    <div>
      <header>
        <HeaderBar />
      </header>
      <main className="w-full bg-blue-100 p-3 relative">
        <section className="">
          <Canvas />
        </section>
        <section className="absolute right-3 top-3">
          <AttrCard />
        </section>
      </main>
    </div>
  );
}
