// Wishlist utility for saving & managing favorite professionals across the platform

export interface WishlistPro {
  id: number;
  name?: string;
  service_category?: string;
  rate?: string;
  location?: string;
  image?: string;
  rating?: number;
  reviews?: number;
  id_verified?: boolean;
}

const STORAGE_KEY = "saved_professionals";

export function getWishlist(): WishlistPro[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("Failed to load wishlist:", e);
    return [];
  }
}

export function isWishlisted(id: number): boolean {
  const list = getWishlist();
  return list.some((item) => item.id === id);
}

export function toggleWishlist(pro: WishlistPro): { isSaved: boolean; count: number } {
  const current = getWishlist();
  const index = current.findIndex((item) => item.id === pro.id);
  let updated: WishlistPro[];
  let isSaved = false;

  if (index >= 0) {
    updated = current.filter((item) => item.id !== pro.id);
    isSaved = false;
  } else {
    updated = [
      {
        id: pro.id,
        name: pro.name,
        service_category: pro.service_category,
        rate: pro.rate,
        location: pro.location,
        image: pro.image,
        rating: pro.rating,
        reviews: pro.reviews,
        id_verified: pro.id_verified,
      },
      ...current,
    ];
    isSaved = true;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent("wishlist_updated", { detail: { updated, isSaved, proId: pro.id } }));
  } catch (e) {
    console.error("Failed to save wishlist:", e);
  }

  return { isSaved, count: updated.length };
}

export function removeFromWishlist(id: number): WishlistPro[] {
  const current = getWishlist();
  const updated = current.filter((item) => item.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent("wishlist_updated", { detail: { updated, isSaved: false, proId: id } }));
  } catch (e) {
    console.error("Failed to remove from wishlist:", e);
  }
  return updated;
}
