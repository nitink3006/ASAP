import Banner from "./Home/Banner";
import CustomerFeedback from "./Home/CustomerFeedback";
import Footer from "./Home/Footer";
import Navbar from "./Home/Navbar";
import Services from "./Home/Services";

const Home = () => {
  return (
    <div>
      <Navbar />
      <Banner />
      <Services />
      <CustomerFeedback />
      <Footer />
    </div>
  );
};

export default Home;
