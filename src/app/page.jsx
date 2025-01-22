"use client";
import React from "react";
import { useState, useEffect } from 'react';

function MainComponent() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [rating, setRating] = useState(5);
  const [reviewerName, setReviewerName] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [restaurants, setRestaurants] = useState([
    {
      id: 1,
      name: "Peshawri - ITC Grand Chola",
      cuisine: "North Indian",
      description: "Famous for its Dal Bukhara and tandoori dishes",
      image: "/placeholder.jpg",
    },
    {
      id: 2,
      name: "Dakshin - Crowne Plaza",
      cuisine: "South Indian",
      description: "Authentic South Indian fine dining",
      image: "/placeholder.jpg",
    },
    {
      id: 3,
      name: "Southern Spice - Taj Coromandel",
      cuisine: "South Indian",
      description: "Traditional South Indian cuisine",
      image: "/placeholder.jpg",
    },
    {
      id: 4,
      name: "Pan Asian - ITC Grand Chola",
      cuisine: "Asian",
      description: "Best Asian cuisine in Chennai",
      image: "/placeholder.jpg",
    },
    {
      id: 5,
      name: "The Flying Elephant - Park Hyatt",
      cuisine: "Multi-cuisine",
      description: "Multi-level dining experience",
      image: "/placeholder.jpg",
    },
    {
      id: 6,
      name: "Avartana - ITC Grand Chola",
      cuisine: "Contemporary South Indian",
      description: "Modern take on South Indian cuisine",
      image: "/placeholder.jpg",
    },
    {
      id: 7,
      name: "Jamavar - The Leela Palace",
      cuisine: "Indian",
      description: "Luxury Indian dining experience",
      image: "/placeholder.jpg",
    },
    {
      id: 8,
      name: "China XO - The Leela Palace",
      cuisine: "Chinese",
      description: "Fine dining Chinese cuisine",
      image: "/placeholder.jpg",
    },
    {
      id: 9,
      name: "Focaccia - Hyatt Regency",
      cuisine: "Italian",
      description: "Authentic Italian dining",
      image: "/placeholder.jpg",
    },
    {
      id: 10,
      name: "Royal Vega - ITC Grand Chola",
      cuisine: "Vegetarian",
      description: "Luxury vegetarian dining",
      image: "/placeholder.jpg",
    },
  ]);
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setShowOtpInput(true);
  };
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setIsLoggedIn(true);
  };
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRestaurant) return;

    const newReviewObj = {
      restaurantId: selectedRestaurant.id,
      restaurantName: selectedRestaurant.name,
      rating,
      text: newReview,
      reviewerName,
      date: new Date().toLocaleDateString(),
    };
    setReviews([...reviews, newReviewObj]);
    setNewReview("");
    setReviewerName("");
  };

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      const updatedRestaurants = await Promise.all(
        restaurants.map(async (restaurant) => {
          try {
            const response = await fetch(
              `/integrations/image-search/imagesearch?q=${encodeURIComponent(
                restaurant.name + " Chennai restaurant"
              )}`
            );
            const data = await response.json();
            if (data.items && data.items[0]) {
              return {
                ...restaurant,
                image: data.items[0].originalImageUrl,
              };
            }
            return restaurant;
          } catch (error) {
            console.error("Error fetching image:", error);
            return restaurant;
          }
        })
      );
      setRestaurants(updatedRestaurants);
      setLoading(false);
    };

    fetchImages();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-roboto text-center mb-8 text-gray-800">
          Restaurant Reviews
        </h1>

        {!isLoggedIn ? (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            {!showOtpInput ? (
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div>
                  <label className="block font-roboto mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                    placeholder="Enter your email"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                >
                  Send OTP
                </button>
              </form>
            ) : (
              <form onSubmit={handleOtpSubmit} className="space-y-4">
                <div>
                  <label className="block font-roboto mb-2">Enter OTP</label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                    placeholder="Enter OTP sent to your email"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
                >
                  Verify OTP
                </button>
              </form>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {restaurants.map((restaurant) => (
                <div
                  key={restaurant.id}
                  className={`bg-white rounded-lg shadow-lg p-4 cursor-pointer transition-all duration-200 ${
                    selectedRestaurant?.id === restaurant.id
                      ? "ring-2 ring-blue-500"
                      : ""
                  }`}
                  onClick={() => setSelectedRestaurant(restaurant)}
                >
                  <img
                    src={restaurant.image}
                    alt={`Interior or signature dish of ${restaurant.name}`}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <h2 className="text-xl font-roboto font-bold">
                    {restaurant.name}
                  </h2>
                  <p className="text-gray-600">{restaurant.cuisine} Cuisine</p>
                  <p className="text-gray-500 text-sm mt-2">
                    {restaurant.description}
                  </p>
                </div>
              ))}
            </div>

            {selectedRestaurant && (
              <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <h2 className="text-2xl font-roboto mb-4">
                  Reviews for {selectedRestaurant.name}
                </h2>
                <div className="mb-4">
                  <span className="font-roboto">Logged in as: {email}</span>
                  <button
                    onClick={() => setIsLoggedIn(false)}
                    className="ml-4 text-red-500 hover:text-red-600"
                  >
                    Logout
                  </button>
                </div>
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div>
                    <label className="block font-roboto mb-2">Your Name</label>
                    <input
                      type="text"
                      value={reviewerName}
                      onChange={(e) => setReviewerName(e.target.value)}
                      className="w-full p-2 border rounded"
                      required
                      placeholder="Enter your name"
                    />
                  </div>
                  <div>
                    <label className="block font-roboto mb-2">Rating</label>
                    <select
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                      className="w-full p-2 border rounded"
                    >
                      {[1, 2, 3, 4, 5].map((num) => (
                        <option key={num} value={num}>
                          {"⭐".repeat(num)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-roboto mb-2">
                      Your Review
                    </label>
                    <textarea
                      value={newReview}
                      onChange={(e) => setNewReview(e.target.value)}
                      className="w-full p-2 border rounded h-24"
                      required
                      placeholder="Write your review here..."
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                  >
                    Submit Review
                  </button>
                </form>
              </div>
            )}
          </>
        )}

        <div className="space-y-4">
          {reviews
            .filter((review) => review.restaurantId === selectedRestaurant?.id)
            .map((review, index) => (
              <div key={index} className="bg-white rounded-lg shadow p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-yellow-400 mb-2">
                      {"⭐".repeat(review.rating)}
                    </div>
                    <p className="font-roboto font-medium mb-1">
                      {review.reviewerName}
                    </p>
                    <p className="font-roboto text-gray-700">{review.text}</p>
                  </div>
                  <div className="text-sm text-gray-500">
                    <div>{review.restaurantName}</div>
                    <div>{review.date}</div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default MainComponent;