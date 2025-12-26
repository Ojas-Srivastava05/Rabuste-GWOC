import CategorySection from "../components/CategorySection";
import CartButton from "../components/CartButton";

const MENU = [
  {
    title: "Robusta Speciality Coffee (Cold)",
    items: [
      { id: "rs-iced-americano", name: "Iced Americano", price: 160 },
      { id: "rs-iced-espresso", name: "Iced Espresso", price: 130 },
      { id: "rs-cranberry-tonic", name: "Cranberry Tonic", price: 270 },
    ],
  },
  {
    title: "Food",
    items: [
      { id: "fries", name: "Fries", price: 150 },
      { id: "pizza", name: "Pizza", price: 300 },
      { id: "veg-nuggets", name: "Veg Nuggets", price: 190 },
    ],
  },
];

export default function MenuPage() {
  return (
    <div className="min-h-screen bg-[#1b120a] text-[#f3e9dc] p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Menu</h1>

      {MENU.map((section) => (
        <CategorySection
          key={section.title}
          title={section.title}
          items={section.items}
        />
      ))}

      <CartButton />
    </div>
  );
}
