import React, { useState } from "react";
import { Navbar } from "../../components/store/Navbar";
import { Footer } from "../../components/store/Footer";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setFormData({ name: "", email: "", subject: "", message: "" });
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <section>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Get in Touch
            </h1>
            <p className="text-lg text-gray-600">
              We'd love to hear from you. Drop us a message anytime.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <Phone className="w-8 h-8 text-primary-600 mx-auto mb-3" />
              <h3 className="font-bold text-gray-900 mb-2">Phone</h3>
              <a
                href="tel:+2348180129670"
                className="text-primary-600 hover:underline"
              >
                +234 818 012 9670
              </a>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <Mail className="w-8 h-8 text-primary-600 mx-auto mb-3" />
              <h3 className="font-bold text-gray-900 mb-2">Email</h3>
              <a
                href="mailto:hello@mashafy.com"
                className="text-primary-600 hover:underline"
              >
                hello@mashafy.com
              </a>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <MapPin className="w-8 h-8 text-primary-600 mx-auto mb-3" />
              <h3 className="font-bold text-gray-900 mb-2">Location</h3>
              <p className="text-gray-600">Lagos, Nigeria</p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <Send className="w-8 h-8 text-primary-600 mx-auto mb-3" />
              <h3 className="font-bold text-gray-900 mb-2">WhatsApp</h3>
              <a
                href="https://wa.me/2348180129670"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:underline"
              >
                Chat Now
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Send us a Message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-primary-600 text-white font-bold rounded-lg hover:bg-primary-700 transition"
                >
                  Send Message
                </button>

                {submitted && (
                  <div className="p-3 bg-green-100 text-green-700 rounded-lg text-center">
                    ✓ Message sent! We'll get back to you soon.
                  </div>
                )}
              </form>
            </div>

            {/* FAQs */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-bold text-gray-900 mb-2">
                    What's your return policy?
                  </h3>
                  <p className="text-gray-600 text-sm">
                    We offer a 30-day return policy for all items in original
                    condition.
                  </p>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-bold text-gray-900 mb-2">
                    How long does shipping take?
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Delivery typically takes 3-5 business days within Lagos, and
                    5-7 business days nationwide.
                  </p>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-bold text-gray-900 mb-2">
                    Do you ship internationally?
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Currently, we ship within Nigeria. International shipping
                    coming soon!
                  </p>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-bold text-gray-900 mb-2">
                    What payment methods do you accept?
                  </h3>
                  <p className="text-gray-600 text-sm">
                    We accept bank transfers, card payments, and mobile money
                    transfers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
