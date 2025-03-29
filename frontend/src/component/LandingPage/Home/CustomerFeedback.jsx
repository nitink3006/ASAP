import React from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";

const feedbacks = [
  {
    id: 1,
    name: "John Doe",
    image: "https://img.freepik.com/free-photo/joyful-young-boy-looking-side-showing-thumbs-up-isolated-pink-wall_141793-110086.jpg?ga=GA1.1.408521021.1739420679&semt=ais_hybrid",
    rating: 4.5,
    comment: "Excellent service! The team was very professional and helpful. They guided me through the entire process, ensuring everything was perfect.",
  },
  {
    id: 2,
    name: "Jane Smith",
    image: "https://img.freepik.com/free-photo/beautiful-female-half-length-portrait-isolated-yellow-space-young-emotional-indian-woman-dress-pointing-showing-negative-space_155003-26622.jpg?ga=GA1.1.408521021.1739420679&semt=ais_hybrid",
    rating: 5,
    comment: "Amazing experience! Highly recommend their services. Their attention to detail and commitment to quality truly set them apart.",
  },
  {
    id: 3,
    name: "David Johnson",
    image: "https://img.freepik.com/free-psd/elegant-man-with-crossed-arms_1154-563.jpg?ga=GA1.1.408521021.1739420679&semt=ais_hybrid",
    rating: 4,
    comment: "Great quality service, but the response time could be improved. Overall, I was happy with the experience, but a quicker response would be appreciated.",
  },
  {
    id: 4,
    name: "Emily Carter",
    image: "https://img.freepik.com/free-photo/young-woman-standing-smiling-against-white-background_23-2148163917.jpg",
    rating: 5,
    comment: "Incredible service! They went above and beyond to make sure I was satisfied. Their professionalism and friendliness made the whole experience amazing.",
  },
  {
    id: 5,
    name: "Michael Brown",
    image: "https://img.freepik.com/free-photo/portrait-young-man-with-beard_23-2148201913.jpg",
    rating: 4.5,
    comment: "I have used their services multiple times, and every time they exceed expectations. The staff is friendly and always willing to help.",
  },
];

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
  return (
    <div className="bg-white py-12 px-6 lg:px-24 mt-16">
      {/* Heading */}
      <h1 className="text-4xl font-bold text-gray-900 text-center">Customer Feedback</h1>
      <p className="text-lg text-gray-600 text-center mt-2">See what our customers have to say</p>

      {/* Feedback Slider */}
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
        {feedbacks.map((feedback) => (
          <SwiperSlide key={feedback.id}>
            <div className="bg-gray-100 p-6 rounded-lg shadow-lg hover:shadow-xl transition-all">
              {/* Profile Section */}
              <div className="flex items-center space-x-4">
                <img src={feedback.image} alt={feedback.name} className="w-14 h-14 rounded-full border border-gray-300" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{feedback.name}</h3>
                  {getStars(feedback.rating)}
                </div>
              </div>
              {/* Feedback Comment */}
              <p className="text-gray-700 mt-4 italic">"{feedback.comment}"</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default CustomerFeedback;
