import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { fetchShows } from "@/features/showSlice";
import { Link } from "react-router";
import Autoplay from "embla-carousel-autoplay";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

// --- Mock carousel shows ---
const mockCarouselShows = [
  {
    id: 1,
    title: "Avengers: Endgame",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1Wv-3o5WjLuyNqHDaL5UvFL9Qqt68cqQ6VA&s",
  },
  { id: 2, title: "Inception", image: "https://via.placeholder.com/1200x500" },
  { id: 3, title: "Interstellar", image: "https://via.placeholder.com/1200x500" },
  { id: 4, title: "The Dark Knight", image: "https://via.placeholder.com/1200x500" },
  { id: 5, title: "Titanic", image: "https://via.placeholder.com/1200x500" },
];

// --- Mock shows ---
const mockShows = [
  {
    id: 101,
    title: "Avengers: Endgame",
    description: "The Avengers assemble once again to reverse the damage caused by Thanos.",
    startingTime: new Date("2025-09-22T18:00:00"),
    category: "Action",
    image: "https://via.placeholder.com/400x200?text=Avengers",
  },
  {
    id: 102,
    title: "Inception",
    description: "A thief steals corporate secrets through dream-sharing technology.",
    startingTime: new Date("2025-09-23T20:00:00"),
    category: "Sci-Fi",
    image: "https://via.placeholder.com/400x200?text=Inception",
  },
  {
    id: 103,
    title: "The Dark Knight",
    description: "Batman faces off against the Joker in Gotham City.",
    startingTime: new Date("2025-10-01T19:30:00"),
    category: "Action",
    image: "https://via.placeholder.com/400x200?text=Dark+Knight",
  },
];

export function CarouselPlugin() {
  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  );

  return (
    <div className="w-full bg-[#f5f3ee] mb-8">
      <Carousel
        plugins={[plugin.current]}
        className="w-full rounded-xl shadow-lg"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent>
          {mockCarouselShows.map((show) => (
            <CarouselItem key={show.id}>
              <div className="relative w-full h-[400px] md:h-[500px]">
                <img
                  src={show.image}
                  alt={show.title}
                  className="w-full h-full object-cover rounded-xl shadow-inner"
                />
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

export default function ShowList() {
  const dispatch = useAppDispatch();
  const { shows: apiShows, loading } = useAppSelector((s) => s.shows as any);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [timeFilter, setTimeFilter] = useState("All");

  useEffect(() => {
    dispatch(fetchShows());
  }, [dispatch]);

  const allShows = apiShows?.length ? apiShows : mockShows;

  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const filteredShows = allShows.filter((show: any) => {
    const showDate = new Date(show.startingTime);
    const matchesSearch = show.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      categoryFilter === "All" ? true : show.category === categoryFilter;

    let matchesTime = true;
    if (timeFilter === "Today") {
      matchesTime = showDate.toDateString() === today.toDateString();
    } else if (timeFilter === "Tomorrow") {
      matchesTime = showDate.toDateString() === tomorrow.toDateString();
    } else if (timeFilter === "Upcoming") {
      matchesTime = showDate > tomorrow;
    }

    return matchesSearch && matchesCategory && matchesTime;
  });

  return (
    <div className=" min-h-screen text-gray-200 font-serif">
      {/* Header */}
      <div className="bg-black py-10 shadow-md border-b border-yellow-700">
        <h1 className="text-center text-4xl md:text-5xl font-bold text-[#d4af37] tracking-wide">
          🎥 Now Showing
        </h1>
        <p className="text-center text-gray-400 mt-2 italic">
          Experience cinema the vintage way
        </p>
      </div>

      {/* Carousel */}
      <div className="px-4 md:px-8 py-8">
        <CarouselPlugin />
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
        <Input
          placeholder="🔍 Search shows..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/3 bg-[#2a2a2a] text-gray-200 border-yellow-700 placeholder:text-gray-400"
        />

        <div className="flex flex-wrap gap-3 items-center">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-40 bg-[#2a2a2a] border-yellow-700 text-gray-200">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Categories</SelectItem>
              <SelectItem value="Action">Action</SelectItem>
              <SelectItem value="Romance">Romance</SelectItem>
              <SelectItem value="Sci-Fi">Sci-Fi</SelectItem>
            </SelectContent>
          </Select>

          {["All", "Today", "Tomorrow", "Upcoming"].map((filter) => (
            <Button
              key={filter}
              onClick={() => setTimeFilter(filter)}
              className={`${
                timeFilter === filter
                  ? "bg-[#d4af37] text-black"
                  : "bg-[#2a2a2a] text-gray-300 hover:bg-[#3a3a3a]"
              } border border-yellow-700 px-4 py-2 rounded`}
            >
              {filter}
            </Button>
          ))}
        </div>
      </div>

      {/* Show Grid */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pb-16">
        {loading && (
          <div className="col-span-full text-center text-gray-400">Loading...</div>
        )}

        {filteredShows.map((show: any) => (
          <Card
            key={show.id}
            className="bg-[#2a2a2a] border border-yellow-700 overflow-hidden shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1"
          >
            <img
              src={show.image}
              alt={show.title}
              className="w-full h-56 object-cover"
            />
            <CardContent className="p-5 ">
              <h3 className="text-xl font-bold text-[#d4af37] mb-2">
                {show.title}
              </h3>
              <p className="text-gray-400 text-sm mb-3 line-clamp-3">
                {show.description}
              </p>
              <p className="text-gray-300 text-sm mb-1">
                {new Date(show.startingTime).toLocaleString()}
              </p>
              <p className="text-gray-400 text-sm mb-4">
                🎭 {show.category}
              </p>
              <Link to={`/shows/${show.id}`}>
                <Button className="w-full bg-[#d4af37] text-black hover:bg-yellow-500">
                  Book Now
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}

        {!loading && filteredShows.length === 0 && (
          <div className="col-span-full text-center text-gray-400 italic">
            No shows match your filters.
          </div>
        )}
      </div>
    </div>
  );
}
