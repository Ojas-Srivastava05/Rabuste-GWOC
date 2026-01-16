"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Harsh Tanawala",
    role: "Local Guide",
    image:
      "https://lh3.googleusercontent.com/a-/ALV-UjUGLsMtSIbTSBsmbMLhPc3CXmGmM2-6vzEww0IlQmjCKRQQdxCDCg=w72-h72-p-rp-mo-ba2-br100",
    rating: 5,
    text: `A great spot with a unique coffee!
I recently visited Coffee Cafe and really enjoyed my experience. I tried the ROBCO house Special, which was unlike anything I've had before—it was smooth, rich, and had a great depth of flavor. I also got the cheese bagel, which was perfectly toasted and had a generous amount of cheese.
The atmosphere was cozy and inviting, making it a perfect place to relax or get some work done. I'd highly recommend checking this place out if you're in the area and looking for a quality coffee shop.`,
    color: "#B87333",
  },
  {
    name: "Krutarth Joshi",
    role: "Local Guide",
    image:
      "https://lh3.googleusercontent.com/a-/ALV-UjWKm_P8pxZEwlEaKat-OhNFKsumJRK8NF9hWJDlOtKkXrv7RtGlEA=w72-h72-p-rp-mo-ba5-br100",
    rating: 5,
    text: `The best of the best bold robusta cappuccino.
Surat city's best cappuccino you can get here
Since 1st time I had I am coming here every single day and it's totally Totally worth it.
Small cozy place with natural plantation.
Great service. Always smiling and positive attitude.
Looking forward for some more options in food menu...`,
    color: "#B87333",
  },
  {
    name: "Viren Sanghavi",
    role: "Local Guide",
    image:
      "https://lh3.googleusercontent.com/a-/ALV-UjW676Bg3N1aiIP7Eq085J4uXM2AAuofetrFlWUh1cpsBPqdC_RG=w72-h72-p-rp-mo-ba5-br100",
    rating: 5,
    text: `Rabuste Coffee offers a solid experience with their Red Bull espresso, which I found to be both good and decently priced. The service is impressively fast, and the ambiance adds to the appeal. The coffee was freshly brewed, delivering a perfect hit of rich, dark flavors. Definitely worth a visit!`,
    color: "#B87333",
  },
  {
    name: "Tiya Sukhrani",
    role: "",
    image:
      "https://lh3.googleusercontent.com/a-/ALV-UjVFgb_Vmegl7zODhZ2eZIcZ9I-wO_f2S4zg6tgwzhmV2yiWzfxP=w72-h72-p-rp-mo-br100",
    rating: 5,
    text: `I’d like to share my experience visting here, the staff is very good, coffee on spot, and siders are also good, liked the desert too, i mostly visit here and i like the place, good for people who work from cafe. MUST VISIT!!`,
    color: "#B87333",
  },
  {
    name: "Urvashi Shah",
    role: "",
    image:
      "https://lh3.googleusercontent.com/a/ACg8ocJ5paIULgUkTnhDTtxBFbzWZiXWtclnUq2QiwTqKjUfcUDmnw=w72-h72-p-rp-mo-br100",
    rating: 5,
    text: `Beautiful little Cozy Cute Café ☕
with indoor & outdoor sitting..
Nicely decorated with greenery..
Peaceful place👌🏻

They have great knowledge about different coffees..beans.. tastes n flavours..
Must visit if you are a coffee lover`,
    color: "#B87333",
  },
  {
    name: "Darshil Dalal",
    role: "",
    image:
      "https://lh3.googleusercontent.com/a-/ALV-UjUf0I4o6eptZrU7Upscm4F6grbGQ1mo2T3JZ5socDC_z_1ts8XC=w72-h72-p-rp-mo-br100",
    rating: 5,
    text: `Very original coffee beans and u must try this if u want dark and woody coffee flavours!`,
    color: "#B87333",
  },
  {
    name: "Rahul Dangi",
    role: "",
    image:
      "https://lh3.googleusercontent.com/a/ACg8ocKy72nGmjBZZvPhthgviDKdGfQoz0HFXDH-IYuy8JNQcV8hug=w72-h72-p-rp-mo-br100",
    rating: 5,
    text: `Great ambience with quality coffee, one of the best place if you are willing to have a peaceful background.`,
    color: "#B87333",
  },
  {
    name: "Moon",
    role: "",
    image:
      "https://lh3.googleusercontent.com/a-/ALV-UjX_1YGKAsnMJU5lVyoy17wp0w7R9YutNdSHwtysADN2xMleODeBGQ=w72-h72-p-rp-mo-ba2-br100",
    rating: 5,
    text: `Great coffee, quick service and very competitively priced. In my opinion, it makes for the best take away coffee shop, which it’s meant to be.`,
    color: "#B87333",
  },
];

