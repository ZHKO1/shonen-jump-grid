import Canvas from "@/components/Canvas";
import HeaderBar from "@/components/HeaderBar";

export default function Home() {
  return (
    <div className="h-screen p-3 flex flex-col">
      <header className="h-16 bg-gray-100">
        <HeaderBar />
      </header>
      <main className="flex w-full h-full bg-yellow-100">
        <section className="w-[200px] mr-3 bg-green-100 hidden"></section>
        <section className="flex-1 bg-blue-100">
          <Canvas />
        </section>
        <section className="w-[200px] bg-red-100 hidden"></section>
      </main>
    </div>
  );
}
