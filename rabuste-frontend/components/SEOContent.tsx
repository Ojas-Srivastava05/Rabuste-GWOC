"use client";

import { useEffect, useState } from "react";

export default function SEOContent() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div 
      style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden' }}
      suppressHydrationWarning
      aria-hidden="true"
    >
      <h1>Premium Robusta Coffee Online - Buy Best Robusta Coffee Beans</h1>
      <p>Rabuste offers the finest Robusta coffee with 2x the caffeine. Shop premium Robusta coffee beans, ground Robusta coffee, and instant Robusta coffee online. Our Robusta coffee is sourced from the best coffee-growing regions and roasted to perfection. Experience bold, intense Robusta coffee flavor with every cup.</p>
      <h2>Why Choose Robusta Coffee?</h2>
      <p>Robusta coffee contains 2x the caffeine of Arabica coffee, making it perfect for those who need an extra energy boost. Robusta coffee beans are known for their strong, earthy flavor and higher caffeine content. Buy Robusta coffee online from Rabuste and enjoy the bold taste of premium Robusta coffee.</p>
      <h2>Best Robusta Coffee Online</h2>
      <p>Looking for the best Robusta coffee? Rabuste offers premium Robusta coffee beans, ground Robusta coffee, and instant Robusta coffee. All our Robusta coffee is carefully selected and roasted to bring out the bold, intense flavors that Robusta coffee is famous for. Order Robusta coffee online today and experience the difference.</p>
    </div>
  );
}
