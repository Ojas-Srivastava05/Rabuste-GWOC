import MenuItem from "./MenuItem";

type Item = {
  id: string;
  name: string;
  price: number;
};

type Props = {
  title: string;
  items: Item[];
};

export default function CategorySection({ title, items }: Props) {
  return (
    <section className="mb-8">
      <h2 className="text-xl font-semibold mb-3 text-[#e6c9a8]">{title}</h2>
      <div className="space-y-3">
        {items.map((item) => (
          <MenuItem key={item.id} {...item} />
        ))}
      </div>
    </section>
  );
}
