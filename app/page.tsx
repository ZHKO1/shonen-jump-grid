import Canvas from "@/components/canvas";
import HeaderBar from "@/components/header-bar";
import AttrCard from "@/components/attr-card";
import ImgCrop from "@/components/img-crop";

export default function Home() {
  return (
    <div className="w-full h-screen flex flex-col">
      <header className="h-12">
        <HeaderBar />
      </header>
      <main className="flex-1 bg-blue-100 p-3 relative overflow-auto">
        <section className="">
          <Canvas />
        </section>
        <section className="fixed right-8 top-16 z-10">
          <AttrCard />
        </section>
        <section>
          <ImgCrop />
        </section>
      </main>
    </div>
  );
}
