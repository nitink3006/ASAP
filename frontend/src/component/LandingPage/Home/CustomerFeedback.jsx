import React, { useEffect, useState } from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";
import Config from "../../../Config";

const getStars = (rating) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div className="flex text-yellow-500">
      {[...Array(fullStars)].map((_, i) => (
        <FaStar key={i} />
      ))}
      {halfStar && <FaStarHalfAlt />}
      {[...Array(emptyStars)].map((_, i) => (
        <FaRegStar key={i} />
      ))}
    </div>
  );
};

const CustomerFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${Config.API_URL}/feedback/`) 
      .then((res) => res.json())
      .then((data) => {
        setFeedbacks(data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching feedbacks:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="bg-white py-12 px-6 lg:px-24 mt-16">
      <h1 className="text-4xl font-bold text-gray-900 text-center">Customer Feedback</h1>
      <p className="text-lg text-gray-600 text-center mt-2">See what our customers have to say</p>

      {loading ? (
        <p className="text-center mt-6 text-gray-500">Loading feedback...</p>
      ) : (
        <Swiper
          modules={[Pagination, Autoplay]}
          slidesPerView={1}
          spaceBetween={20}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          className="mt-8"
        >
            {feedbacks
  .filter(fb => fb.rating !== null && fb.feedback !== null)
  .map((feedback, index) => (
    <SwiperSlide key={feedback.id}>
      <div className="bg-gray-100 p-6 rounded-lg shadow-lg hover:shadow-xl transition-all">
        <div className="flex items-center space-x-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{feedback.name}</h3>
            {getStars(feedback.rating)}
          </div>
        </div>
        <p className="text-gray-700 mt-4 italic">"{feedback.feedback}"</p>
      </div>
    </SwiperSlide>
))}

        </Swiper>
      )}
    </div>
  );
};

export default CustomerFeedback;
