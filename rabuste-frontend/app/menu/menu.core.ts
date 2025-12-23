// @ts-nocheck
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { Draggable } from "gsap/Draggable";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(Flip, Draggable, ScrollTrigger);

class AccordionSlider {
	constructor() {
		this.slides = document.querySelectorAll(".slide");
		this.prevBtn = document.querySelector(".nav-prev");
		this.nextBtn = document.querySelector(".nav-next");
		this.currentIndex = -1;

		this.init();
	}

	init() {
		this.slides.forEach((slide, index) => {
			slide.addEventListener("click", () => this.setActiveSlide(index));
		});

		this.prevBtn.addEventListener("click", () => this.previousSlide());
		this.nextBtn.addEventListener("click", () => this.nextSlide());

		document.addEventListener("keydown", (e) => {
			if (e.key === "ArrowLeft") this.previousSlide();
			if (e.key === "ArrowRight") this.nextSlide();
		});
	}

	setActiveSlide(index) {
		if (this.currentIndex === index) {
			this.slides.forEach((slide) => slide.classList.remove("active"));
			this.currentIndex = -1;
		} else {
			this.slides.forEach((slide) => slide.classList.remove("active"));
			this.slides[index].classList.add("active");
			this.currentIndex = index;
		}
	}

	nextSlide() {
		const nextIndex =
			this.currentIndex === -1 ? 0 : (this.currentIndex + 1) % this.slides.length;
		this.setActiveSlide(nextIndex);
	}

	previousSlide() {
		const prevIndex =
			this.currentIndex === -1
				? this.slides.length - 1
				: (this.currentIndex - 1 + this.slides.length) % this.slides.length;
		this.setActiveSlide(prevIndex);
	}
}

// export the class and an init helper
export default AccordionSlider;

export function initAccordionSlider() {
  if (typeof document === "undefined") return null;
  return new AccordionSlider();
}

// auto-init when used directly in the browser
if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => {
    initAccordionSlider();
  });
}
