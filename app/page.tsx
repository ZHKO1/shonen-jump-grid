import Canvas from "@/components/canvas";
import HeaderBar from "@/components/header-bar";
import AttrCard from "@/components/attr-card";
import ImgCrop from "@/components/img-crop";
import Slider from "@/components/slider";
import Comic from "@/components/comic";

export default function Home() {
  return (
    <div className="w-full h-screen flex flex-col">
      <header className="h-12">
        <HeaderBar />
      </header>
      <main className="flex-1 relative flex overflow-auto">
        <section className="w-[150px] ">
          <Slider />
        </section>
        <section className="bg-blue-100 flex-1 overflow-auto">
          <Canvas />
        </section>
      </main>
      <section className="fixed right-8 top-16 z-10">
        <AttrCard />
      </section>
      <section>
        <ImgCrop />
      </section>
      <section>
        <Comic />
      </section>
    </div>
  );
}
