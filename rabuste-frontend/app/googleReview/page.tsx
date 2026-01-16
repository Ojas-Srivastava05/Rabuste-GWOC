export default function HomePage() {
  return (
    <main>
      {/* Other existing sections can stay above */}

      {/* Google Reviews Section */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center">
          What Our Customers Say
        </h2>

        <div className="overflow-hidden rounded-2xl shadow-lg">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3720.773390485566!2d72.7685952755903!3d21.161414680521286!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04d00111b19b5%3A0xba45eb84da00c79f!2sRABUSTE!5e0!3m2!1sen!2sin!4v1768583545449!5m2!1sen!2sin"
            className="w-full h-[350px] md:h-[450px] border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>

      {/* Other existing sections can stay below */}
    </main>
  );
}
