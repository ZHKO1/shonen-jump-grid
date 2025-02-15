import Canvas from "@/components/canvas";
import HeaderBar from "@/components/header-bar";

export default function Home() {
  return (
    <div>
      <header>
        <HeaderBar />
      </header>
      <main className="flex w-full bg-blue-100 p-3">
        <section className="w-[200px] mr-3 bg-green-100 hidden"></section>
        <section className="flex-1">
          <Canvas />
        </section>
        <section className="w-[200px] bg-red-100 hidden"></section>
      </main>
    </div>
  );
}
