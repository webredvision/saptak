"use client";
import { useTheme } from "@/app/ThemeProvider.js";
import TestimonialTheme1 from "./testimonial-theme1.jsx";
import TestimonialTheme2 from "./testimonial-theme2.jsx";
import TestimonialTheme3 from "./testimonial-theme3.jsx";
import TestimonialTheme4 from "./testimonial-theme4.jsx";
import TestimonialTheme5 from "./testimonial-theme5.jsx";

const aboutMap = {
  theme1: TestimonialTheme1,
  theme2: TestimonialTheme2,
  theme3: TestimonialTheme3,
  theme4: TestimonialTheme4,
  theme5: TestimonialTheme5,
};

export default function Testimonial({testimonials}) {
  const { theme } = useTheme();
  const ThemedTestimonial = aboutMap[theme] || TestimonialTheme1;

  return <ThemedTestimonial testimonials={testimonials}/>;
}
