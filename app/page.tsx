import Canvas from "@/src/components/canvas";
import HeaderBar from "@/src/components/header-bar";

export default function Home() {
  return (
    <div className="p-3">
      <header className="h-12 bg-gray-100">
        <HeaderBar />
      </header>
      <main className="flex w-full bg-yellow-100">
        <section className="w-[200px] mr-3 bg-green-100 hidden"></section>
        <section className="flex-1 bg-blue-100">
          <Canvas />
        </section>
        <section className="w-[200px] bg-red-100 hidden"></section>
      </main>
    </div>
  );
}
