"use client";
import Image from 'next/image'
import Card from './components/playerCard/card';
import list from "./list.json";

export default function Home() {
  return (
    <div className="relative w-full h-screen bg-cover bg-center" style={{ backgroundImage: "url('/background.jpeg')" }}>
      {/* Overlay sombre */}
      <div className="absolute inset-0 bg-black opacity-50"></div>

      {/* Contenu au-dessus de l'overlay */}
      <div className="relative z-10 flex flex-col justify-start items-center h-full text-center text-white py-4 ">
        <Image src="/drill.svg" width={64} height={64} alt="Logo" />

        <h1 className="font-beaufort-bold text-4xl mt-20 bg-gradient-to-r from-gold-500 to-gold-400 bg-clip-text text-transparent">
          Aura Countdown Tracker
        </h1>
        <div className="flex flex-row space-x-20 mt-20">
          {
            list.map((player) => (
              <Card key={player.id} player={player} />
            ))}
        </div>
      </div>
    </div>
  );
}
