import { redirect } from 'next/navigation';

export default function CartPage() {
  // Online cart and delivery are disabled. Redirect to Contact page.
  redirect('/contact');
}