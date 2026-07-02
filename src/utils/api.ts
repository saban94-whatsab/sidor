export async function fetchLiveOrders(): Promise<Order[]> {
  // השתמש בכתובת ה-exec המלאה והמעודכנת שלך
  const WEBAPP_URL = "https://script.google.com/macros/s/AKfycbw33NLnaki_W-nz9svqsYSTEaYa7Yn96bPCN1qHZNlZzrh5oJKJceDQUUMlI4nSvdjuVg/exec";
  
  const response = await fetch(`${WEBAPP_URL}?action=getOrders`);
  
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  
  const json = await response.json();
  if (!json.success) throw new Error(json.error || "Failed to fetch orders");
  
  return json.data;
}
