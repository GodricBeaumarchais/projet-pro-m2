/* eslint-disable @next/next/no-img-element */
"use client";

import Master from '../../../public/Season_2023_-_Master.png';

interface Player {
    id: number;
    name: string;
    pseudo: string;
    tag: string;
    summonerId: string;
    objectif: number;
}

export default function Card({ player }: { player: Player }) {
    // Simulation des points pour le test
    const mockPoints = Math.floor(Math.random() * player.objectif);

    return (
        <div className="relative bg-Hextech-600 inline-block rounded border border-gold-400 p-5 pr-8 pl-8 bg-opacity-40">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-Hextech-600 inline-block pl-3 pr-3 rounded border border-gold-400">
                <h1 className="font-beaufort-medium text-gold-400">
                    {player.name}
                </h1>
            </div>
            <div className='font-beaufort-medium text-gold-100'>
                <h2>{player.pseudo + "#" + player.tag}</h2>
            </div>

            <div>
                <img src={Master.src} alt="Master" className='h-12 mx-auto' />
            </div>

            <div>
                <p className='font-spiegel-regular text-gold-100'>{mockPoints + " / " + player.objectif} </p>
            </div>
        </div>
    );
}
