import AttrCard from '@/components/attr-card'
import Canvas from '@/components/canvas'
import Comic from '@/components/comic'
import HeaderBar from '@/components/header-bar'
import ImgCrop from '@/components/img-crop'
import Slider from '@/components/slider'
import './App.css'

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
        <section className="bg-blue-100 flex-1 overflow-hidden">
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
  )
}
