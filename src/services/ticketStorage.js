const STORAGE_KEY = 'orbix_purchases';

function readPurchases() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
}

function writePurchases(purchases) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(purchases.slice(0, 40)));
}

export function getStoredPurchases(user) {
  const purchases = readPurchases();
  if (!user?.email) return purchases;
  return purchases.filter((purchase) => purchase.user?.email === user.email);
}

export function addStoredPurchase(purchase) {
  const purchases = readPurchases();
  const normalized = {
    ...purchase,
    storedAt: new Date().toISOString()
  };
  writePurchases([
    normalized,
    ...purchases.filter((item) => item.id !== normalized.id)
  ]);
  return normalized;
}