export default function TestimonialsSection() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <section
      className="relative overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, #000000 0%, #1A1110 50%, #000000 100%)",
        padding: "clamp(80px, 15vw, 120px) 0",
      }}
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
        <div
          className="
            flex gap-6
            overflow-x-auto
            flex-nowrap
            max-w-6xl mx-auto
            pb-6
            scroll-smooth
          "
          style={{
            WebkitOverflowScrolling: "touch",
            scrollSnapType: "x mandatory",
          }}
        >
          {testimonials.map((testimonial, index) => {
            const isExpanded = expandedIndex === index;
            const text = testimonial.text ?? "";

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className="group relative shrink-0 flex flex-col justify-between"
                style={{
                  width: "380px",
                  scrollSnapAlign: "start",
                  background: "rgba(26, 17, 16, 0.6)",
                  border: `1px solid rgba(184, 115, 51, 0.2)`,
                  padding: "clamp(24px, 4vw, 32px)",
                  transition: "all 0.3s ease",
                  minHeight: "420px", // ensures all cards are same height
                }}
              >
                <Quote
                  size={32}
                  className="absolute top-4 right-4 opacity-5"
                  style={{ color: "#B87333" }}
                />

                <div>
                  {/* Star Rating */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, starIndex) => (
                      <Star
                        key={starIndex}
                        size={14}
                        fill="#B87333"
                        color="#B87333"
                      />
                    ))}
                  </div>

                  {/* Testimonial Text */}
                  <p
                    style={{
                      fontSize: "clamp(0.9rem, 1.8vw, 1rem)",
                      lineHeight: 1.7,
                      color: "rgba(245, 241, 232, 0.8)",
                      marginBottom: "10px",
                      overflow: "hidden",
                      display: "-webkit-box",
                      WebkitLineClamp: isExpanded ? undefined : 5,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    "{text}"
                  </p>

                  {/* Read More Button */}
                  {text.length > 180 && (
                    <button
                      onClick={() => toggleExpand(index)}
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "#B87333",
                        cursor: "pointer",
                        fontSize: "0.85rem",
                        fontWeight: "500",
                      }}
                    >
                      {isExpanded ? "Show Less" : "Read More"}
                    </button>
                  )}
                </div>

                {/* Profile Section */}
                <div
                  className="flex items-center gap-3 pt-4 border-t mt-4"
                  style={{
                    borderColor: "rgba(184, 115, 51, 0.2)",
                    minHeight: "60px", // fixed height ensures consistent spacing
                  }}
                >
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      border: `2px solid rgba(184, 115, 51, 0.3)`,
                    }}
                  />
                  <div className="flex flex-col justify-center">
                    <div style={{ color: "#F5F1E8" }}>{testimonial.name}</div>
                    {testimonial.role ? (
                      <div style={{ color: "#B87333", fontSize: "0.75rem" }}>
                        {testimonial.role}
                      </div>
                    ) : (
                      <div style={{ height: "0.75rem" }} /> // placeholder for consistent spacing
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
