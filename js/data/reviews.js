window.WH_REVIEWS = [
  { id: 1, name: 'Priya Sharma', city: 'Chennai', destination: 'Kerala', rating: 5, photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=128&q=80', text: 'Wild Holidays transformed our family trip into something magical. The houseboat, hill stay and every detail felt personally curated.', date: 'Feb 2026' },
  { id: 2, name: 'Arjun Mehta', city: 'Bangalore', destination: 'Malaysia', rating: 5, photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=128&q=80', text: 'Not a tour package — a genuine adventure. Rainforest trek and island day were highlights of our year. Exceptional curation.', date: 'Jan 2026' },
  { id: 3, name: 'Ananya Reddy', city: 'Hyderabad', destination: 'Andaman', rating: 5, photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=128&q=80', text: 'Our honeymoon was flawless. Secluded beaches, diving and boutique stays — everything felt intimate and luxurious.', date: 'Dec 2025' },
  { id: 4, name: 'Rahul Verma', city: 'Mumbai', destination: 'Goa', rating: 5, photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=128&q=80', text: 'Perfect balance of beach relaxation and cultural exploration. Spice plantation day was unforgettable for our family.', date: 'Nov 2025' },
  { id: 5, name: 'Deepa Nair', city: 'Kochi', destination: 'Malaysia', rating: 5, photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=128&q=80', text: 'Flawless curation from arrival to departure. Langkawi at sunset was pure magic. Will book again without hesitation.', date: 'Oct 2025' },
  { id: 6, name: 'Karthik Subramanian', city: 'Coimbatore', destination: 'Munnar', rating: 5, photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=128&q=80', text: 'Tea estate stay exceeded expectations. Misty mornings, hidden waterfalls — exactly the escape we needed.', date: 'Sep 2025' },
  { id: 7, name: 'Meera Joshi', city: 'Pune', destination: 'Ooty', rating: 4, photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=128&q=80', text: 'Weekend getaway planned perfectly. Toy train, botanical garden and a cozy heritage stay — all seamless.', date: 'Aug 2025' },
  { id: 8, name: 'Vikram Singh', city: 'Delhi', destination: 'Kerala', rating: 5, photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=128&q=80', text: 'Ayurveda retreat combined with backwaters was restorative. 24/7 WhatsApp support made us feel truly cared for.', date: 'Jul 2025' },
  { id: 9, name: 'Sneha Patel', city: 'Ahmedabad', destination: 'Andaman', rating: 5, photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=128&q=80', text: 'Travelled with kids — every activity was age-appropriate and safe. Havelock beach day was their favourite ever.', date: 'Jun 2025' },
  { id: 10, name: 'Rajesh Kumar', city: 'Madurai', destination: 'Goa', rating: 4, photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=128&q=80', text: 'Group of 8 friends — logistics handled perfectly. North Goa beaches and Dudhsagar trip were epic.', date: 'May 2025' },
  { id: 11, name: 'Lakshmi Iyer', city: 'Trichy', destination: 'Munnar', rating: 5, photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=128&q=80', text: 'Anniversary trip curated with such care. Private estate dinner under the stars — we will never forget it.', date: 'Apr 2025' },
  { id: 12, name: 'Farhan Ali', city: 'Chennai', destination: 'Malaysia', rating: 5, photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=128&q=80', text: 'First international trip and Wild Holidays made it stress-free. Visa guidance, transfers, hotels — all top class.', date: 'Mar 2025' }
];

window.WH_KVDB_URL = 'https://kvdb.io/4uDqjKAC9VQGCoSGGLW9Qe/reviews';
window.WH_CLOUD_REVIEWS = [];

window.whGetAllReviews = () => {
  return [...window.WH_CLOUD_REVIEWS, ...window.WH_REVIEWS];
};

window.whSyncOnlineReviews = async (onSyncComplete) => {
  try {
    const res = await fetch(WH_KVDB_URL);
    if (res.ok) {
      const online = await res.json();
      if (Array.isArray(online)) {
        window.WH_CLOUD_REVIEWS = online;
      }
    } else if (res.status === 404) {
      window.WH_CLOUD_REVIEWS = [];
    }
    if (typeof onSyncComplete === 'function') {
      onSyncComplete();
    }
  } catch (err) {
    console.warn('Could not sync reviews from cloud storage:', err);
    if (typeof onSyncComplete === 'function') {
      onSyncComplete();
    }
  }
};

window.whStars = (n) => '★'.repeat(n) + '☆'.repeat(5 - n);

window.whAvgRating = () => {
  const all = whGetAllReviews();
  if (!all.length) return '4.9';
  const sum = all.reduce((a, r) => a + r.rating, 0);
  return (sum / all.length).toFixed(1);
};
