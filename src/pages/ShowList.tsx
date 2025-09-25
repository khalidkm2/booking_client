import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { fetchShows } from "@/features/showSlice";
import { Link } from "react-router";
import Autoplay from "embla-carousel-autoplay";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from 'framer-motion';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// --- Mock carousel shows ---
const mockCarouselShows = [
  { id: 1, title: "Fantastic Four", image: "https://4kwallpapers.com/images/walls/thumbs_3t/23280.jpg" },
  { id: 2, title: "One Piece", image: "https://4kwallpapers.com/images/walls/thumbs_3t/23673.jpg" },
  { id: 3, title: "Interstellar", image: "https://c4.wallpaperflare.com/wallpaper/536/846/466/interstellar-movie-movies-wallpaper-preview.jpg" },
];

// --- Mock shows (fallback if API fails) ---
const mockShows = [
  { id: 101, title: "Avengers: Endgame", description: "The Avengers assemble once again to reverse the damage caused by Thanos.", startingTime: new Date("2025-09-22T18:00:00"), category: "Action", image: "https://via.placeholder.com/400x200?text=Avengers" },
  { id: 102, title: "Inception", description: "A thief steals corporate secrets through dream-sharing technology.", startingTime: new Date("2025-09-23T20:00:00"), category: "Sci-Fi", image: "https://via.placeholder.com/400x200?text=Inception" },
  { id: 103, title: "The Dark Knight", description: "Batman faces off against the Joker in Gotham City.", startingTime: new Date("2025-10-01T19:30:00"), category: "Action", image: "https://via.placeholder.com/400x200?text=Dark+Knight" },
];

// --- Carousel Component ---
export function CarouselPlugin() {
  const plugin = React.useRef(Autoplay({ delay: 2000, stopOnInteraction: true }));

  return (
    <div className="w-full bg-[#f5f3ee] mb-8 rounded-xl shadow-inner p-2">
      <Carousel
        plugins={[plugin.current]}
        className="w-full rounded-xl shadow-lg"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent>
          {mockCarouselShows.map((show) => (
            <CarouselItem key={show.id}>
              <div className="relative w-full h-[400px] md:h-[500px] rounded-xl overflow-hidden">
                <img src={show.image} alt={show.title} className="w-full h-full object-cover rounded-xl" />
                <div className="absolute bottom-6 left-6 md:left-12 text-[#d4af37] font-serif text-3xl md:text-5xl font-bold drop-shadow-xl">
                  {show.title}
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="text-white bg-black/50 hover:bg-black/70 rounded-full p-2 absolute top-1/2 -left-4 transform -translate-y-1/2" />
        <CarouselNext className="text-white bg-black/50 hover:bg-black/70 rounded-full p-2 absolute top-1/2 -right-4 transform -translate-y-1/2" />
      </Carousel>
    </div>
  );
}

// --- ShowList Component with Pagination ---
export default function ShowList() {
  const dispatch = useAppDispatch();
  const { shows, loading } = useAppSelector((s) => s.shows as any);
// const allShows = shows?.data || [];
const currentPage = shows?.currentPage || 1;
const totalPages = shows?.totalPages || 1;

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [timeFilter, setTimeFilter] = useState("All");

  // fetch API shows on page change
  useEffect(() => {
    dispatch(fetchShows(page));
  }, [dispatch, page]);

  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const allShows = shows?.data || mockShows;

  const filteredShows = allShows.filter((show: any) => {
    const showDate = new Date(show.startingTime);
    const matchesSearch = show.title.toLowerCase().includes(search.toLowerCase());

    let matchesTime = true;
    if (timeFilter === "Today") matchesTime = showDate.toDateString() === today.toDateString();
    else if (timeFilter === "Tomorrow") matchesTime = showDate.toDateString() === tomorrow.toDateString();
    else if (timeFilter === "Upcoming") matchesTime = showDate > tomorrow;

    return matchesSearch && matchesTime;
  });

  return (
    <div className="min-h-screen text-gray-200 font-serif bg-[#f5f3ee]">
      {/* Hero */}
      <header className="bg-black py-12 shadow-md border-b border-yellow-700 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-[#d4af37] mb-2 tracking-wide">🎥 Now Showing</h1>
        <p className="text-gray-400 italic text-lg md:text-xl">Experience cinema the vintage way</p>
      </header>

      {/* Carousel */}
      <main className="px-4 md:px-8 py-8">
        <CarouselPlugin />
      </main>

      {/* Filters */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
        <Input
          placeholder="🔍 Search shows..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/3 bg-[#2a2a2a] text-gray-200 border-yellow-700 placeholder:text-gray-400"
        />

        <div className="flex flex-wrap gap-3 items-center">
          {["All", "Today", "Tomorrow", "Upcoming"].map((filter) => (
            <Button
              key={filter}
              onClick={() => setTimeFilter(filter)}
              className={`${
                timeFilter === filter ? "bg-[#d4af37] text-black" : "bg-[#2a2a2a] text-gray-300 hover:bg-[#3a3a3a]"
              } border border-yellow-700 px-4 cursor-pointer py-2 rounded`}
            >
              {filter}
            </Button>
          ))}
        </div>
      </section>

      {/* Shows Grid */}
      <section >
        {/* {loading && <div className="col-span-full text-center text-gray-400">Loading...</div>} */}
<motion.div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pb-16">
{filteredShows.map((show: any) => (
          <Card
            key={show.id}
            className="bg-[#2a2a2a] cursor-pointer border border-yellow-700 overflow-hidden shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1"
          >
            <img src={show.image} alt={show.title} className="w-full h-56 object-cover" />
            <CardContent className="p-5">
              <h3 className="text-xl font-bold text-[#d4af37] mb-2">{show.title}</h3>
              <p className="text-gray-400 text-sm mb-3 line-clamp-3">{show.description}</p>
              {/* <p className="text-gray-300 text-sm mb-1">{new Date(show.startingTime).toLocaleString()}</p> */}
              <p className="text-gray-400 text-sm mb-4">🎭 {show.category}</p>
              <Link to={`/shows/${show.id}`}>
                <Button className="w-full cursor-pointer bg-[#d4af37] text-black hover:bg-yellow-500">
                  Book Now
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
</motion.div>
        

        {!loading && filteredShows.length === 0 && (
          <div className="col-span-full text-center text-gray-400 italic">There is no show at the moment.</div>
        )}
      </section>

      {/* Pagination Controls */}
      {totalPages > 1 && (
  <div className="flex justify-center items-center gap-4 mb-16">
    <Button
      disabled={page <= 1}
      onClick={() => setPage((p) => p - 1)}
      className="bg-[#2a2a2a] text-gray-200 border border-yellow-700"
    >
      Prev
    </Button>

    <span className="text-black font-semibold">
      Page {currentPage} of {totalPages}
    </span>

    <Button
      disabled={page >= totalPages}
      onClick={() => setPage((p) => p + 1)}
      className="bg-[#2a2a2a] text-gray-200 border border-yellow-700"
    >
      Next
    </Button>
  </div>
)}


      {/* Footer */}
      <footer className="bg-black border-t border-yellow-700 py-12 text-center text-gray-400">
        <p className="mb-2">&copy; 2025 Cinema Royale. All rights reserved.</p>
        <p className="mb-4">123 Movie Lane, Hollywood, CA</p>
        <div className="flex justify-center gap-4">
          <a href="#" className="hover:text-[#d4af37]">Facebook</a>
          <a href="#" className="hover:text-[#d4af37]">Twitter</a>
          <a href="#" className="hover:text-[#d4af37]">Instagram</a>
        </div>
      </footer>
    </div>
  );
}
