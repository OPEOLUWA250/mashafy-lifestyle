import React from "react";
import { Link } from "react-router-dom";
import { Navbar } from "../../components/store/Navbar";
import { Footer } from "../../components/store/Footer";

export const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <section>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
          <h1 className="text-5xl font-bold text-gray-900 mb-8">
            About Mashafy
          </h1>

          <div className="prose prose-lg text-gray-700 space-y-6">
            <p>
              Mashafy Lifestyle is an inclusive lifestyle brand for visionaries
              who live with intention, faith, and courage. The brand name
              Mashafy is a combination of two Hebrew words meaning "beauty" and
              "influence" – embodying our mission to inspire confidence,
              reflection, and purposeful action.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mt-8">
              Our Mission
            </h2>
            <p>
              We create premium lifestyle pieces designed for individuals who
              want to express their ambition and values through everyday wear.
              Every product in our collection is curated with intentionality,
              reflecting our core values.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mt-8">
              Our Core Values: AFRICA
            </h2>
            <ul className="list-disc list-inside space-y-3 mt-4">
              <li>
                <strong>A - Ambition:</strong> Drive and determination to
                achieve greatness
              </li>
              <li>
                <strong>F - Faith:</strong> Trust in purpose and divine
                direction
              </li>
              <li>
                <strong>R - Refinement:</strong> Excellence in quality and
                execution
              </li>
              <li>
                <strong>I - Identity:</strong> Authentic expression of who you
                truly are
              </li>
              <li>
                <strong>C - Confidence:</strong> Believing in your power and
                inherent worth
              </li>
              <li>
                <strong>A - Audacity:</strong> Courage to stand out and be
                authentically bold
              </li>
            </ul>

            <h2 className="text-3xl font-bold text-gray-900 mt-8">
              The Muse Community
            </h2>
            <p>
              Our customers are called "Muse" – a gender-inclusive community of
              visionaries connected by purpose and belonging. We believe in
              building more than just a customer base; we're creating a movement
              of individuals who dare to live authentically.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mt-8">
              Our Products
            </h2>
            <p>
              Our launch collection features three signature pieces and premium
              journals:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <strong>I Dare to Stand Out:</strong> Unisex minimalist
                typography tee with universal appeal
              </li>
              <li>
                <strong>Ambitious and Anointed:</strong> Available in female and
                male cuts, empowering individuals with their identity
              </li>
              <li>
                <strong>Fierce and Fearless:</strong> Bold statement piece for
                those who dare differently
              </li>
              <li>
                <strong>Premium Journals:</strong> Curated for intentional
                living, reflection, and clarity
              </li>
            </ul>
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/shop"
              className="inline-block px-8 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition"
            >
              Explore Our Collection
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
