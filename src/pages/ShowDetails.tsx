import React, { useEffect } from "react";
import { useParams, Link } from "react-router";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { fetchShow } from "@/features/showSlice";
import { Button } from "@/components/ui/button";

export default function ShowDetails() {
  const { id } = useParams();
  const dispatch = useAppDispatch();

  const show = useAppSelector((s) =>
    s.shows.shows.find((x: any) => x.id === Number(id))
  );

  useEffect(() => {
    if (id) dispatch(fetchShow(Number(id)));
  }, [id, dispatch]);

  if (!show)
    return (
      <div className="text-center py-20 text-yellow-800 font-serif text-xl">
        Loading...
      </div>
    );

  return (
    <div className="w-full font-serif bg-[#f5f3ee] text-[#333]">
      {/* Hero Banner */}
      <div
        className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] bg-contain bg-center shadow-inner"
        style={{ backgroundImage: `url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0jAQyrTZmgF1Tq2OMkO33l_-i3fs8LvfGwHGYopERKtZgbFA82kNuj2w8N1uN2qr12X8&usqp=CAU)` }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="absolute bottom-6 left-6 md:left-12 text-yellow-100">
          <h1 className="text-3xl md:text-5xl font-bold drop-shadow-lg tracking-wide">
            {show.title}
          </h1>
          <p className="mt-2 md:mt-4 text-lg md:text-xl font-medium drop-shadow-lg">
            {show.category} | {show.language} | {show.ageLimit}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Poster & Details */}
        <div className="bg-[#fffaf0] shadow-md rounded-lg overflow-hidden">
          <img
            src={show.image}
            alt={show.title}
            className="w-full h-64 object-cover"
          />
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-2 text-[#b58900]">
              {show.title}
            </h2>
            <p className="text-gray-700 mb-2">{show.description}</p>

            <div className="mb-3 space-y-1">
              <p>
                <span className="font-semibold">Category:</span> {show.category}
              </p>
              <p>
                <span className="font-semibold">Language:</span> {show.language}
              </p>
              <p>
                <span className="font-semibold">Age Limit:</span> {show.ageLimit}
              </p>
              <p>
                <span className="font-semibold">Duration:</span> {show.duration} mins
              </p>
              <p>
                <span className="font-semibold">Start Time:</span>{" "}
                {new Date(show.startingTime).toLocaleString()}
              </p>
              <p>
                <span className="font-semibold">Rating:</span> {show.rating}/10
              </p>
              <p>
                <span className="font-semibold">Seats Available:</span>{" "}
                {/* {show.availableSeats}/{show.totalSeats} */}
              </p>
            </div>

            <p className="text-[#b58900] text-xl font-bold mb-4">
              {/* Price: ${show.price.toFixed(2)} */}
            </p>

            <Link to={`/shows/${show.id}/seats`}>
              <Button
                size="lg"
                className="w-full bg-[#b58900] hover:bg-[#d4a017] text-black"
              >
                Select Seats
              </Button>
            </Link>
          </div>
        </div>

        {/* Additional Info Panel */}
        <div className="md:col-span-2 bg-[#fffaf0] p-6 shadow-md rounded-lg flex flex-col justify-between">
          <h3 className="text-2xl font-bold mb-4 text-[#b58900]">
            About This Movie
          </h3>
          <p className="text-gray-800 leading-relaxed mb-6">
            {show.description} Experience the cinematic journey of {show.title},
            a classic {show.category} movie that captivates audiences with
            incredible storytelling, stellar performances, and breathtaking
            visuals.
          </p>

          {/* Optional: Rating Stars */}
          <div className="flex items-center mb-4">
            <span className="text-yellow-500 text-xl mr-2">
              {"★".repeat(Math.floor(show.rating as number))}
              {"☆".repeat(10 - Math.floor(show.rating as number))}
            </span>
            <span className="text-gray-700 ml-2">{show.rating}/10</span>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <Link to={`/shows/${show.id}/seats`}>
              <Button
                size="lg"
                className="w-full md:w-auto bg-[#b58900] hover:bg-[#d4a017] text-black"
              >
                Book Now
              </Button>
            </Link>
            <Link to="/shows">
              <Button
                size="lg"
                variant="outline"
                className="w-full md:w-auto border-[#b58900] text-[#b58900] hover:bg-[#fff3c0]"
              >
                Back to Shows
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
