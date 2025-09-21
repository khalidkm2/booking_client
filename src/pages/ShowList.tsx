import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { fetchShows } from "@/features/showSlice";
import { Link } from "react-router";
import Autoplay from "embla-carousel-autoplay";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

// --- Mock carousel shows ---
const mockCarouselShows = [
  {
    id: 1,
    title: "Avengers: Endgame",
    image:
      "https://media.istockphoto.com/id/533434644/photo/rocky-desert-landscape-at-dusk.jpg?s=2048x2048&w=is&k=20&c=eviuaDwxQzmOkIsuE94LHODBO187C-l9eOEYz5cmEJ4=",
  },
  { id: 2, title: "Inception", image: "https://via.placeholder.com/1200x500?text=Inception" },
  { id: 3, title: "Interstellar", image: "https://via.placeholder.com/1200x500?text=Interstellar" },
  { id: 4, title: "The Dark Knight", image: "https://via.placeholder.com/1200x500?text=The+Dark+Knight" },
  { id: 5, title: "Titanic", image: "https://via.placeholder.com/1200x500?text=Titanic" },
];

// --- Mock shows for grid ---
const mockShows = [
  {
    id: 101,
    title: "Avengers: Endgame",
    description: "The Avengers assemble once again to reverse the damage caused by Thanos.",
    startingTime: new Date("2025-10-01T18:00:00"),
    category: "Action",
    image: "https://via.placeholder.com/400x200?text=Avengers",
  },
  {
    id: 102,
    title: "Inception",
    description: "A thief steals corporate secrets through dream-sharing technology.",
    startingTime: new Date("2025-10-05T20:00:00"),
    category: "Sci-Fi",
    image: "https://via.placeholder.com/400x200?text=Inception",
  },
  {
    id: 103,
    title: "The Dark Knight",
    description: "Batman faces off against the Joker in Gotham City.",
    startingTime: new Date("2025-10-10T19:30:00"),
    category: "Action",
    image: "https://via.placeholder.com/400x200?text=Dark+Knight",
  },
  {
    id: 104,
    title: "Titanic",
    description: "A love story aboard the ill-fated RMS Titanic.",
    startingTime: new Date("2025-10-15T17:00:00"),
    category: "Romance",
    image: "https://via.placeholder.com/400x200?text=Titanic",
  },
  {
    id: 105,
    title: "Interstellar",
    description: "Explorers travel through a wormhole in search of a new home for humanity.",
    startingTime: new Date("2025-10-20T21:00:00"),
    category: "Sci-Fi",
    image: "https://via.placeholder.com/400x200?text=Interstellar",
  },
];

export function CarouselPlugin() {
  const plugin = React.useRef(Autoplay({ delay: 3000, stopOnInteraction: true }));

  return (
    <div className="w-full mb-8">
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
                <div className="absolute bottom-6 left-6 md:left-12 text-white text-3xl md:text-5xl font-bold drop-shadow-xl">
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

  useEffect(() => {
    dispatch(fetchShows());
  }, [dispatch]);

  const allShows = apiShows?.length ? apiShows : mockShows;

  const filteredShows = allShows.filter((show: any) => {
    const matchesSearch = show.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "All" ? true : show.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="px-4 md:px-8 py-8">
      <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center text-indigo-600">
        Book Your Tickets
      </h1>

      {/* Carousel */}
      <CarouselPlugin />

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <Input
          placeholder="Search shows..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/2"
        />
        <Select
          value={categoryFilter}
          onValueChange={setCategoryFilter}
          // className="w-full md:w-1/4"
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Categories</SelectItem>
            <SelectItem value="Action">Action</SelectItem>
            <SelectItem value="Romance">Romance</SelectItem>
            <SelectItem value="Sci-Fi">Sci-Fi</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading && <div className="text-center text-gray-500">Loading...</div>}

      {/* Shows Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredShows.map((show: any) => (
          <Card
            key={show.id}
            className="overflow-hidden shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1"
          >
            <img
              src={show.image}
              alt={show.title}
              className="w-full h-48 md:h-56 object-cover rounded-t-lg"
            />
            <CardContent className="p-4">
              <h3 className="text-xl font-semibold mb-2">{show.title}</h3>
              <p className="text-gray-500 text-sm mb-2 line-clamp-3">{show.description}</p>
              <p className="text-gray-700 font-medium mb-1">
                {new Date(show.startingTime).toLocaleString()}
              </p>
              <p className="text-gray-500 text-sm mb-3">Category: {show.category}</p>
              <Link to={`/shows/${show.id}`}>
                <Button size="sm" className="w-full">
                  Book Now
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
